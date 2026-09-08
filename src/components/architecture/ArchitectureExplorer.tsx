import React, { useState } from 'react';

interface ArchNode {
  id: string;
  name: string;
  category: 'client' | 'edge' | 'iam' | 'monolith' | 'database' | 'integration';
  description: string;
  specs: string[];
  status: 'Healthy' | 'Active' | 'Enforced' | 'Multi-AZ';
}

const ARCH_NODES: ArchNode[] = [
  {
    id: 'node-client',
    name: 'Unified Client Layer',
    category: 'client',
    description: 'Patient iOS/Android mobile apps, Next.js customer web storefront, Pharmacy Vendor Node Portal, and Central Ops SaaS Dashboard.',
    specs: ['React 19 + Tailwind CSS', 'Responsive Touch & Keyboard', 'Encrypted Local Session Cache', 'Biometric WebAuthn Support'],
    status: 'Active'
  },
  {
    id: 'node-edge',
    name: 'Edge & Security Layer (WAF + Gateway)',
    category: 'edge',
    description: 'Cloudflare Enterprise CDN, DDoS mitigation, TLS 1.3 termination, rate-limiting, and Nginx Ingress proxy routing to API cluster.',
    specs: ['99.999% Edge Uptime', 'Automated IP Throttling', 'Geographic Latency Routing', 'Zero-Trust Header Injection'],
    status: 'Healthy'
  },
  {
    id: 'node-iam',
    name: 'IAM & Tenant Context Resolver',
    category: 'iam',
    description: 'Cryptographic JWT verification, multi-factor authentication (MFA), role-based access control (RBAC), and Tenant Context Filter injecting `tenant_id` into database sessions.',
    specs: ['RS256 Signed JWTs', 'Fine-grained Permission Claims', 'Automatic Schema Switching', 'OAuth2 / SAML Enterprise SSO'],
    status: 'Enforced'
  },
  {
    id: 'node-monolith',
    name: 'Modular Monolith Application Core',
    category: 'monolith',
    description: 'High-performance modular backend encapsulating 8 core domains: Tenant Management, Catalog & Bio-Equivalence, Order Pipeline, Repricing Engine, Payment & Commission, Cold-Chain IoT, Notifications, and Audit Logs.',
    specs: ['Clean Domain Boundaries', 'In-Process Event Bus', 'Single-Deploy Simplicity', 'Sub-millisecond Inter-module Calls'],
    status: 'Healthy'
  },
  {
    id: 'node-database',
    name: 'Tenant-Aware PostgreSQL RDS Cluster',
    category: 'database',
    description: 'Multi-AZ PostgreSQL cluster utilizing dedicated schema-per-tenant (`tnt_*`) architecture combined with Row-Level Security (RLS) policies.',
    specs: ['Schema-per-Tenant Isolation', 'Dedicated AES-256 KMS Keys', 'Zero Cross-Tenant Leakage', 'Automatic Daily Encrypted Snapshots'],
    status: 'Multi-AZ'
  },
  {
    id: 'node-redis',
    name: 'Redis Sentinel High-Speed Cache',
    category: 'database',
    description: 'Sub-millisecond caching for real-time generic pricing buy-boxes, tenant session quotas, and ephemeral cart reserves.',
    specs: ['In-Memory Key-Value', '4.8 GB / 12.0 GB Memory Usage', 'Pub/Sub for Stock Webhooks', 'LRU Automatic Eviction'],
    status: 'Active'
  },
  {
    id: 'node-integrations',
    name: 'Regulatory & External Integrations',
    category: 'integration',
    description: 'FDA Orange Book therapeutic bio-equivalence lookup, Stripe Connect multi-tenant payouts, Cold-chain IoT temperature trackers, and HIPAA compliant S3 vault.',
    specs: ['Automated AB-Rating Sync', 'Split-Payment Settlement', 'EPCS Digital Rx Verification', 'AES-256 Object Storage'],
    status: 'Active'
  }
];

