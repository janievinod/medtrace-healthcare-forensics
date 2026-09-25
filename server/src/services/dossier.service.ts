import { prisma } from '../lib/prisma.js';

export async function getDossier(id: string) {
  const alert = await prisma.alert.findUnique({ where: { id }, include: { actor: true } });
  if (!alert) throw new Error('Dossier not found');
  const dossier = {
    threatActorId: `ACTOR-${alert.doctorId}`,
    alias: 'ShadowMed-Exfiltrator', originIP: alert.ipAddress, proxyNode: 'Unclassified',
    targetEHRModule: alert.accessedModule, compromisedCredentials: `${alert.doctorName} (${alert.doctorId})`,
    attackVector: alert.action, forensicFingerprint: `SHA256: ${alert.hash}`, actionTimestamp: alert.timestamp.toISOString(), alertId: alert.id
  };
  return dossier;
}

export const dossierText = (dossier: Record<string, string>): string =>
  ['MEDTRACE FORENSICS - HACKER THREAT DOSSIER', ...Object.entries(dossier).map(([key, value]) => `${key.padEnd(24)}: ${value}`)].join('\n');