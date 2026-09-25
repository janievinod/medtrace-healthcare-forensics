import { Prisma, Severity } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { hashAlert } from '../utils/hash.js';

const toApiAlert = (alert: Prisma.AlertGetPayload<{}>) => ({ ...alert, timestamp: alert.timestamp.toISOString(), status: alert.status.replace('_', ' ') });

export async function listAlerts(severity?: Severity) {
  const alerts = await prisma.alert.findMany({ where: severity ? { severity } : undefined, orderBy: { timestamp: 'desc' } });
  return alerts.map(toApiAlert);
}

export async function simulate(actorId: string, action: string, recordsAccessed: number, severity: Severity) {
  const actor = await prisma.user.findUniqueOrThrow({ where: { id: actorId } });
  const id = `ALT-${Date.now().toString().slice(-8)}`;
  const timestamp = new Date();
  const fields = {
    id, timestamp: timestamp.toISOString(), doctorName: actor.name, doctorId: actor.employeeId,
    department: actor.department ?? 'Unknown', action, severity, patientId: `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
    description: `Simulated anomaly event: ${action} executed.`, recordsAccessed,
    ipAddress: `10.0.${Math.floor(1 + Math.random() * 9)}.${Math.floor(10 + Math.random() * 80)}`,
    location: 'Chennai Central - Station 2', accessedModule: '/EHR/Clinical/Access', deviceInfo: 'Demo-Simulation-Node'
  };
  const alert = await prisma.alert.create({ data: { ...fields, actorId, timestamp, hash: hashAlert(fields) } });
  await prisma.auditEvent.create({ data: { type: 'ALERT_CREATED', payload: JSON.stringify(fields), hash: alert.hash, actorId, alertId: alert.id } });
  return toApiAlert(alert);
}