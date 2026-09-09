import { storage } from './storageService';
import { PlatformOrder, CartItem } from '../../src/types';

export interface CheckoutInput {
  customerId: string;
  customerName: string;
  customerAddress: string;
  tenantCode: string;
  items: CartItem[];
  deliveryType: 'Express 2h' | 'Standard Ground' | 'Cold-Chain';
  rxNumber?: string;
  doctorName?: string;
}

export class OrderService {
  /**
   * Processes a patient checkout and creates an order in the escrow ledger
   */
  public checkout(input: CheckoutInput): PlatformOrder {
    const tenant = storage.getTenant(input.tenantCode) || storage.getTenants()[0];
    const commissionRate = tenant ? tenant.commissionRate : 8.5; // default 8.5%

    const orderTotal = +input.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2);
    const brandedValue = +input.items.reduce((sum, item) => sum + (item.brandedPrice * item.quantity), 0).toFixed(2);
    const patientSavingsAmount = +(brandedValue - orderTotal).toFixed(2);
    const patientSavingsPercent = brandedValue > 0 
      ? Math.round((patientSavingsAmount / brandedValue) * 100) 
      : 0;

    const platformFee = +((orderTotal * commissionRate) / 100).toFixed(2);

    const isColdChain = input.deliveryType === 'Cold-Chain' || input.items.some(i => 
      i.medicineName.toLowerCase().includes('insulin') || 
      i.medicineName.toLowerCase().includes('humalog')
    );

    const orderId = 'ord-' + Date.now().toString().slice(-4);
    const orderNumber = 'GMS-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();

    const order: PlatformOrder = {
      id: orderId,
      orderNumber,
      orderDate: now.toISOString().split('T')[0],
      orderTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: input.customerName,
      customerAddress: input.customerAddress,
      distanceMiles: 3.2,
      channel: 'Web Patient Portal',
      tenantStoreName: tenant.name + ' - Store #104',
      tenantStoreNumber: '#104',
      genericMolecule: input.items[0]?.medicineName || 'Generic Formulation',
      brandReference: input.items[0]?.brandName || 'Branded Reference',
      items: input.items.map(item => ({
        name: item.medicineName,
        dosage: item.dosage,
        packaging: item.packDescription,
        lotNumber: 'LOT-' + Math.floor(1000 + Math.random() * 9000),
        price: item.unitPrice,
        quantity: item.quantity
      })),
      orderTotal,
      brandedValue,
      patientSavingsPercent,
      patientSavingsAmount,
      platformFee,
      status: input.rxNumber ? 'Validating Rx' : 'Dispensing',
      rxNumber: input.rxNumber || 'RX-NONE-REQ',
      prescribingDoctor: input.doctorName || 'Dr. Julian Thorne, MD',
      pharmacistAudit: 'Pending Pharmacist Verification',
      deliveryType: isColdChain ? 'Cold-Chain' : input.deliveryType,
      courierName: 'Dunzo Healthcare Direct',
      courierVehicle: 'Cold-Box Van #12',
      courierEtaMins: 35,
      courierTempCelsius: isColdChain ? 4.2 : undefined
    };

    return storage.saveOrder(order);
  }

  /**
   * Advances order lifecycle state
   */
  public advanceStatus(orderId: string, newStatus: PlatformOrder['status']): PlatformOrder {
    const updated = storage.updateOrderStatus(orderId, newStatus);
    if (!updated) {
      throw new Error(`Order ${orderId} not found`);
    }
    return updated;
  }

  /**
   * Returns orders filtered for a specific tenant
   */
  public getTenantOrders(tenantCode: string): PlatformOrder[] {
    const tenant = storage.getTenant(tenantCode);
    if (!tenant) return [];
    const keyword = tenant.name.split(' ')[0].toLowerCase(); // e.g. 'apollo'
    return storage.getOrders(keyword);
  }
}

export const orderService = new OrderService();
