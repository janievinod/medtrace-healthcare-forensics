import type { Request, Response } from 'express';
import { Severity } from '@prisma/client';
import { z } from 'zod';
import { listAlerts, simulate } from '../services/alert.service.js';

export async function getAlerts(request: Request, response: Response) {
  const severity = request.query.severity as Severity | undefined;
  if (severity && !Object.values(Severity).includes(severity)) { response.status(400).json({ error: 'Invalid severity' }); return; }
  response.json({ alerts: await listAlerts(severity) });
}

const simulationSchema = z.object({ action: z.string().min(2).max(120), recordsAccessed: z.number().int().nonnegative().max(100000), severity: z.nativeEnum(Severity) });
export async function simulateAlert(request: Request, response: Response) {
  const input = simulationSchema.parse(request.body);
  const alert = await simulate(request.auth!.userId, input.action, input.recordsAccessed, input.severity);
  request.app.get('io').emit('threat-alert', alert);
  response.status(201).json({ alert });
}