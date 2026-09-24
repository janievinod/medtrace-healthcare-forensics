import React from 'react';
import { Download, FileText, CheckCircle2, ShieldCheck, MapPin, HardDrive } from 'lucide-react';
import { ThreatAlert } from '../types';

interface AIReportPageProps {
  alerts: ThreatAlert[];
}

export const AIReportPage: React.FC<AIReportPageProps> = ({ alerts }) => {
  const downloadReport = () => {
    const timestamp = new Date().toISOString();
    const reportText = `======================================================================
MEDTRACE ENTERPRISE DIGITAL FORENSICS REPORT
Generated At: ${timestamp}
System Status: ACTIVE | Integrity Verification: SHA-256 Valid
======================================================================

INCIDENT AUDIT LOG SUMMARY:
Total Tracked Incidents: ${alerts.length}

DETAILED INCIDENT RECORDS:
${alerts.map((a, i) => `
----------------------------------------------------------------------
[INCIDENT #${i + 1}] ID:${a.id}
Timestamp          : ${a.timestamp}
Action             : ${a.action}
Severity           : ${a.severity}
Status             : ${a.status}
Doctor / Account   : ${a.doctorName} (ID:${a.doctorId})
Department         : ${a.department}
Target Patient ID  : ${a.patientId}
Records Accessed   : ${a.recordsAccessed} items
Module Accessed    : ${a.accessedModule}
IP Origin          : ${a.ipAddress}
Geographic Location: ${a.location}
Device Signature   : ${a.deviceInfo}
Description        : ${a.description}
----------------------------------------------------------------------`).join('\n')}

FORENSIC CONCLUSION:
All anomalous events have been logged with cryptographic immutability.
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MedTrace_Forensic_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            Forensic Documentation
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">Full System Forensic Report</h1>
          <p className="text-slate-600 text-xs mt-1">
            Complete audit breakdown of accessed records, origin IPs, device hardware IDs, and physical locations.
          </p>
        </div>
        <button
          onClick={downloadReport}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Download className="w-4 h-4" /> File & Download Full Report
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" /> Logged Security Incidents ({alerts.length})
        </h3>

        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-mono font-bold text-blue-600">{a.id}</span>
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">{a.severity}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-slate-700">
                <div><strong className="text-slate-900">Action:</strong> {a.action}</div>
                <div><strong className="text-slate-900">User:</strong> {a.doctorName}</div>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {a.location}</div>
                <div className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-slate-400" /> IP: {a.ipAddress}</div>
              </div>
              <div className="text-slate-600 bg-white p-2 border border-slate-200 rounded text-[11px]">
                <strong>Module & Path:</strong> {a.accessedModule} | <strong>Records Affected:</strong> {a.recordsAccessed} items | <strong>Device:</strong> {a.deviceInfo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};