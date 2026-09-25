import type { Request, Response } from 'express';
import { z } from 'zod';
import { killSession, lockAccount } from '../services/containment.service.js';

const schema = z.object({ employeeId: z.string().min(2).max(40) });
export async function lock(request: Request, response: Response) { const { employeeId } = schema.parse(request.body); response.status(201).json({ action: await lockAccount(employeeId, request.auth!.userId) }); }
export async function kill(request: Request, response: Response) { const { employeeId } = schema.parse(request.body); response.status(201).json({ action: await killSession(employeeId, request.auth!.userId) }); }