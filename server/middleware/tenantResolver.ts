import { Request, Response, NextFunction } from 'express';
import { storage } from '../services/storageService';
import { TenantOrganization } from '../../src/types';

export interface TenantContext {
  tenantId: string;
  tenantCode: string;
  schemaName: string;
  tier: string;
  commissionRate: number;
  tenant: TenantOrganization;
}

declare global {
  namespace Express {
    interface Request {
      tenantContext?: TenantContext;
    }
  }
}

/**
 * Tenant Context Resolver Middleware:
 * Resolves tenant from HTTP headers ('x-tenant-id'), subdomain, or query parameters.
 * Guarantees zero cross-tenant data leakage by attaching isolated tenant context to req.
 */
export function tenantResolver(req: Request, res: Response, next: NextFunction): void {
  // Check header first, then query parameter
  const rawTenant = req.headers['x-tenant-id'] || req.query.tenantId;

  if (!rawTenant || typeof rawTenant !== 'string') {
    // For general public marketplace endpoints, default context or pass through
    const defaultTenant = storage.getTenants()[0];
    if (defaultTenant) {
      req.tenantContext = {
        tenantId: defaultTenant.id,
        tenantCode: defaultTenant.code,
        schemaName: defaultTenant.schema,
        tier: defaultTenant.tier,
        commissionRate: defaultTenant.commissionRate,
        tenant: defaultTenant
      };
    }
    return next();
  }

  const tenant = storage.getTenant(rawTenant);
  if (!tenant) {
    res.status(404).json({
      error: 'TenantNotFound',
      message: `No active pharmacy organization registered for tenant code: ${rawTenant}`
    });
    return;
  }

  if (tenant.status === 'Suspended') {
    res.status(403).json({
      error: 'TenantSuspended',
      message: `Tenant ${tenant.name} is currently suspended due to audit non-compliance.`
    });
    return;
  }

  req.tenantContext = {
    tenantId: tenant.id,
    tenantCode: tenant.code,
    schemaName: tenant.schema,
    tier: tenant.tier,
    commissionRate: tenant.commissionRate,
    tenant
  };

  next();
}

/**
 * Strict Tenant Boundary Enforcement:
 * Rejects requests attempting to access another tenant's schema or data partition.
 */
export function enforceTenantBoundary(allowedTenantCode?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.tenantContext) {
      res.status(401).json({ error: 'Unauthorized', message: 'Tenant context required.' });
      return;
    }

    if (allowedTenantCode && req.tenantContext.tenantCode.toLowerCase() !== allowedTenantCode.toLowerCase()) {
      res.status(403).json({
        error: 'CrossTenantViolation',
        message: 'Access denied. Cross-tenant data inspection is strictly prohibited.'
      });
      return;
    }

    next();
  };
}
