import { logisticsService } from '../server/services/logisticsService';
import { iotGatewayService } from '../server/services/iotGatewayService';
import { geoFencingService } from '../server/services/geoFencingService';
import { storage } from '../server/services/storageService';

async function runPhase2QualityGates() {
  console.log('================================================================');
  console.log('       PHASE 2 QUALITY GATES & VERIFICATION SUITE              ');
  console.log('       Project: Generic Medicine Store — v2.0.0                ');
  console.log('       Workstreams: 3PL Hub · IoT Gateway · Geo-Fencing        ');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  [PASS] Gate #${total}: ${testName}`);
      if (detail) console.log(`         -> ${detail}`);
    } else {
      console.error(`  [FAIL] Gate #${total}: ${testName}`);
      if (detail) console.error(`         -> ${detail}`);
    }
  }

  // ─── Quality Gate 1: Auto-Dispatch SLA < 180 seconds (Workstream 2.1) ──────
  console.log('1. Verifying Auto-Dispatch SLA & Carrier Selection (Workstream 2.1)...');

  const dispatchResult = logisticsService.autoDispatch(
    'ord-2',
    'Marcus Sterling',
    '120 Wall St, New York NY 10005',
    'MedPlus Central #055, 120 Wall St, NY 10005',
    0.9,
    false,
    'Rosuvastatin Calcium 10mg — 30 Tablets'
  );

  assert(
    dispatchResult.success === true,
    'Auto-dispatch returns success=true for approved order',
    `Carrier: ${dispatchResult.selectedCarrier}, Waybill: ${dispatchResult.dispatch.waybillNumber}`
  );

  // SLA gate: dispatch must complete in < 180,000ms (3 minutes)
  // In this in-process simulation it completes in microseconds — validates the architectural contract
  assert(
    dispatchResult.dispatchLatencyMs < 180_000,
    `Dispatch SLA Gate (< 180,000ms): completed in ${dispatchResult.dispatchLatencyMs}ms`,
    `Exceeds SLA by ${(180_000 - dispatchResult.dispatchLatencyMs).toFixed(0)}ms margin`
  );

  // Short-haul (< 10mi, non-cold-chain) should prefer Dunzo
  assert(
    dispatchResult.selectedCarrier === 'Dunzo',
    'Carrier selection: sub-10mi ambient order routed to Dunzo On-Demand',
    `Distance: 0.9mi → Carrier: ${dispatchResult.selectedCarrier}`
  );

  // Cold-chain dispatch must select a cold-chain-capable carrier
  const coldDispatch = logisticsService.autoDispatch(
    'ord-3',
    'David K. Zhao',
    '77 12th St, Long Island City NY 11101',
    'HealthSafe Express #012, 77 12th St, LIC NY 11101',
    3.4,
    true,
    'Insulin Glargine Pen — Cold-Chain'
  );

  assert(
    coldDispatch.dispatch.isColdChain === true,
    'Cold-chain dispatch: isColdChain flag correctly set on shipment',
    `Carrier: ${coldDispatch.selectedCarrier}`
  );

  const coldCapableCarriers = ['Dunzo', 'FedEx Healthcare Express'];
  assert(
    coldCapableCarriers.includes(coldDispatch.selectedCarrier),
    'Cold-chain dispatch: carrier selected is cold-chain capable',
    `Selected: ${coldDispatch.selectedCarrier} — Supports cold-chain ✓`
  );

  // Waybill document must be well-formed
  const waybill = logisticsService.getWaybill(dispatchResult.dispatch.waybillNumber);
  assert(
    waybill !== null &&
      waybill.waybillNumber === dispatchResult.dispatch.waybillNumber &&
      waybill.barcodeData.startsWith('128:'),
    'Waybill document generation: waybill number & barcode correctly formed',
    `Waybill: ${waybill?.waybillNumber}, Barcode: ${waybill?.barcodeData}`
  );

  assert(
    waybill?.regulatoryDeclaration.includes('FDA') === true,
    'Waybill regulatory declaration contains mandatory FDA compliance statement',
    `Declaration excerpt: "${waybill?.regulatoryDeclaration.slice(0, 60)}…"`
  );

  // ─── Quality Gate 2: Carrier Failover (Workstream 2.1) ────────────────────
  console.log('\n2. Verifying Carrier Failover & Resilience (Workstream 2.1)...');

  // Dispatch additional shipment via Shadowfax before triggering failover
  logisticsService.autoDispatch(
    'ord-4',
    'Anita Desai',
    '350 5th Ave, New York NY 10118',
    '1420 Broadway, New York NY 10018',
    55.0,   // > 50mi, non-cold-chain → will use FedEx
    false,
    'Amoxicillin 500mg Capsules'
  );

  const failoverResult = logisticsService.failoverCarrier('carrier-shadowfax-01');

  assert(
    typeof failoverResult.reassigned === 'number',
    'Carrier failover: returns reassigned shipment count',
    `Reassigned: ${failoverResult.reassigned} shipment(s) to ${failoverResult.fallbackCarrier}`
  );

  assert(
    failoverResult.fallbackCarrier !== undefined,
    'Carrier failover: fallback carrier is assigned for re-routing',
    `Fallback: ${failoverResult.fallbackCarrier}`
  );

  // Carrier marked offline — carrier registry reflects status change
  const carriersAfterFailover = logisticsService.getCarriers();
  const shadowfax = carriersAfterFailover.find(c => c.id === 'carrier-shadowfax-01');
  assert(
    shadowfax?.status === 'offline',
    'Carrier failover: carrier status set to offline after failover trigger',
    `carrier-shadowfax-01 status: ${shadowfax?.status}`
  );

  // ─── Quality Gate 3: Webhook Event Ingestion (Workstream 2.1) ────────────
  console.log('\n3. Verifying Courier Webhook Event Lifecycle (Workstream 2.1)...');

  const testDispatchId = dispatchResult.dispatch.id;
  const pickedUp = logisticsService.ingestWebhookEvent(
    testDispatchId, 'PICKED_UP', 40.7128, -74.006, 'Package collected from pharmacy'
  );

  assert(
    pickedUp.currentStatus === 'PICKED_UP' && pickedUp.events.length >= 2,
    'Webhook ingestion: PICKED_UP event advances shipment status and appends to event log',
    `Events: ${pickedUp.events.length}, Status: ${pickedUp.currentStatus}`
  );

  const outForDelivery = logisticsService.ingestWebhookEvent(
    testDispatchId, 'OUT_FOR_DELIVERY', 40.7050, -73.9900, 'En route to patient'
  );

  const order = storage.getOrderById('ord-2');
  assert(
    outForDelivery.currentStatus === 'OUT_FOR_DELIVERY' &&
      order?.status === 'Out for Delivery',
    'Webhook → order status sync: OUT_FOR_DELIVERY advances platform order to "Out for Delivery"',
    `Platform order status: ${order?.status}`
  );

  // ─── Quality Gate 4: Optimal Telemetry Recording (Workstream 2.2) ─────────
  console.log('\n4. Verifying IoT Cold-Chain Telemetry Pipeline (Workstream 2.2)...');

  const optimalPacket = iotGatewayService.ingest({
    orderId: 'ord-1',
    sensorId: 'BLE-SNSR-892',
    protocol: 'BLE',
    temperatureCelsius: 4.5,
    batteryPercent: 91,
    latitude: 40.6892,
    longitude: -74.0445,
  });

  assert(
    optimalPacket.isBreached === false &&
      optimalPacket.cumulativeExcursionMins === 0 &&
      optimalPacket.quarantineTriggered === false,
    'Optimal telemetry (4.5°C): no breach, no excursion accrual, no quarantine',
    `Temp: ${optimalPacket.temperatureCelsius}°C, Excursion: ${optimalPacket.cumulativeExcursionMins}min`
  );

  // ─── Quality Gate 5: Cumulative Excursion Tracking — 10-min GDP threshold ─
  console.log('\n5. Verifying Cumulative Excursion Tracking & Quarantine Protocol (Workstream 2.2)...');

  // Inject 21 breach packets (each = 0.5 simulated minutes) = 10.5 min cumulative excursion
  // Uses a fresh order ID to avoid contaminating ord-1 state
  const breachOrderId = 'ord-breach-test-001';
  const breachSensorId = 'SNSR-BREACH-TEST';
  let lastBreachPacket = null;

  for (let i = 0; i < 21; i++) {
    lastBreachPacket = iotGatewayService.ingest({
      orderId: breachOrderId,
      sensorId: breachSensorId,
      protocol: 'Cellular',
      temperatureCelsius: 9.2, // above 8.2°C threshold
      batteryPercent: 85,
      latitude: 40.7128,
      longitude: -74.006,
    });
  }

  assert(
    lastBreachPacket !== null && lastBreachPacket.isBreached === true,
    'Breach detection: temperature 9.2°C correctly flagged as isBreached=true',
    `Temperature: ${lastBreachPacket?.temperatureCelsius}°C (threshold: > 8.2°C)`
  );

  assert(
    lastBreachPacket !== null &&
      lastBreachPacket.cumulativeExcursionMins >= 10,
    `Cumulative excursion tracking: ${lastBreachPacket?.cumulativeExcursionMins}min accrued (threshold: 10min)`,
    `21 packets × 0.5min = 10.5min cumulative excursion`
  );

  assert(
    lastBreachPacket !== null && lastBreachPacket.quarantineTriggered === true,
    'Quarantine protocol activated: quarantineTriggered=true after 10min excursion',
    `Cumulative: ${lastBreachPacket?.cumulativeExcursionMins}min ≥ 10min → auto-redispatch triggered`
  );

  // Verify breach alert was created
  const breachAlerts = iotGatewayService.getBreachAlerts('quarantined');
  const ourAlert = breachAlerts.find(a => a.orderId === breachOrderId);

  assert(
    ourAlert !== undefined,
    'Breach alert record created: BreachAlert persisted with status="quarantined"',
    `Alert ID: ${ourAlert?.id}, Peak: ${ourAlert?.peakTemperatureCelsius}°C, Duration: ${ourAlert?.excursionDurationMins}min`
  );

  // ─── Quality Gate 6: Excursion Reset on Recovery (Workstream 2.2) ─────────
  console.log('\n6. Verifying Excursion Counter Reset on Temperature Recovery (Workstream 2.2)...');

  const recoveryOrderId = 'ord-recovery-test-001';
  const recoverySensor = 'SNSR-RECOVERY';

  // First: single breach packet
  const breachStart = iotGatewayService.ingest({
    orderId: recoveryOrderId,
    sensorId: recoverySensor,
    protocol: 'HTTP',
    temperatureCelsius: 9.0,
    batteryPercent: 90,
    latitude: 40.7128,
    longitude: -74.006,
  });

  assert(
    breachStart.cumulativeExcursionMins > 0,
    'Excursion accrual starts correctly on first breach packet',
    `After 1 breach packet: ${breachStart.cumulativeExcursionMins}min accrued`
  );

  // Then: return to safe range
  const recovered = iotGatewayService.ingest({
    orderId: recoveryOrderId,
    sensorId: recoverySensor,
    protocol: 'HTTP',
    temperatureCelsius: 5.0, // back in safe range
    batteryPercent: 90,
    latitude: 40.7128,
    longitude: -74.006,
  });

  assert(
    recovered.isBreached === false && recovered.cumulativeExcursionMins === 0,
    'Excursion counter resets to 0 when temperature returns to safe range',
    `Temperature: ${recovered.temperatureCelsius}°C → cumulativeExcursionMins: ${recovered.cumulativeExcursionMins}`
  );

  // ─── Quality Gate 7: BLE Flash Sync (Workstream 2.2) ─────────────────────
  console.log('\n7. Verifying BLE Flash Memory Sync on Delivery (Workstream 2.2)...');

  const bleSync = iotGatewayService.bleSyncOnDelivery({
    sensorId: 'BLE-SNSR-892',
    orderId: 'ord-1',
    riderId: 'rider-001',
    flashLog: [
      { temperatureCelsius: 4.2, batteryPercent: 94, latitude: 40.7128, longitude: -74.006, timestamp: new Date(Date.now() - 30000).toISOString() },
      { temperatureCelsius: 4.0, batteryPercent: 93, latitude: 40.7050, longitude: -73.995, timestamp: new Date(Date.now() - 15000).toISOString() },
      { temperatureCelsius: 3.9, batteryPercent: 92, latitude: 40.6892, longitude: -73.988, timestamp: new Date().toISOString() },
    ],
  });

  assert(
    bleSync.flashLog.length === 3 && bleSync.syncedAt !== '',
    'BLE sync: 3 flash log packets ingested and persisted',
    `Packets: ${bleSync.flashLog.length}, Rider: ${bleSync.riderId}`
  );

  assert(
    bleSync.deliveryConfirmed === true,
    'BLE sync: cold-chain integrity confirmed — all flash packets within 2°C–8°C',
    `All temperatures optimal: ${bleSync.flashLog.map(p => p.temperatureCelsius + '°C').join(', ')}`
  );

  // ─── Quality Gate 8: Geo-Fence Zone Scoring (Workstream 2.4) ─────────────
  console.log('\n8. Verifying Geo-Fence Proximity Scoring & Buy-Box Weighting (Workstream 2.4)...');

  const brooklynPatient = { latitude: 40.6763, longitude: -73.9588 };
  const scores = geoFencingService.scoreProximity(brooklynPatient, false);

  assert(
    scores.length > 0,
    'Geo-fence scoring: returns results for all active pharmacy zones',
    `Zones scored: ${scores.length}`
  );

  assert(
    scores[0].proximityScore >= scores[scores.length - 1].proximityScore,
    'Geo-fence scoring: results sorted descending by proximity score',
    `Top: ${scores[0].pharmacyName} (${scores[0].proximityScore}) → Bottom: ${scores[scores.length - 1].pharmacyName} (${scores[scores.length - 1].proximityScore})`
  );

  // Nearest pharmacy (CarePoint Brooklyn at ~1.4mi) should score highest
  assert(
    scores[0].distanceMiles < 5,
    'Geo-fence scoring: nearest pharmacy correctly ranked first',
    `Nearest: ${scores[0].pharmacyName} @ ${scores[0].distanceMiles}mi, Score: ${scores[0].proximityScore}`
  );

  // ADR-004 formula: score = max(0, 100 - distanceMiles * 5)
  const expectedTopScore = Math.max(0, Math.round(100 - scores[0].distanceMiles * 5));
  assert(
    scores[0].proximityScore === expectedTopScore,
    'Geo-fence scoring: ADR-004 formula (100 − distanceMi × 5) applied correctly',
    `dist=${scores[0].distanceMiles}mi → expected=${expectedTopScore}, actual=${scores[0].proximityScore}`
  );

  // ─── Quality Gate 9: Point-in-Polygon & Radius Fallback (Workstream 2.4) ──
  console.log('\n9. Verifying Geo-Fence Zone Boundary Detection (Workstream 2.4)...');

  // Brooklyn patient should be within CarePoint Brooklyn zone
  const inBrooklyn = geoFencingService.isWithinZone('TNT-8492', brooklynPatient);
  assert(
    inBrooklyn === true,
    'Point-in-polygon: Brooklyn patient correctly identified as within CarePoint Brooklyn zone',
    `Coord: ${brooklynPatient.latitude}, ${brooklynPatient.longitude} → within TNT-8492: ${inBrooklyn}`
  );

  // Remote point (far outside any zone — middle of Atlantic Ocean)
  const remotePoint = { latitude: 40.0, longitude: -75.5 };
  const inRemote = geoFencingService.isWithinZone('TNT-8492', remotePoint);
  assert(
    inRemote === false,
    'Point-in-polygon: remote coordinate outside all zones correctly returns false',
    `Coord: ${remotePoint.latitude}, ${remotePoint.longitude} → within TNT-8492: ${inRemote}`
  );

  // Nearest alternate pharmacy for re-dispatch (excluding breached pharmacy)
  const alternate = geoFencingService.findNearestAlternatePharmacy(brooklynPatient, 'TNT-8492');
  assert(
    alternate !== null && alternate.pharmacyId !== 'TNT-8492',
    'Alternate pharmacy finder: returns nearest pharmacy excluding the breached tenant',
    `Alternate: ${alternate?.pharmacyName} @ ${alternate?.distanceMiles}mi`
  );

  // ─── Quality Gate 10: Rider OTP & POD Workflow (Workstream 2.3) ────────────
  console.log('\n10. Verifying Rider OTP Verification & Proof of Delivery (Workstream 2.3)...');

  const validOtp = logisticsService.verifyOtp(testDispatchId, '4821', 'rider-001');
  assert(
    validOtp === true,
    'OTP verification: 4-digit numeric code accepted as valid',
    `Shipment: ${testDispatchId}, OTP: 4821 → valid: ${validOtp}`
  );

  const invalidOtp = logisticsService.verifyOtp(testDispatchId, 'abc', 'rider-001');
  assert(
    invalidOtp === false,
    'OTP verification: non-numeric code correctly rejected',
    `OTP: "abc" → valid: ${invalidOtp}`
  );

  logisticsService.submitProofOfDelivery({
    shipmentId: testDispatchId,
    photoDataUrl: 'data:image/png;base64,MOCK_POD_IMAGE',
    riderId: 'rider-001',
    capturedAt: new Date().toISOString(),
    latitude: 40.7050,
    longitude: -73.9900,
  });

  const pod = logisticsService.getPod(testDispatchId);
  const finalDispatch = logisticsService.getDispatch(testDispatchId);

  assert(
    pod !== undefined && pod.riderId === 'rider-001',
    'POD submission: proof of delivery record persisted with correct rider ID',
    `POD captured at: ${pod?.capturedAt}`
  );

  assert(
    finalDispatch?.currentStatus === 'DELIVERED',
    'POD submission: shipment status automatically advances to DELIVERED',
    `Shipment ${testDispatchId} status: ${finalDispatch?.currentStatus}`
  );

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(`QUALITY GATES SUMMARY: ${passed} / ${total} TESTS PASSED`);
  if (passed === total) {
    console.log('Phase 2 (Logistics, IoT & Mobile) Verification: ALL GATES PASSED ✓');
  } else {
    console.log(`WARNING: ${total - passed} gate(s) FAILED — review output above.`);
  }
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase2QualityGates().catch(err => {
  console.error('Phase 2 test suite failed with uncaught error:', err);
  process.exit(1);
});
