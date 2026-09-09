import { Router, Request, Response } from 'express';
import { storage } from '../services/storageService';
import { INITIAL_USER } from '../../src/data/userData';
import { UserProfile } from '../../src/types';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', (req: Request, res: Response): void => {
  const { role, email } = req.body;
  const user: UserProfile = storage.getUserProfile('usr-001') || {
    ...INITIAL_USER,
    id: 'usr-001',
    email: email || INITIAL_USER.email,
    role: role || INITIAL_USER.role
  };

  if (role) {
    user.role = role;
    user.roleTitle = role === 'pharmacy_admin' 
      ? 'Licensed Pharmacist / Branch Admin' 
      : (role === 'superadmin' ? 'Platform Operations Lead' : 'Active Patient Member');
  }

  storage.saveUserProfile(user);

  res.json({
    token: 'jwt-rs256-mock-token-' + Date.now(),
    expiresIn: 86400,
    user
  });
});

// GET /api/v1/auth/me
router.get('/me', (req: Request, res: Response): void => {
  const user = storage.getUserProfile('usr-001');
  res.json({ user });
});

// POST /api/v1/auth/logout
router.post('/logout', (req: Request, res: Response): void => {
  res.json({ success: true, message: 'Session invalidated in Redis.' });
});

export default router;
