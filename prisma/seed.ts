import bcrypt from 'bcrypt';
import { PrismaClient, Severity } from '@prisma/client';
import { hashAlert } from '../server/src/utils/hash.js';

const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.upsert({ where: { email: 'admin@medtrace.com' }, update: {}, create: { employeeId: 'SEC-101', name: 'Chief Information Security Officer', email: 'admin@medtrace.com', passwordHash: await bcrypt.hash('admin123', 12), role: 'SECURITY_ADMIN', department: 'Cybersecurity Operations Center' } });
  const doctor = await prisma.user.upsert({ where: { email: 'doctor.iyer@hospital.org' }, update: {}, create: { employeeId: 'EMP1001', name: 'Dr. Ravi Iyer', email: 'doctor.iyer@hospital.org', passwordHash: await bcrypt.hash('docpass2026', 12), role: 'HOSPITAL_STAFF', department: 'Cardiology' } });
  const existing = await prisma.alert.count();
  if (!existing) {
    const fields = { id: 'ALT-2026-8801', timestamp: new Date('2026-09-15T01:55:12Z'), doctorName: doctor.name, doctorId: doctor.employeeId, department: doctor.department!, action: 'Bulk Record Export', severity: Severity.Critical, patientId: 'MRN-0001', description: 'Accessed 400 patient records within 7 minutes from an unregistered laptop at 01:55 AM.', recordsAccessed: 400, ipAddress: '10.0.5.23', location: 'Unregistered / External IP', accessedModule: '/EHR/Cardiology/Export', deviceInfo: 'LAP-UNKNOWN-01' };
    await prisma.alert.create({ data: { ...fields, actorId: doctor.id, hash: hashAlert({ ...fields, timestamp: fields.timestamp.toISOString() }) } });
  }
  console.log(`Seeded ${admin.email} and ${doctor.email}`);
}
main().finally(() => prisma.$disconnect());