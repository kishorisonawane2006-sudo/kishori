import React, { useState } from 'react';
import { UserProfile, UserSession } from '../../types';
import { 
  User, 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  HeartPulse, 
  AlertTriangle, 
  LogOut, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Laptop, 
  X, 
  Save, 
  FileCheck, 
  PlusCircle, 
  Trash2,
  Calendar,
  CreditCard,
  Building2,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onViewOrders?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onNavigateToLogin,
  onViewOrders
}) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'sessions'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Edit form states
  const [editName, setEditName] = useState(user.fullName);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editStreet, setEditStreet] = useState(user.primaryAddress.street);
  const [editApt, setEditApt] = useState(user.primaryAddress.apartment || '');
  const [editCity, setEditCity] = useState(user.primaryAddress.city);
  const [editState, setEditState] = useState(user.primaryAddress.state);
  const [editZip, setEditZip] = useState(user.primaryAddress.zipCode);
  const [editAllergies, setEditAllergies] = useState(user.allergies.join(', '));
  const [editEmergencyName, setEditEmergencyName] = useState(user.emergencyContact.name);
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(user.emergencyContact.phone);

  // Password change form states
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);

  // 2FA toggle state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.loginInfo.twoFactorEnabled);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      fullName: editName,
      phone: editPhone,
      allergies: editAllergies.split(',').map(s => s.trim()).filter(Boolean),
      primaryAddress: {
        ...user.primaryAddress,
        street: editStreet,
        apartment: editApt,
        city: editCity,
        state: editState,
        zipCode: editZip
      },
      emergencyContact: {
        ...user.emergencyContact,
        name: editEmergencyName,
        phone: editEmergencyPhone
      }
    };

    onUpdateUser(updated);
    setIsEditing(false);
    triggerToast('Profile information successfully saved!');
  };

  const handleRevokeSession = (sessionId: string) => {
    const updatedSessions = user.loginInfo.activeSessions.filter(s => s.id !== sessionId);
    const updated: UserProfile = {
      ...user,
      loginInfo: {
        ...user.loginInfo,
        activeSessions: updatedSessions
      }
    };
    onUpdateUser(updated);
    triggerToast('Remote session terminated successfully.');
  };

  const handleToggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    const updated: UserProfile = {
      ...user,
      loginInfo: {
        ...user.loginInfo,
        twoFactorEnabled: nextState
      }
    };
    onUpdateUser(updated);
    triggerToast(`Two-Factor Authentication (2FA) ${nextState ? 'Activated' : 'Deactivated'}`);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      triggerToast('New passwords do not match!');
      return;
    }
    if (newPw.length < 8) {
      triggerToast('Password must be at least 8 characters.');
      return;
    }

    const updated: UserProfile = {
      ...user,
      loginInfo: {
        ...user.loginInfo,
        lastPasswordChange: 'Just now'
      }
    };
    onUpdateUser(updated);
    setShowPasswordModal(false);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    triggerToast('Account password updated successfully!');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Top Profile Header Hero */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
                alt={user.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]" title="EPCS Verified Patient">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
                  {user.fullName}
                </h1>
                <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {user.role === 'patient' ? 'Patient' : user.role === 'pharmacy_admin' ? 'Pharmacy Partner' : 'Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {user.roleTitle}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={onNavigateToLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold shadow-xs transition-colors"
              title="Open Separate Login Page to switch account"
            >
              <KeyRound className="w-3.5 h-3.5 text-sky-600" />
              <span>Switch / Login</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold shadow-xs transition-colors"
              title="Sign Out of MediGeneric"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 mt-5 pt-3">
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Clinical & Personal Info</span>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'security'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Login & Security Information</span>
          </button>

          <button
            onClick={() => setActiveSection('sessions')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
              activeSection === 'sessions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Active Sessions</span>
            <span className="w-4 h-4 bg-sky-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {user.loginInfo.activeSessions.length}
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 1: CLINICAL & PERSONAL PROFILE */}
      {activeSection === 'profile' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Allergies Alert Banner (Critical for generic drug substitution!) */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-rose-800">
                Known Drug Allergies & Clinical Precautions
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                When ordering generic equivalents, our automated FDA Orange Book engine cross-checks excipients against your verified allergy list:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {user.allergies.map((alg, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-900 text-[11px] font-bold">
                    {alg}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Health & Demographics Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Medical Profile
                  </h3>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  HIPAA Verified
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date of Birth</span>
                  <strong className="text-slate-800">{user.dateOfBirth}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Gender</span>
                  <strong className="text-slate-800">{user.gender}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Blood Group</span>
                  <strong className="text-slate-800 font-mono">{user.bloodGroup}</strong>
                </div>
                <div className="py-1">
                  <span className="text-slate-500 block mb-1">Chronic Conditions</span>
                  <div className="flex flex-wrap gap-1">
                    {user.chronicConditions.map((cond, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Delivery Address Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Primary Delivery Address
                  </h3>
                </div>
                <span className="text-[10px] text-sky-600 font-bold">20-30m Zone</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  {user.primaryAddress.street} {user.primaryAddress.apartment}
                </div>
                <div className="text-slate-600">
                  {user.primaryAddress.city}, {user.primaryAddress.state} {user.primaryAddress.zipCode}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Country: {user.primaryAddress.country}
                </div>
                <div className="pt-2 text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Courier GPS pin verified (Brooklyn Hub)
                </div>
              </div>
            </div>

            {/* Insurance & Rx Benefits Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Insurance & Rx Benefits
                  </h3>
                </div>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 font-mono px-2 py-0.5 rounded">
                  Copay Eligible
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Provider</span>
                  <strong className="text-slate-800">{user.insurance.provider}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Policy #</span>
                  <strong className="font-mono text-slate-800">{user.insurance.policyNumber}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">RxBIN / RxPCN</span>
                  <strong className="font-mono text-slate-800">{user.insurance.rxBin} / {user.insurance.rxPcn}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Coverage Valid</span>
                  <strong className="text-emerald-700">{user.insurance.validThrough}</strong>
                </div>
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Emergency Contact
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400">Next of Kin</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  {user.emergencyContact.name}
                </div>
                <div className="text-slate-600">
                  Relationship: <strong className="text-slate-800">{user.emergencyContact.relation}</strong>
                </div>
                <div className="text-slate-600 font-mono">
                  Phone: <strong className="text-slate-800">{user.emergencyContact.phone}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PROFILE LOGIN & SECURITY INFORMATION */}
      {activeSection === 'security' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Top Security Overview Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold font-headline text-white">
                  Account Security Health: Excellent
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Your medical identity is guarded with 256-bit Row-Level Security, 2FA, and EPCS digital prescription certificates.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                0 Vulnerabilities
              </span>
            </div>
          </div>

          {/* Login Credentials & Authentication Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
            {/* Email & Username */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Login Username & Email</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Used for account sign-in and prescription dispatch notifications.
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold">
                    @{user.loginInfo.username}
                  </span>
                  <span className="text-slate-600 font-medium">{user.email}</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Email
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Primary Identity</span>
            </div>

            {/* Account Password */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Account Password</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Last changed: <strong className="text-slate-700">{user.loginInfo.lastPasswordChange}</strong>
                </span>
                <div className="font-mono text-slate-400 text-xs mt-1">
                  ••••••••••••••••
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors self-start sm:self-auto"
              >
                Change Password
              </button>
            </div>

            {/* Two-Factor Authentication (2FA) */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    twoFactorEnabled 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {twoFactorEnabled ? 'Active / Protected' : 'Disabled'}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Requires 6-digit TOTP token or mobile SMS code when signing in or ordering Schedule II–V generic salts.
                </span>
                <div className="text-[11px] text-slate-600 mt-1">
                  Provider: <strong className="text-slate-800">{user.loginInfo.authProvider}</strong>
                </div>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors self-start sm:self-auto ${
                  twoFactorEnabled
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>

            {/* Last Login & Compliance Signatures */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 block text-sm">Session History & Regulatory Compliance</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Last login recorded: <strong className="text-slate-700">{user.loginInfo.lastLogin}</strong>
                </span>
                <div className="text-[11px] text-slate-600 mt-1">
                  HIPAA EHR Consent Signed: <strong className="text-slate-800">{user.loginInfo.hipaaConsentSignedAt}</strong>
                </div>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                Audit Trail Recorded
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ACTIVE SESSIONS */}
      {activeSection === 'sessions' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Active Device Sessions</h2>
              <p className="text-xs text-slate-500">
                Devices currently logged into this MediGeneric account. You can revoke any unrecognized devices.
              </p>
            </div>
            <button
              onClick={() => {
                const updated: UserProfile = {
                  ...user,
                  loginInfo: {
                    ...user.loginInfo,
                    activeSessions: user.loginInfo.activeSessions.filter(s => s.current)
                  }
                };
                onUpdateUser(updated);
                triggerToast('Terminated all remote device sessions.');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold border border-rose-200 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              Log Out All Other Devices
            </button>
          </div>

          <div className="space-y-3">
            {user.loginInfo.activeSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    session.current ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {session.device.toLowerCase().includes('phone') ? (
                      <Smartphone className="w-5 h-5" />
                    ) : (
                      <Laptop className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{session.device}</strong>
                      {session.current && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                          This Device
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {session.browser} • {session.location}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      IP: {session.ipAddress} • {session.lastActive}
                    </div>
                  </div>
                </div>

                {!session.current && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-600 font-semibold text-xs transition-colors self-start sm:self-auto"
                  >
                    Revoke Access
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 my-auto text-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 font-headline">Edit Profile Details</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={editStreet}
                    onChange={(e) => setEditStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Apartment / Unit</label>
                  <input
                    type="text"
                    value={editApt}
                    onChange={(e) => setEditApt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    value={editZip}
                    onChange={(e) => setEditZip(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Drug Allergies (Comma separated)
                </label>
                <input
                  type="text"
                  value={editAllergies}
                  onChange={(e) => setEditAllergies(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={editEmergencyName}
                    onChange={(e) => setEditEmergencyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={editEmergencyPhone}
                    onChange={(e) => setEditEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 my-auto text-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 font-headline">Change Account Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Current Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">New Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Confirm New Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="flex items-center gap-1 hover:text-slate-800"
                >
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPw ? 'Hide' : 'Show'} passwords</span>
                </button>
                <span>Requires EPCS complexity</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
