import { prisma } from '../lib/prisma.js';

export async function lockAccount(employeeId: string, requestedBy: string) {
  const user = await prisma.user.update({ where: { employeeId }, data: { isLocked: true } });
  return prisma.containmentAction.create({ data: { action: 'LOCK_ACCOUNT', targetId: employeeId, requestedBy, details: `Locked ${user.name}` } });
}

export async function killSession(employeeId: string, requestedBy: string) {
  return prisma.containmentAction.create({ data: { action: 'KILL_SESSION', targetId: employeeId, requestedBy, details: 'All active EHR sessions revoked' } });
}