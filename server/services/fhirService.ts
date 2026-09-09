import {
  EhrProvider,
  EhrProviderSystem,
  FhirMedicationRequest,
  FhirIngestResult,
  FhirSignatureStatus,
  CartHydrationPayload,
  CartHydrationStatus,
} from '../../src/types';

// ─── EHR Provider Registry ────────────────────────────────────────────────────

const EHR_PROVIDERS: EhrProvider[] = [
  {
    id: 'ehr-epic-01',
    name: 'Epic',
    displayName: 'Epic MyChart / EpicCare',
    fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    version: 'R4',
    supportsDigitalSignature: true,
    connectedHospitals: 2850,
    isActive: true,
  },
  {
    id: 'ehr-cerner-01',
    name: 'Cerner',
    displayName: 'Oracle Health (Cerner Millennium)',
    fhirBaseUrl: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d',
    version: 'R4',
    supportsDigitalSignature: true,
    connectedHospitals: 1800,
    isActive: true,
  },
  {
    id: 'ehr-practo-01',
    name: 'Practo',
    displayName: 'Practo Ray Clinic Management',
    fhirBaseUrl: 'https://api.practo.com/fhir/r4',
    version: 'R4',
    supportsDigitalSignature: true,
    connectedHospitals: 340,
    isActive: true,
  },
  {
    id: 'ehr-kareo-01',
    name: 'Kareo',
    displayName: 'Kareo Clinical EHR',
    fhirBaseUrl: 'https://api.kareo.com/fhir/r4',
    version: 'R4',
    supportsDigitalSignature: false,
    connectedHospitals: 180,
    isActive: true,
  },
  {
    id: 'ehr-athena-01',
    name: 'AthenaHealth',
    displayName: 'Athenahealth Network',
    fhirBaseUrl: 'https://api.platform.athenahealth.com/fhir/r4',
    version: 'R4',
    supportsDigitalSignature: true,
    connectedHospitals: 920,
    isActive: true,
  },
];

// ─── NMC/State Medical Council Certificate Registry Stub ─────────────────────

/** In production: queries NMC REST API or state board registry in real time */
const VERIFIED_DOCTOR_CERTS = new Set([
  'MCR-NY-89421',
  'MCR-NY-44201',
  'MCR-CA-10028',
  'MCR-TX-77401',
  'NMC-DL-29881',
  'NMC-MH-10021',
  'CERT-EPIC-SHA256-A1B2C3',
  'CERT-CERNER-SHA256-D4E5F6',
]);

// ─── In-memory storage ────────────────────────────────────────────────────────

