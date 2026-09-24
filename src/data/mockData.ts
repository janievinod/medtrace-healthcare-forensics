import { ThreatAlert, PatientRecordHash, GraphNode, GraphLink } from '../types';

export const mockAlerts: ThreatAlert[] = [
  {
    id: 'ALT-2026-8801',
    timestamp: '2026-09-15 01:55:12',
    doctorName: 'Dr. Ravi Iyer',
    doctorId: 'EMP1001',
    department: 'Cardiology',
    action: 'Bulk Record Export',
    severity: 'Critical',
    status: 'Under Review',
    patientId: 'MRN-0001',
    patientName: 'Fictional Patient A1 (and 399 others)',
    ipAddress: '10.0.5.23',
    deviceId: 'LAP-UNKNOWN-01',
    anomalyScore: 96.5,
    description: 'Accessed 400 patient records within 7 minutes from an unregistered laptop at 01:55 AM.',
    recordsAccessed: 400,
    timeWindow: '01:55 AM - 02:02 AM',
    location: 'Unregistered / External IP',
    hashVerified: false,
    expectedHash: 'a8f5f167f44f4964e6c998dee827110c',
    actualHash: 'e3b0c44298fc1c149afbf4c8996fb924'
  },
  {
    id: 'ALT-2026-8794',
    timestamp: '2026-09-14 23:10:04',
    doctorName: 'Dr. Sana Kapoor',
    doctorId: 'EMP1002',
    department: 'Emergency',
    action: 'Unusual Access Time',
    severity: 'Medium',
    status: 'Uninvestigated',
    patientId: 'MRN-0003',
    patientName: 'Fictional Patient A3',
    ipAddress: '10.0.2.12',
    deviceId: 'WS-ER-01',
    anomalyScore: 68.2,
    description: 'Accessed patient file outside scheduled shift hours.',
    recordsAccessed: 12,
    timeWindow: '11:10 PM - 11:25 PM',
    location: 'Emergency Dept Workstation',
    hashVerified: true
  }
];

export const mockHashes: PatientRecordHash[] = [
  {
    recordId: 'REC-1001',
    patientName: 'Fictional Patient A1',
    patientId: 'MRN-0001',
    lastModifiedBy: 'r.iyer',
    timestamp: '2026-09-15 01:56:00',
    originalHash: '8f9b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    currentHash: '8f9b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    isTampered: false
  },
  {
    recordId: 'REC-1005',
    patientName: 'Fictional Patient A5',
    patientId: 'MRN-0005',
    lastModifiedBy: 'r.iyer',
    timestamp: '2026-09-15 01:58:30',
    originalHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    currentHash: '9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a3z2y1x0w9v8u',
    isTampered: true,
    tamperedField: 'Diagnosis / Prescription History'
  }
];

export const mockGraphNodes: GraphNode[] = [
  { id: 'u1', label: 'Dr. Ravi Iyer', type: 'Doctor', riskScore: 96.5, details: 'Cardiology Senior Physician' },
  { id: 'd1', label: 'LAP-UNKNOWN-01', type: 'Device', riskScore: 91.0, details: 'Unregistered Device' },
  { id: 'ip1', label: '10.0.5.23', type: 'IP', riskScore: 88.0, details: 'External / Non-standard Subnet' },
  { id: 'p1', label: 'MRN-0001 - MRN-0400', type: 'Patient', riskScore: 85.0, details: '400 Patient Records' },
  { id: 'a1', label: 'Bulk Export Action', type: 'Action', riskScore: 94.0, details: '400 Reads / 7 Mins' }
];

export const mockGraphLinks: GraphLink[] = [
  { source: 'u1', target: 'd1', relation: 'LOGGED_IN_FROM', timestamp: '01:55 AM' },
  { source: 'd1', target: 'ip1', relation: 'ORIGINATED_AT' },
  { source: 'u1', target: 'a1', relation: 'EXECUTED' },
  { source: 'a1', target: 'p1', relation: 'TARGETED' }
];