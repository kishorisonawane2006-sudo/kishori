import React, { useState } from 'react';
import { UserProfile, AppMode } from '../../types';
import { DEMO_USERS } from '../../data/userData';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Smartphone, 
  Building2, 
  UserCheck, 
  Eye, 
  EyeOff,
  Stethoscope,
  Sparkles
} from 'lucide-react';

interface LoginPageProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onNavigateBack: () => void;
  targetModeAfterLogin?: AppMode;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLogin,
  onNavigateBack,
  targetModeAfterLogin = 'patient'
}) => {
  const [activeAuthTab, setActiveAuthTab] = useState<'signin' | 'register' | '2fa'>('signin');
  const [email, setEmail] = useState('sarah.jenkins@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('849-210');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'pharmacy_admin' | 'superadmin'>('patient');
  
  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDob, setRegDob] = useState('1990-01-01');
  const [regAllergies, setRegAllergies] = useState('None');

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDemoLogin = (user: UserProfile) => {
    onLogin(user);
    showToast(`Logged in successfully as ${user.fullName} (${user.role === 'patient' ? 'Patient' : user.role === 'pharmacy_admin' ? 'Pharmacy Partner' : 'Platform SuperAdmin'})`);
  };

  const handleSubmitSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if matches one of demo users or default
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || DEMO_USERS[0];
    onLogin(matched);
    showToast(`Welcome back, ${matched.fullName}!`);
  };

  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail) {
      showToast('Please fill in your name and email.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-new-${Date.now()}`,
      fullName: regFullName,
      email: regEmail,
      role: 'patient',
      roleTitle: 'Verified Patient (EPCS Registered)',
      phone: regPhone || '+1 (555) 000-1234',
      dateOfBirth: regDob,
      gender: 'Prefer not to say',
      bloodGroup: 'Unknown',
      allergies: regAllergies !== 'None' ? regAllergies.split(',').map(s => s.trim()) : [],
      chronicConditions: [],
      primaryAddress: {
        street: '123 Health Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      insurance: {
        provider: 'Primary Commercial PPO',
        policyNumber: 'POL-NEW-9901',
        groupNumber: 'GRP-99',
        validThrough: '12/2028',
        rxBin: '004336',
        rxPcn: 'ADV'
      },
      emergencyContact: {
        name: 'Emergency Contact',
        relation: 'Family',
        phone: '+1 (555) 999-8888'
      },
      loginInfo: {
        username: regEmail.split('@')[0],
        lastLogin: 'Just now (Initial Registration)',
        lastPasswordChange: 'Today',
        twoFactorEnabled: false,
        authProvider: 'Email/Password',
        securityAlertsCount: 0,
        hipaaConsentSignedAt: new Date().toISOString().split('T')[0],
        emailVerified: true,
        phoneVerified: false,
        activeSessions: [
          {
            id: `sess-${Date.now()}`,
            device: 'Current Web Browser',
            browser: 'Browser App',
            ipAddress: '127.0.0.1 (Local Session)',
            location: 'New York, USA',
            lastActive: 'Active now',
            current: true
          }
        ]
      }
    };

    onLogin(newUser);
    showToast(`Account created! Welcome, ${newUser.fullName}.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
      {/* Toast alert */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Application</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>HIPAA & EPCS Compliant Security Gateway</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-4xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Narrative & Quick Demo Presets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bio-Equivalent Marketplace Identity</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-headline">
              MediGeneric <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Access Portal</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Log in to view your personalized generic savings, order history, active prescriptions, and encrypted medical records.
            </p>
          </div>

          {/* Quick Demo Logins Section */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4.5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Instant Demo Logins</span>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-mono">1-Click Test</span>
            </div>

            <div className="space-y-2">
              {DEMO_USERS.map((u) => {
                const isActive = currentUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleDemoLogin(u)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      isActive 
                        ? 'bg-sky-600/20 border-sky-500/50 text-white' 
                        : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{u.fullName}</span>
                          {isActive && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {u.roleTitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      {isActive ? 'Active' : 'Sign In →'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clinical Security Guarantees */}
          <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>256-Bit RLS Encrypted</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
              <Stethoscope className="w-4 h-4 text-sky-400 shrink-0" />
              <span>FDA Orange Book Validated</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Login / Register Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Auth Mode Tabs */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 mb-6">
            <button
              onClick={() => setActiveAuthTab('signin')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeAuthTab === 'signin'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveAuthTab('register')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeAuthTab === 'register'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => setActiveAuthTab('2fa')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeAuthTab === '2fa'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2FA Token
            </button>
          </div>

          {/* SIGN IN TAB */}
          {activeAuthTab === 'signin' && (
            <form onSubmit={handleSubmitSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="patient@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset token dispatched to verified email')}
                    className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Biometrics check */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-slate-800 border-slate-700 text-sky-600 focus:ring-sky-500 focus:ring-offset-slate-900"
                  />
                  <span>Remember this device (30 days)</span>
                </label>
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  EPCS 2FA Ready
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In to MediGeneric</span>
              </button>
            </form>
          )}

          {/* REGISTER TAB */}
          {activeAuthTab === 'register' && (
            <form onSubmit={handleSubmitRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Jessica Taylor"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="jessica@example.com"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 8 characters with letters & numbers"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Known Drug Allergies (for safe generic substitution)
                </label>
                <input
                  type="text"
                  value={regAllergies}
                  onChange={(e) => setRegAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa drugs, None"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                By registering, you consent to HIPAA electronic health records handling and generic bio-equivalent prescription matching.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create Patient Account & Continue</span>
              </button>
            </form>
          )}

          {/* 2FA / EPCS TOKEN TAB */}
          {activeAuthTab === '2fa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/50 flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white">EPCS / DEA Two-Factor Authentication</div>
                  <div className="text-slate-400 text-[11px]">
                    Enter the 6-digit one-time code sent to your registered authenticator or mobile SMS for prescription verification.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Security Code
                </label>
                <input
                  type="text"
                  maxLength={7}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onLogin(DEMO_USERS[0]);
                  showToast('Two-factor authentication verified! Welcome, Sarah.');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Token & Complete Sign-In</span>
              </button>
            </div>
          )}

          {/* Bottom Security Footer */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 End-to-End Encryption</span>
            </span>
            <span>Session ID: <strong className="font-mono text-slate-300">#AUTH-99214</strong></span>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400 py-3 border-t border-slate-800/80">
        MediGeneric Health Cloud • Multi-Tenant Pharmacy Enterprise Platform • Version 2.6.4
      </div>
    </div>
  );
};
