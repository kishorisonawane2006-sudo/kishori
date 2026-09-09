import {
  GeoCoordinate,
  GeoFencePolygon,
  ProximityScore,
  DistanceMatrixResult,
  CarrierType,
} from '../../src/types';

// ─── Seed Geo-Fence Zones ─────────────────────────────────────────────────────

const GEO_FENCES: GeoFencePolygon[] = [
  {
    id: 'gf-apollo-manhattan',
    pharmacyId: 'TNT-3109',
    pharmacyName: 'Apollo Pharmacy — Manhattan Hub',
    radiusMiles: 4.0,
    maxDeliveryMins: 75,
    isActive: true,
    coverageLabel: 'Manhattan & Lower East Side',
    vertices: [
      { latitude: 40.8176, longitude: -74.0099 },
      { latitude: 40.8176, longitude: -73.9071 },
      { latitude: 40.7005, longitude: -73.9071 },
      { latitude: 40.7005, longitude: -74.0099 },
    ],
  },
  {
    id: 'gf-carepoint-brooklyn',
    pharmacyId: 'TNT-8492',
    pharmacyName: 'CarePoint Healthcare — Brooklyn Zone',
    radiusMiles: 3.5,
    maxDeliveryMins: 90,
    isActive: true,
    coverageLabel: 'Brooklyn & Park Slope',
    vertices: [
      { latitude: 40.7282, longitude: -74.0207 },
      { latitude: 40.7282, longitude: -73.9340 },
      { latitude: 40.6501, longitude: -73.9340 },
      { latitude: 40.6501, longitude: -74.0207 },
    ],
  },
  {
    id: 'gf-healthkart-queens',
    pharmacyId: 'TNT-5021',
    pharmacyName: 'HealthKart Generic Direct — Queens',
    radiusMiles: 5.0,
    maxDeliveryMins: 120,
    isActive: true,
    coverageLabel: 'Queens & Long Island City',
    vertices: [
      { latitude: 40.7900, longitude: -73.9500 },
      { latitude: 40.7900, longitude: -73.7800 },
      { latitude: 40.6900, longitude: -73.7800 },
      { latitude: 40.6900, longitude: -73.9500 },
    ],
  },
  {
    id: 'gf-sunmed-bronx',
    pharmacyId: 'TNT-1194',
    pharmacyName: 'SunMed Drugstores — Bronx',
    radiusMiles: 4.5,
    maxDeliveryMins: 100,
    isActive: true,
    coverageLabel: 'Bronx & Upper Manhattan',
    vertices: [
      { latitude: 40.9200, longitude: -73.9500 },
      { latitude: 40.9200, longitude: -73.8200 },
      { latitude: 40.8100, longitude: -73.8200 },
      { latitude: 40.8100, longitude: -73.9500 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Haversine formula — calculates great-circle distance between two coordinates.
 * Returns distance in miles.
 */
function haversineDistanceMiles(a: GeoCoordinate, b: GeoCoordinate): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.asin(Math.sqrt(h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Point-in-polygon test using ray casting.
 * Returns true if the coordinate is inside the given polygon vertices.
 */
function pointInPolygon(point: GeoCoordinate, polygon: GeoCoordinate[]): boolean {
  const { latitude: px, longitude: py } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude;
    const yi = polygon[i].longitude;
    const xj = polygon[j].latitude;
    const yj = polygon[j].longitude;
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Proximity score for Buy-Box weighting (ADR-004):
 *   score = max(0, 100 − (distanceMiles × 5))
 */
function proximityScore(distanceMiles: number): number {
  return Math.max(0, Math.round(100 - distanceMiles * 5));
}

function selectCarrierForDistance(distanceMiles: number, isColdChain: boolean): CarrierType {
  if (distanceMiles <= 10) return 'Dunzo';
  if (distanceMiles <= 50 && !isColdChain) return 'Shadowfax';
  return 'FedEx Healthcare Express';
}

// ─── Geo-Fencing Service ─────────────────────────────────────────────────────

export class GeoFencingService {
  /**
   * Returns all active geo-fence zones.
   */
  public getZones(): GeoFencePolygon[] {
    return GEO_FENCES.filter(z => z.isActive);
  }

  public getZone(id: string): GeoFencePolygon | undefined {
    return GEO_FENCES.find(z => z.id === id);
  }

  /**
   * Adds or updates a geo-fence zone.
   */
  public upsertZone(zone: GeoFencePolygon): GeoFencePolygon {
    const idx = GEO_FENCES.findIndex(z => z.id === zone.id);
    if (idx !== -1) {
      GEO_FENCES[idx] = zone;
    } else {
      GEO_FENCES.push(zone);
    }
    return zone;
  }

  /**
   * Determines whether a delivery coordinate falls within a pharmacy's service zone.
   * First checks the polygon boundary, then falls back to radius check.
   */
  public isWithinZone(pharmacyId: string, deliveryCoord: GeoCoordinate): boolean {
    const zone = GEO_FENCES.find(z => z.pharmacyId === pharmacyId && z.isActive);
    if (!zone) return false;

    // Polygon check
    if (zone.vertices.length >= 3 && pointInPolygon(deliveryCoord, zone.vertices)) {
      return true;
    }

    // Circular radius fallback — use centroid of polygon
    const centroid = this.polygonCentroid(zone.vertices);
    const dist = haversineDistanceMiles(centroid, deliveryCoord);
    return dist <= zone.radiusMiles;
  }

  /**
   * Workstream 2.4 — Proximity-based Buy-Box weighting.
   * Scores all active pharmacy zones against the patient's delivery address.
   * Results feed directly into the ADR-004 composite Buy-Box score.
   */
  public scoreProximity(
    deliveryCoord: GeoCoordinate,
    isColdChain = false
  ): ProximityScore[] {
    return GEO_FENCES.filter(z => z.isActive).map(zone => {
      const centroid = this.polygonCentroid(zone.vertices);
      const distMiles = +haversineDistanceMiles(centroid, deliveryCoord).toFixed(2);
      const score = proximityScore(distMiles);
      const inZone = this.isWithinZone(zone.pharmacyId, deliveryCoord);
      const carrier = selectCarrierForDistance(distMiles, isColdChain);
      const estDeliveryMins = inZone
        ? zone.maxDeliveryMins
        : Math.min(480, zone.maxDeliveryMins + Math.round(distMiles * 10));

      return {
        pharmacyId: zone.pharmacyId,
        pharmacyName: zone.pharmacyName,
        distanceMiles: distMiles,
        proximityScore: score,
        estimatedDeliveryMins: estDeliveryMins,
        withinServiceZone: inZone,
        carrier,
      };
    }).sort((a, b) => b.proximityScore - a.proximityScore);
  }

  /**
   * Workstream 2.4 — Google Distance Matrix stub.
   * In production: calls the Google Distance Matrix API.
   * In development/demo: returns a Haversine estimate.
   */
  public async getDistanceMatrix(
    originAddress: string,
    destinationCoord: GeoCoordinate,
    pharmacyCoord: GeoCoordinate
  ): Promise<DistanceMatrixResult> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (apiKey) {
      try {
        const url =
          `https://maps.googleapis.com/maps/api/distancematrix/json` +
          `?origins=${encodeURIComponent(originAddress)}` +
          `&destinations=${destinationCoord.latitude},${destinationCoord.longitude}` +
          `&units=imperial&key=${apiKey}`;

        const res = await fetch(url);
        const data = (await res.json()) as {
          rows?: Array<{ elements?: Array<{ distance?: { value: number }; duration?: { value: number } }> }>;
        };
        const element = data?.rows?.[0]?.elements?.[0];
        if (element?.distance && element?.duration) {
          return {
            originAddress,
            destinationAddress: `${destinationCoord.latitude},${destinationCoord.longitude}`,
            distanceMiles: +(element.distance.value / 1609.34).toFixed(2),
            durationMins: Math.round(element.duration.value / 60),
            source: 'google',
          };
        }
      } catch {
        // Fall through to stub
      }
    }

    // Haversine stub fallback
    const distMiles = +haversineDistanceMiles(pharmacyCoord, destinationCoord).toFixed(2);
    return {
      originAddress,
      destinationAddress: `${destinationCoord.latitude},${destinationCoord.longitude}`,
      distanceMiles: distMiles,
      durationMins: Math.round(distMiles * 4.5), // ~13 mph average urban speed
      source: 'stub',
    };
  }

  /**
   * Finds the nearest pharmacy with available inventory for a given salt,
   * used during breach re-dispatch to route to an alternate fulfillment center.
   * Falls back to closest pharmacy by distance if none are within zone.
   */
  public findNearestAlternatePharmacy(
    deliveryCoord: GeoCoordinate,
    excludePharmacyId: string
  ): ProximityScore | null {
    const scores = this.scoreProximity(deliveryCoord).filter(
      s => s.pharmacyId !== excludePharmacyId
    );
    // Prefer pharmacies within their service zone; fall back to closest by distance
    const inZone = scores.filter(s => s.withinServiceZone);
    return (inZone[0] ?? scores[0]) ?? null;
  }

  // ─── Utilities ─────────────────────────────────────────────────────────────

  private polygonCentroid(vertices: GeoCoordinate[]): GeoCoordinate {
    if (vertices.length === 0) return { latitude: 40.7128, longitude: -74.006 };
    const lat = vertices.reduce((s, v) => s + v.latitude, 0) / vertices.length;
    const lng = vertices.reduce((s, v) => s + v.longitude, 0) / vertices.length;
    return { latitude: lat, longitude: lng };
  }
}

export const geoFencingService = new GeoFencingService();