export const ArchitectureExplorer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchNode>(ARCH_NODES[3]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">
              SaaS System Architecture Blueprint
            </h1>
            <span className="text-[11px] font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-mono">
              Modular Monolith + Tenant RLS
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Architectural implementation of the Generic Medicine Store specification with multi-tenant data isolation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All 8 Modules Operational</span>
          </span>
        </div>
      </div>

      {/* Main Architectural Layout: Visual Pipeline + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Stack (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Layer 1: Client Interfaces */}
          <div
            onClick={() => setSelectedNode(ARCH_NODES[0])}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-white shadow-xs ${
              selectedNode.id === 'node-client'
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">devices</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs font-headline">Layer 1: Client & Presentation</div>
                  <div className="text-[11px] text-slate-500">Patient Apps, Web Storefront, Vendor Node, Admin SaaS</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-400">
            <span className="material-symbols-outlined text-lg">arrow_downward</span>
          </div>

          {/* Layer 2: Edge & Ingress */}
          <div
            onClick={() => setSelectedNode(ARCH_NODES[1])}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-white shadow-xs ${
              selectedNode.id === 'node-edge'
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">cloud_done</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs font-headline">Layer 2: Edge Ingress & WAF</div>
                  <div className="text-[11px] text-slate-500">Cloudflare Enterprise, DDoS Mitigation, TLS 1.3, Rate-Limit</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                42ms p99
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-400">
            <span className="material-symbols-outlined text-lg">arrow_downward</span>
          </div>

          {/* Layer 3: IAM & Context */}
          <div
            onClick={() => setSelectedNode(ARCH_NODES[2])}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-white shadow-xs ${
              selectedNode.id === 'node-iam'
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">shield</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs font-headline">Layer 3: IAM & Tenant Resolver</div>
                  <div className="text-[11px] text-slate-500">JWT Authentication, RBAC Policies, Tenant Context Injector</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Enforced
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-400">
            <span className="material-symbols-outlined text-lg">arrow_downward</span>
          </div>

          {/* Layer 4: Modular Monolith Application Core */}
          <div
            onClick={() => setSelectedNode(ARCH_NODES[3])}
            className={`p-5 rounded-xl border-2 transition-all cursor-pointer bg-slate-900 text-white shadow-md ${
              selectedNode.id === 'node-monolith'
                ? 'border-sky-400 ring-2 ring-sky-400/40'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-400 text-xl">hub</span>
                <div>
                  <div className="font-bold text-sm font-headline">Layer 4: Modular Monolith Core</div>
                  <div className="text-[11px] text-slate-400">Encapsulated Domain Services with Synchronous In-Process Bus</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                8 Domains Healthy
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px]">
              <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-slate-300 text-center">
                Tenant Mgt
              </div>
              <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-slate-300 text-center">
                Catalog & AB Salts
              </div>
              <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-slate-300 text-center">
                Order Pipeline
              </div>
              <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-slate-300 text-center">
                Repricing Engine
              </div>
              <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-slate-300 text-center">
                Payments (Stripe)
              </div>
              <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-slate-300 text-center">
                Cold-Chain IoT
              </div>
              <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-slate-300 text-center">
                Notification Hub
              </div>
              <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-slate-300 text-center">
                Audit & Security
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-1 text-slate-400">
            <span className="material-symbols-outlined text-lg">arrow_downward</span>
          </div>

          {/* Layer 5: Data & Cache Layer */}
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setSelectedNode(ARCH_NODES[4])}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-white shadow-xs ${
                selectedNode.id === 'node-database'
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-indigo-700">
                <span className="material-symbols-outlined text-lg">database</span>
                <span className="font-bold text-xs font-headline">PostgreSQL RDS Aurora</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Schema-per-tenant (tnt_*), Row-Level Security, Multi-AZ</p>
            </div>

            <div
              onClick={() => setSelectedNode(ARCH_NODES[5])}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-white shadow-xs ${
                selectedNode.id === 'node-redis'
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-red-600">
                <span className="material-symbols-outlined text-lg">memory</span>
                <span className="font-bold text-xs font-headline">Redis Sentinel Cache</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Buy-Box caching, Rate-limits, 4.8 GB / 12.0 GB used</p>
            </div>
          </div>

          {/* Layer 6: External Integrations */}
          <div
            onClick={() => setSelectedNode(ARCH_NODES[6])}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-white shadow-xs ${
              selectedNode.id === 'node-integrations'
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">sync_alt</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs font-headline">External Regulatory & Hardware Bus</div>
                  <div className="text-[11px] text-slate-500">FDA Orange Book API, EPCS Rx Vault, Stripe Connect, IoT Cold-Chain</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Node Deep Dive Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Architecture Inspector
              </span>
              <h3 className="font-bold text-base text-slate-900 font-headline mt-0.5">
                {selectedNode.name}
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {selectedNode.status}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedNode.description}
          </p>

          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Technical Specifications & Invariants
            </span>
            <div className="space-y-1.5">
              {selectedNode.specs.map((spec, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm text-sky-600">check_circle</span>
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RLS Multi-Tenant Security Showcase */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-sky-400">
              <span className="material-symbols-outlined text-base">lock</span>
              <span>PostgreSQL Schema-per-Tenant Policy</span>
            </div>
            <pre className="bg-slate-950 p-2.5 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto">
{`-- Enforce Schema Context per Request
SET search_path TO tnt_apollo_enterprise, public;

CREATE POLICY tenant_isolation_policy ON orders
  FOR ALL
  USING (tenant_id = CURRENT_SETTING('app.current_tenant_id'))
  WITH CHECK (tenant_id = CURRENT_SETTING('app.current_tenant_id'));`}
            </pre>
            <p className="text-[10px] text-slate-300">
              Every database query automatically bounds to the authenticated pharmacy tenant ID. Cross-tenant leakage is mathematically impossible at the kernel level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