const ingestedRequests = new Map<string, FhirMedicationRequest>();
const hydrationPayloads = new Map<string, CartHydrationPayload>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateCartToken(): string {
  return `CHT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function extractSaltFromCoding(coding: FhirMedicationRequest['medicationCodeableConcept']['coding']): string {
  const rxnorm = coding.find(c => c.system.includes('rxnorm') || c.system.includes('RxNorm'));
  return rxnorm?.display ?? coding[0]?.display ?? 'Unknown Salt';
}

function verifyDigitalSignature(request: FhirMedicationRequest): FhirSignatureStatus {
  const regNum = request.requester.registrationNumber;
  const thumbprint = request.requester.certificateThumbprint;

  // Check registration number against NMC registry
  if (!regNum || !VERIFIED_DOCTOR_CERTS.has(regNum)) {
    // Also check certificate thumbprint
    if (thumbprint && VERIFIED_DOCTOR_CERTS.has(thumbprint)) {
      return 'VERIFIED';
    }
    return 'INVALID_CERTIFICATE';
  }

  // Check signature validity period
  if (request.signature) {
    const sigDate = new Date(request.signature.when);
    const now = new Date();
    const ageDays = (now.getTime() - sigDate.getTime()) / 86_400_000;
    if (ageDays > 365) return 'EXPIRED_CERTIFICATE';
  }

  return 'VERIFIED';
}

function mapToCartItems(request: FhirMedicationRequest): FhirIngestResult['medications'] {
  return request.dosageInstruction.map((di, idx) => {
    const salt = extractSaltFromCoding(request.medicationCodeableConcept.coding);
    const doseRate = di.doseAndRate?.[0]?.doseQuantity;
    return {
      genericSalt: salt,
      brandReference: request.medicationCodeableConcept.text ?? salt,
      dosage: doseRate ? `${doseRate.value}${doseRate.unit}` : (di.text ?? 'As directed'),
      quantity: request.dispenseRequest?.quantity?.value ?? 30,
      isRxRequired: true,
    };
  });
}

// ─── FHIR Service ─────────────────────────────────────────────────────────────

export class FhirService {
  /**
   * Workstream 3.1 — Ingest a FHIR R4 MedicationRequest.
   * Validates the resource shape, verifies the doctor's digital signature,
   * and generates a cart hydration token for one-click checkout.
   */
  public ingestMedicationRequest(
    resource: FhirMedicationRequest,
    providerId?: string
  ): FhirIngestResult {
    // FHIR conformance — resource type must be MedicationRequest
    if (resource.resourceType !== 'MedicationRequest') {
      throw new Error(
        `FHIR_CONFORMANCE_ERROR: Expected resourceType "MedicationRequest", received "${resource.resourceType}"`
      );
    }

    // Required fields per FHIR R4 spec
    if (!resource.id || !resource.status || !resource.intent || !resource.subject?.reference) {
      throw new Error('FHIR_CONFORMANCE_ERROR: Missing required R4 fields (id, status, intent, subject)');
    }

    if (!resource.requester?.registrationNumber) {
      throw new Error('FHIR_CONFORMANCE_ERROR: requester.registrationNumber is mandatory for dispensing');
    }

    const signatureStatus = verifyDigitalSignature(resource);
    const cartToken = generateCartToken();
    const provider = EHR_PROVIDERS.find(p => p.id === providerId);
    const ehrProvider: EhrProviderSystem = provider?.name ?? 'Practo';

    // Attach token back onto the resource for lookup
    resource.cartHydrationToken = cartToken;
    resource.ehrProviderId = providerId;

    ingestedRequests.set(resource.id, resource);

    const medications = mapToCartItems(resource);
    const cartHydrationStatus: CartHydrationStatus =
      signatureStatus === 'VERIFIED' ? 'READY' : 'PENDING_RX_CHECK';

    // Create hydration payload (magic link)
    const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    const magicLinkUrl = `https://app.genericstore.health/checkout?token=${cartToken}&rx=${resource.id}`;

    const payload: CartHydrationPayload = {
      token: cartToken,
      patientId: resource.subject.reference,
      cartItems: medications.map(m => ({
        genericSalt: m.genericSalt,
        quantity: m.quantity,
        prescribedDose: m.dosage,
        fhirRequestId: resource.id,
      })),
      magicLinkUrl,
      expiresAt,
      status: cartHydrationStatus,
    };
    hydrationPayloads.set(cartToken, payload);

    return {
      fhirRequestId: resource.id,
      patientName: resource.subject.display,
      patientReference: resource.subject.reference,
      doctorName: resource.requester.display,
      doctorRegistrationNumber: resource.requester.registrationNumber,
      ehrProvider,
      medications,
      signatureStatus,
      cartHydrationToken: cartToken,
      cartHydrationStatus,
      ingestedAt: new Date().toISOString(),
    };
  }

  /**
   * Verifies a doctor's digital signature/certificate independently.
   */
  public verifySignature(
    registrationNumber: string,
    certificateThumbprint?: string
  ): FhirSignatureStatus {
    if (VERIFIED_DOCTOR_CERTS.has(registrationNumber)) return 'VERIFIED';
    if (certificateThumbprint && VERIFIED_DOCTOR_CERTS.has(certificateThumbprint)) return 'VERIFIED';
    return 'INVALID_CERTIFICATE';
  }

  /**
   * Returns the cart hydration payload for a given token (magic link resolution).
   */
  public resolveCartHydration(token: string): CartHydrationPayload | null {
    const payload = hydrationPayloads.get(token);
    if (!payload) return null;

    // Check expiry
    if (new Date(payload.expiresAt) < new Date()) {
      payload.status = 'FAILED';
      return payload;
    }

    return payload;
  }

  /** Returns a specific ingested FHIR resource by ID */
  public getMedicationRequest(id: string): FhirMedicationRequest | undefined {
    return ingestedRequests.get(id);
  }

  /** Returns all ingested FHIR resources */
  public getAllMedicationRequests(): FhirMedicationRequest[] {
    return Array.from(ingestedRequests.values());
  }

  /** Returns all registered EHR providers */
  public getProviders(): EhrProvider[] {
    return EHR_PROVIDERS;
  }

  /** Returns a specific EHR provider by ID */
  public getProvider(id: string): EhrProvider | undefined {
    return EHR_PROVIDERS.find(p => p.id === id);
  }
}

export const fhirService = new FhirService();
