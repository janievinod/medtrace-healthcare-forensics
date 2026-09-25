import { prisma } from '../lib/prisma.js';

export async function getTrends() {
  const alerts = await prisma.alert.findMany({ select: { timestamp: true, severity: true } });
  const weekly = Array.from({ length: 7 }, (_, index) => ({ time: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index], anomalies: 0, critical: 0 }));
  const monthly = Array.from({ length: 12 }, (_, index) => ({ time: new Date(2000, index).toLocaleString('en-US', { month: 'short' }), anomalies: 0, critical: 0 }));
  for (const alert of alerts) {
    const date = new Date(alert.timestamp);
    const week = weekly[date.getDay()];
    const month = monthly[date.getMonth()];
    week.anomalies += 1;
    month.anomalies += 1;
    if (alert.severity === 'Critical') { week.critical += 1; month.critical += 1; }
  }
  return { weekly, monthly };
}