import React, { useState } from 'react';
import { TenantOrganization } from '../../types';

interface MultiTenantScreenProps {
  tenants: TenantOrganization[];
  onAddTenant: (tenant: TenantOrganization) => void;
}

export const MultiTenantScreen: React.FC<MultiTenantScreenProps> = ({
  tenants,
  onAddTenant
}) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Under Audit' | 'Provisioning' | 'Suspended'>('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New tenant form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    tier: 'Enterprise Pro' as const,
    outlets: 10,
    commissionRate: 9.5,
    headquarters: 'Austin, TX',
    licenseNumber: 'DEA-TX8891024',
    dbPartitionMax: '100 GB',
    rateLimitMax: 10000
  });

  const filteredTenants = tenants.filter((t) => {
    const matchesFilter = filter === 'All' ? true : t.status.includes(filter);
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.schema.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const newTenant: TenantOrganization = {
      id: `TNT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      code: formData.code.toUpperCase(),
      tier: formData.tier,
      outlets: Number(formData.outlets),
      monthlyGmv: 120000,
      commissionRate: Number(formData.commissionRate),
      activeSkus: 3500,
      schema: `tnt_${formData.code.toLowerCase()}_prod`,
      encryption: 'AES-256 Dedicated RLS',
      licenseNumber: formData.licenseNumber,
      licenseValidity: 'Valid until 2029',
      status: 'Active / Verified',
      headquarters: formData.headquarters,
      dbPartitionSize: '1.2 GB',
      dbPartitionMax: formData.dbPartitionMax,
      redisCacheSize: '0.2 GB',
      redisCacheMax: '4.0 GB',
      rateLimitUsage: 120,
      rateLimitMax: Number(formData.rateLimitMax),
      throughputReqSec: 24.5,
      piiMasking: true,
      ipWhitelistSubnets: 3
    };

    onAddTenant(newTenant);
    setShowModal(false);
    setFormData({
      name: '',
      code: '',
      tier: 'Enterprise Pro',
      outlets: 10,
      commissionRate: 9.5,
      headquarters: 'Austin, TX',
      licenseNumber: 'DEA-TX8891024',
      dbPartitionMax: '100 GB',
      rateLimitMax: 10000
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">
            Multi-Tenant Management & Data Isolation
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            PostgreSQL schema-per-tenant isolation (<code className="text-sky-700 bg-sky-50 px-1 py-0.5 rounded font-mono">tnt_*</code>), dedicated KMS encryption keys, and resource quotas.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">domain_add</span>
          <span>+ Onboard New Pharmacy Tenant</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tenant Organizations</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-headline">42 Registered</div>
          <p className="text-[11px] text-slate-400 mt-1">348 Licensed pharmacy outlets</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Schema Isolation</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-headline">42 Schemas</div>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">lock</span>
            Zero schema bleed detected
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Allocated Storage</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-headline">121.7 GB</div>
          <p className="text-[11px] text-slate-400 mt-1">PostgreSQL RDS Aurora Multi-AZ</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">KMS Encryption Status</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1 font-headline">100% Rotated</div>
          <p className="text-[11px] text-indigo-700 mt-1">Envelope encryption per tenant</p>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, schema (tnt_*) or ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['All', 'Active', 'Under Audit', 'Provisioning', 'Suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tenant Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Tenant Identity</th>
                <th className="py-3 px-4">Dedicated Postgres Schema</th>
                <th className="py-3 px-4">Outlets & Scale</th>
                <th className="py-3 px-4">DB Partition / Redis</th>
                <th className="py-3 px-4">Rate Limit & Throughput</th>
                <th className="py-3 px-4">License & Compliance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>{tenant.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono text-sky-700 font-semibold">{tenant.id}</span>
                      <span>•</span>
                      <span>{tenant.headquarters}</span>
                      <span>•</span>
                      <span className="text-slate-600">{tenant.tier}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/60 inline-block text-[11px] font-semibold">
                      {tenant.schema}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-emerald-600">lock</span>
                      <span>{tenant.encryption}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{tenant.outlets} Outlets</div>
                    <div className="text-[11px] text-slate-500">
                      ${(tenant.monthlyGmv / 1000).toFixed(1)}k GMV/mo • {tenant.commissionRate}% Take
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-[11px]">
                      <span className="font-medium text-slate-900">{tenant.dbPartitionSize}</span>
                      <span className="text-slate-400"> / {tenant.dbPartitionMax}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Redis: {tenant.redisCacheSize}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-[11px] font-mono text-slate-800">
                      {tenant.rateLimitUsage} / {tenant.rateLimitMax} req/min
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      {tenant.throughputReqSec} req/sec avg
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[11px] text-slate-800">{tenant.licenseNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tenant.licenseValidity}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tenant.status === 'Active / Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tenant.status === 'Under Audit'
                          ? 'bg-amber-100 text-amber-800'
                          : tenant.status === 'Provisioning'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{tenant.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title="Rotate KMS Key"
                        onClick={() => alert(`KMS Rotation initiated for ${tenant.schema}. Envelope key safely re-wrapped.`)}
                        className="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-slate-100"
                      >
                        <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                      </button>
                      <button
                        title="Inspect Schema Partition"
                        onClick={() => alert(`Schema ${tenant.schema} partition details:\n- Tables: 24\n- Rows: 1,480,210\n- RLS Policies: 18 active\n- Read Replicas: us-east-1b`)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Tenant Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">domain_add</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-headline">Onboard Pharmacy Organization</h3>
                  <p className="text-[11px] text-slate-500">Automated PostgreSQL schema provision & KMS binding.</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Health Systems Rx"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenant Code (Prefix)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. APEX"
                    maxLength={6}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 uppercase font-mono focus:ring-1 focus:ring-sky-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Schema: <code className="text-sky-700">tnt_{formData.code.toLowerCase() || '...'}_prod</code>
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e: any) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Enterprise Pro">Enterprise Pro (Dedicated RLS)</option>
                    <option value="Growth Tier">Growth Tier</option>
                    <option value="Regional">Regional Pharmacy Network</option>
                    <option value="Standard">Standard Dispensary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Store Outlets</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.outlets}
                    onChange={(e) => setFormData({ ...formData, outlets: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commission %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DB Quota</label>
                  <select
                    value={formData.dbPartitionMax}
                    onChange={(e) => setFormData({ ...formData, dbPartitionMax: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="50 GB">50 GB</option>
                    <option value="100 GB">100 GB</option>
                    <option value="250 GB">250 GB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DEA / NABP License No.</label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Headquarters</label>
                  <input
                    type="text"
                    required
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
                <div className="font-semibold text-sky-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-sky-600">security</span>
                  <span>Isolation Verification Check</span>
                </div>
                <p className="text-[11px] text-sky-700">
                  Provisioning will execute automated migration script, configure Postgres Row-Level Security (RLS) policies, and register new AES-256 tenant master key.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Provision & Launch Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
