import type { Request, Response } from 'express';
import { z } from 'zod';
import { login } from '../services/auth.service.js';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
export async function handleLogin(request: Request, response: Response) {
  try { response.json(await login(schema.parse(request.body).email, schema.parse(request.body).password)); }
  catch { response.status(401).json({ error: 'Invalid email or password' }); }
}