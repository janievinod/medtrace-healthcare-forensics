export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type UserRole = 'Security Administrator' | 'Hospital User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface ThreatAlert {
  id: string;
  timestamp: string;
  doctorName: string;
  doctorId: string;
  department: string;
  action: string;
  severity: Severity;
  status: 'Uninvestigated' | 'Under Review' | 'Mitigated' | 'Acknowledged';
  patientId: string;
  description: string;
  recordsAccessed: number;
  ipAddress: string;
  location: string;
  accessedModule: string;
  deviceInfo: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: Severity;
  read: boolean;
}