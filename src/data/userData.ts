import { UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-patient-8821',
  fullName: 'Sarah Jenkins',
  email: 'sarah.jenkins@gmail.com',
  role: 'patient',
  roleTitle: 'Verified Patient (EPCS Authenticated)',
  phone: '+1 (555) 234-5678',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  dateOfBirth: '1988-06-14',
  gender: 'Female',
  bloodGroup: 'O Positive (O+)',
  allergies: ['Penicillin G', 'Sulfa Antibiotics', 'Codeine Phosphate'],
  chronicConditions: ['Type 2 Diabetes Mellitus', 'Hyperlipidemia', 'Mild Hypertension'],
  primaryAddress: {
    street: '482 Atlantic Ave',
    apartment: 'Apt 4B',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11217',
    country: 'United States'
  },
  insurance: {
    provider: 'Blue Cross Blue Shield of New York',
    policyNumber: 'BCBS-NY-9941028',
    groupNumber: 'GRP-MED-7712',
    validThrough: '12/2028',
    rxBin: '004336',
    rxPcn: 'ADV'
  },
  emergencyContact: {
    name: 'Mark Jenkins',
    relation: 'Spouse',
    phone: '+1 (555) 987-6543'
  },
  loginInfo: {
    username: 'sarah.jenkins',
    lastLogin: 'Today at 09:42 AM EST',
    lastPasswordChange: '45 days ago',
    twoFactorEnabled: true,
    authProvider: 'EPCS Verified Token',
    securityAlertsCount: 0,
    hipaaConsentSignedAt: '2026-01-15 (Version 4.2)',
    emailVerified: true,
    phoneVerified: true,
    activeSessions: [
      {
        id: 'sess-1',
        device: 'MacBook Pro 16" (macOS Sequoia)',
        browser: 'Google Chrome 128.0',
        ipAddress: '68.195.42.118 (Spectrum NYC)',
        location: 'Brooklyn, NY, USA',
        lastActive: 'Active right now',
        current: true
      },
      {
        id: 'sess-2',
        device: 'iPhone 15 Pro (iOS 18.2)',
        browser: 'MediGeneric Mobile App v2.4',
        ipAddress: '172.56.21.90 (T-Mobile 5G)',
        location: 'New York, NY, USA',
        lastActive: '2 hours ago',
        current: false
      },
      {
        id: 'sess-3',
        device: 'iPad Air 5th Gen (iPadOS 18)',
        browser: 'Safari Mobile',
        ipAddress: '68.195.42.118 (Home Wi-Fi)',
        location: 'Brooklyn, NY, USA',
        lastActive: '3 days ago',
        current: false
      }
    ]
  }
};

export const DEMO_USERS: UserProfile[] = [
  INITIAL_USER,
  {
    id: 'usr-pharm-3109',
    fullName: 'Dr. Rajesh Mehta, RPh',
    email: 'rajesh.mehta@apollopharmacy.com',
    role: 'pharmacy_admin',
    roleTitle: 'Chief Dispensing Pharmacist • Apollo Pharmacy #104',
    phone: '+1 (555) 345-6789',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
    dateOfBirth: '1979-11-20',
    gender: 'Male',
    bloodGroup: 'B Positive (B+)',
    allergies: ['None Reported'],
    chronicConditions: ['None'],
    primaryAddress: {
      street: '1420 Broadway',
      apartment: 'Suite 300',
      city: 'New York',
      state: 'NY',
      zipCode: '10018',
      country: 'United States'
    },
    insurance: {
      provider: 'Aetna Platinum Pharmacy Provider',
      policyNumber: 'AET-PRO-88129',
      groupNumber: 'GRP-PHARM-01',
      validThrough: '12/2029',
      rxBin: '610502',
      rxPcn: 'MEDD'
    },
    emergencyContact: {
      name: 'Priya Mehta',
      relation: 'Spouse',
      phone: '+1 (555) 456-7890'
    },
    loginInfo: {
      username: 'rmehta.rph',
      lastLogin: 'Today at 08:05 AM EST',
      lastPasswordChange: '14 days ago',
      twoFactorEnabled: true,
      authProvider: 'EPCS Verified Token',
      securityAlertsCount: 0,
      hipaaConsentSignedAt: '2026-02-01 (Clinical License Verified)',
      emailVerified: true,
      phoneVerified: true,
      activeSessions: [
        {
          id: 'sess-p1',
          device: 'Dell OptiPlex Dispense Station #2',
          browser: 'Pharmacy Edge OS v4.1',
          ipAddress: '198.51.100.42 (Store Static VPN)',
          location: 'Manhattan, NY, USA',
          lastActive: 'Active right now',
          current: true
        }
      ]
    }
  },
  {
    id: 'usr-admin-001',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@medigeneric.health',
    role: 'superadmin',
    roleTitle: 'Platform Security & Infrastructure Lead',
    phone: '+1 (555) 789-0123',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    dateOfBirth: '1984-03-08',
    gender: 'Male',
    bloodGroup: 'A Positive (A+)',
    allergies: ['Aspirin (Mild Hives)'],
    chronicConditions: ['None'],
    primaryAddress: {
      street: '1 World Trade Center',
      apartment: 'Floor 68',
      city: 'New York',
      state: 'NY',
      zipCode: '10007',
      country: 'United States'
    },
    insurance: {
      provider: 'UnitedHealthcare Corporate Executive',
      policyNumber: 'UHC-EXEC-00192',
      groupNumber: 'CORP-HQ',
      validThrough: '12/2030',
      rxBin: '003858',
      rxPcn: 'A4'
    },
    emergencyContact: {
      name: 'Jessica Vance',
      relation: 'Sister',
      phone: '+1 (555) 890-1234'
    },
    loginInfo: {
      username: 'mvance.superadmin',
      lastLogin: 'Today at 07:15 AM EST',
      lastPasswordChange: '7 days ago (Hardware Token)',
      twoFactorEnabled: true,
      authProvider: 'EPCS Verified Token',
      securityAlertsCount: 0,
      hipaaConsentSignedAt: '2026-01-01 (SuperAdmin Oath)',
      emailVerified: true,
      phoneVerified: true,
      activeSessions: [
        {
          id: 'sess-a1',
          device: 'ThinkPad X1 Carbon (Fedora Linux)',
          browser: 'Firefox Developer Edition',
          ipAddress: '192.0.2.1 (MediGeneric Bastion IP)',
          location: 'New York, NY, USA',
          lastActive: 'Active right now',
          current: true
        }
      ]
    }
  }
];
