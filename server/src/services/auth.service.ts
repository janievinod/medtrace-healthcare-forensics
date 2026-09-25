import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.isLocked || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign({ role: user.role, employeeId: user.employeeId }, config.jwtSecret, {
    subject: user.id,
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn']
  });
  return {
    token,
    user: { id: user.employeeId, name: user.name, email: user.email, role: user.role === 'SECURITY_ADMIN' ? 'Security Administrator' : 'Hospital User', department: user.department }
  };
}