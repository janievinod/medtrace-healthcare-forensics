import React, { useState } from 'react';
import { ShieldCheck, FileText, Download, Lock, UserX, AlertTriangle, CheckCircle2, UserSearch } from 'lucide-react';

export const ResponseCenter: React.FC = () => {
  const [showHackerDownload, setShowHackerDownload] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const triggerStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleFileCompliance = () => {
    setShowHackerDownload(true);
    triggerStatus('HIPAA Compliance Incident Report Filed Successfully.');
  };

  const handleDownloadHackerDetails = (format: 'txt' | 'json') => {
    const hackerData = {
      threatActorId: 'ADV-8092-X',
      alias: 'ShadowMed-Exfiltrator',
      originIP: '185.220.101.4',
      proxyNode: 'Tor-Exit-Node-DE',
      targetEHRModule: 'Cardiology Patient Data',
      compromisedCredentials: 'Dr. Ravi Iyer (EMP1001)',
      attackVector: 'Stolen Session Token / Lateral Access Attempt',
      forensicFingerprint: 'SHA256: 8f4e2c91b5a7308d...e4a1',
      actionTimestamp: '2026-09-24 18:12:04 IST'
    };

    let content = '';
    let mimeType = 'text/plain';
    let fileName = `Hacker_Forensic_Dossier_ADV8092X.${format}`;

    if (format === 'json') {
      content = JSON.stringify(hackerData, null, 2);
      mimeType = 'application/json';
    } else {
      content = `=================================================\n` +
        `MEDTRACE FORENSICS - HACKER THREAT DOSSIER\n` +
        `=================================================\n` +
        `Threat Actor ID : ${hackerData.threatActorId}\n` +
        `Alias           : ${hackerData.alias}\n` +
        `Origin IP       : ${hackerData.originIP}\n` +
        `Proxy Node      : ${hackerData.proxyNode}\n` +
        `Target Module   : ${hackerData.targetEHRModule}\n` +
        `Compromised User: ${hackerData.compromisedCredentials}\n` +
        `Attack Vector   : ${hackerData.attackVector}\n` +
        `Fingerprint     : ${hackerData.forensicFingerprint}\n` +
        `Timestamp       : ${hackerData.actionTimestamp}\n` +
        `=================================================\n`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerStatus(`Hacker Dossier Downloaded (${format.toUpperCase()} format)`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Threat Mitigation
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-2">Incident Response & Containment Center</h1>
        <p className="text-xs text-slate-600 mt-1">
          Automated and manual containment playbooks for detected healthcare insider threats.
        </p>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Containment Playbooks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Playbook 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
            <UserX className="w-4 h-4" /> Bulk Data Exfiltration
          </div>
          <p className="text-xs text-slate-500">Dr. Ravi Iyer (EMP1001)</p>
          <div className="space-y-2">
            <button
              onClick={() => triggerStatus('Account EMP1001 Locked Instantly.')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <Lock className="w-3.5 h-3.5" /> Lock Active Account
            </button>
            <button
              onClick={() => triggerStatus('EHR Session Revoked Across Terminals.')}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Kill Active EHR Session
            </button>
          </div>
        </div>

        {/* Playbook 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" /> Compromised Credentials
          </div>
          <p className="text-xs text-slate-500">Unrecognized Workstation Laptop Access</p>
          <div className="space-y-2">
            <button
              onClick={() => triggerStatus('Re-Authentication Challenge Sent.')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              Force Identity Re-auth
            </button>
            <button
              onClick={() => triggerStatus('Device Hardware ID Blocked.')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition"
            >
              Blocklist Device ID
            </button>
          </div>
        </div>

        {/* Playbook 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <FileText className="w-4 h-4" /> HIPAA Legal Disclosure
          </div>
          <p className="text-xs text-slate-500">Automated Breach Filing</p>
          
          <button
            onClick={handleFileCompliance}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
          >
            <FileText className="w-3.5 h-3.5" /> File Compliance Report
          </button>
        </div>
      </div>

      {/* Downward Option Triggered Upon Clicking File Compliance Report */}
      {showHackerDownload && (
        <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-6 shadow-2xl text-white space-y-4 animate-fade-in mt-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <UserSearch className="w-5 h-5 text-red-400" />
              <h3 className="font-black text-sm uppercase tracking-wider text-red-400">
                Forensic Intelligence: Threat Actor Dossier
              </h3>
            </div>
            <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2.5 py-0.5 rounded font-mono font-bold">
              CONFIDENTIAL FORENSICS
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Export the complete attacker telemetry profile including origin IP, attack vector, target module, and cryptographic SHA-256 signatures for legal submission.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleDownloadHackerDetails('txt')}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" /> Download Hacker Details (.TXT)
            </button>

            <button
              onClick={() => handleDownloadHackerDetails('json')}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4 text-blue-400" /> Download Hacker Details (.JSON)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};