import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import type { UserRole } from '@prisma/client';

type Claims = { sub: string; role: UserRole; employeeId: string };

export const requireAuth = (request: Request, response: Response, next: NextFunction): void => {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    response.status(401).json({ error: 'Authentication required' });
    return;
  }
  try {
    const claims = jwt.verify(token, config.jwtSecret) as Claims;
    request.auth = { userId: claims.sub, role: claims.role, employeeId: claims.employeeId };
    next();
  } catch {
    response.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles: UserRole[]) => (request: Request, response: Response, next: NextFunction): void => {
  if (!request.auth || !roles.includes(request.auth.role)) {
    response.status(403).json({ error: 'Insufficient permissions' });
    return;
  }
  next();
};