import React, { useState } from 'react';
import { EhrProvider, FhirIngestResult, FhirMedicationRequest, FhirSignatureStatus } from '../../types';
import { INITIAL_FHIR_PROVIDERS, INITIAL_FHIR_REQUESTS } from '../../data/initialData';

const SIG_STATUS_CONFIG: Record<FhirSignatureStatus, { bg: string; text: string; icon: string; label: string }> = {
  VERIFIED:             { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'verified',          label: 'Digitally Verified'          },
  PENDING_VERIFICATION: { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: 'pending',           label: 'Pending Verification'        },
  INVALID_CERTIFICATE:  { bg: 'bg-rose-50',    text: 'text-rose-700',    icon: 'gpp_bad',           label: 'Invalid Certificate'         },
  EXPIRED_CERTIFICATE:  { bg: 'bg-rose-50',    text: 'text-rose-700',    icon: 'timer_off',         label: 'Expired Certificate'         },
  REGISTRY_UNREACHABLE: { bg: 'bg-slate-100',  text: 'text-slate-600',   icon: 'cloud_off',         label: 'Registry Unreachable'        },
};

export const FhirEhrScreen: React.FC = () => {
  const [providers] = useState<EhrProvider[]>(INITIAL_FHIR_PROVIDERS);
  const [selectedProvider, setSelectedProvider] = useState<EhrProvider | null>(null);
  const [ingestedResults, setIngestedResults] = useState<FhirIngestResult[]>([]);
  const [selectedFhirRequest, setSelectedFhirRequest] = useState<FhirMedicationRequest | null>(null);
  const [ingestLoading, setIngestLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'providers' | 'ingest' | 'history'>('providers');

  const handleIngest = (resource: FhirMedicationRequest) => {
    setIngestLoading(true);
    setTimeout(() => {
      const token = `CHT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const result: FhirIngestResult = {
        fhirRequestId: resource.id,
        patientName: resource.subject.display,
        patientReference: resource.subject.reference,
        doctorName: resource.requester.display,
        doctorRegistrationNumber: resource.requester.registrationNumber,
        ehrProvider: selectedProvider?.name ?? 'Practo',
        medications: resource.dosageInstruction.map((di) => ({
          genericSalt: resource.medicationCodeableConcept.coding[0]?.display ?? resource.medicationCodeableConcept.text,
          brandReference: resource.medicationCodeableConcept.text,
          dosage: di.text,
          quantity: resource.dispenseRequest?.quantity?.value ?? 30,
          isRxRequired: true,
        })),
        signatureStatus: resource.requester.registrationNumber.startsWith('MCR') ? 'VERIFIED' : 'INVALID_CERTIFICATE',
        cartHydrationToken: token,
        cartHydrationStatus: 'READY',
        ingestedAt: new Date().toISOString(),
      };
      setIngestedResults(prev => [result, ...prev]);
      setIngestLoading(false);
      setActiveTab('history');
    }, 900);
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard?.writeText(`https://app.genericstore.health/checkout?token=${token}`).catch(() => {});
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 filled">local_hospital</span>
            FHIR / HL7 EHR Integration Gateway
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            HL7 FHIR R4 · Digital Signature Verification · One-Click Cart Hydration — Phase 3 Workstream 3.1
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
          <span className="material-symbols-outlined text-[14px]">hub</span>
          {providers.filter(p => p.isActive).length} Active EHR Connections
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
        {(['providers', 'ingest', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all cursor-pointer
              ${activeTab === tab ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>
            {tab === 'history' ? `Ingested (${ingestedResults.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map(provider => (
            <div key={provider.id}
              onClick={() => { setSelectedProvider(provider); setActiveTab('ingest'); }}
              className={`bg-white rounded-2xl border shadow-xs p-4 cursor-pointer transition-all hover:shadow-md
                ${selectedProvider?.id === provider.id ? 'border-blue-400 ring-2 ring-blue-200' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600 filled">local_hospital</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{provider.name}</p>
                    <p className="text-xs text-slate-500">{provider.version}</p>
                  </div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full mt-1 ${provider.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">{provider.displayName}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Hospitals</p>
                  <p className="font-bold text-slate-800">{provider.connectedHospitals.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Digital Sig.</p>
                  <p className={`font-bold ${provider.supportsDigitalSignature ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {provider.supportsDigitalSignature ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs font-mono text-slate-400 truncate">{provider.fhirBaseUrl}</div>
            </div>
          ))}
        </div>
      )}

      {/* Ingest Tab */}
      {activeTab === 'ingest' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            {selectedProvider && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="material-symbols-outlined text-blue-600 filled">hub</span>
                <div>
                  <p className="text-xs font-bold text-blue-800">Connected: {selectedProvider.displayName}</p>
                  <p className="text-xs text-blue-600 font-mono">{selectedProvider.fhirBaseUrl}</p>
                </div>
              </div>
            )}
            <p className="text-sm font-semibold text-slate-700">Available FHIR MedicationRequests</p>
            <div className="flex flex-col gap-3">
              {INITIAL_FHIR_REQUESTS.map(req => (
                <div key={req.id}
                  onClick={() => setSelectedFhirRequest(req)}
                  className={`bg-white rounded-xl border p-3 cursor-pointer transition-all hover:shadow-sm
                    ${selectedFhirRequest?.id === req.id ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{req.subject.display}</p>
                      <p className="text-xs text-slate-500">{req.requester.display}</p>
                      <p className="text-xs font-mono text-slate-400 mt-1">ID: {req.id}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border
                      ${req.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{req.medicationCodeableConcept.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            {selectedFhirRequest ? (
              <>
                <p className="text-sm font-bold text-slate-900 mb-4">Ingest FHIR Request</p>
                <div className="flex flex-col gap-3 text-xs mb-5">
                  {[
                    { label: 'Resource Type',  value: selectedFhirRequest.resourceType },
                    { label: 'Resource ID',    value: selectedFhirRequest.id },
                    { label: 'Patient',        value: selectedFhirRequest.subject.display },
                    { label: 'Prescriber',     value: selectedFhirRequest.requester.display },
                    { label: 'Reg. No.',       value: selectedFhirRequest.requester.registrationNumber },
                    { label: 'Medication',     value: selectedFhirRequest.medicationCodeableConcept.text },
                    { label: 'Authored On',    value: selectedFhirRequest.authoredOn },
                    { label: 'Status',         value: selectedFhirRequest.status },
                  ].map(f => (
                    <div key={f.label} className="flex gap-2">
                      <span className="text-slate-400 w-24 flex-shrink-0">{f.label}</span>
                      <span className="font-semibold text-slate-800 font-mono break-all">{f.value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleIngest(selectedFhirRequest)} disabled={ingestLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60 cursor-pointer transition-all">
                  {ingestLoading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Ingesting…</>
                    : <><span className="material-symbols-outlined text-[18px]">download</span>Ingest &amp; Verify Signature</>}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <span className="material-symbols-outlined text-4xl block mb-2">description</span>
                <p className="text-sm">Select a FHIR request to preview</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-4">
          {ingestedResults.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
              <p className="text-sm">No ingested prescriptions yet. Use the Ingest tab to import a FHIR request.</p>
            </div>
          )}
          {ingestedResults.map(result => {
            const sigCfg = SIG_STATUS_CONFIG[result.signatureStatus];
            return (
              <div key={result.fhirRequestId} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{result.patientName}</p>
                    <p className="text-xs text-slate-500">{result.doctorName} · {result.ehrProvider}</p>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">Rx ID: {result.fhirRequestId}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${sigCfg.bg} ${sigCfg.text}`}>
                    <span className="material-symbols-outlined text-[13px] filled">{sigCfg.icon}</span>
                    {sigCfg.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {result.medications.map((med, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                      {med.genericSalt} {med.dosage} × {med.quantity}
                    </span>
                  ))}
                </div>
                {result.cartHydrationStatus === 'READY' && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px] filled">link</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-800">Cart Hydration Ready</p>
                      <p className="text-[10px] font-mono text-emerald-600 truncate">
                        {result.cartHydrationToken}
                      </p>
                    </div>
                    <button onClick={() => handleCopyToken(result.cartHydrationToken)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer transition-all flex-shrink-0">
                      {copiedToken === result.cartHydrationToken ? '✓ Copied' : 'Copy Magic Link'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
