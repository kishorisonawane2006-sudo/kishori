import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(`[Server Error] ${req.method} ${req.url}:`, err.stack);

  res.status(500).json({
    error: 'InternalServerError',
    message: err.message || 'An unexpected error occurred processing your request.',
    timestamp: new Date().toISOString()
  });
}
