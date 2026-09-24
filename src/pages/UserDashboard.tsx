import React, { useState } from 'react';
import { Severity } from '../types';
import { User, AlertTriangle, Download, Shield, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface UserDashboardProps {
  onTriggerAction: (action: string, records: number, severity: Severity) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onTriggerAction }) => {
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleAction = (action: string, records: number, severity: Severity) => {
    onTriggerAction(action, records, severity);
    setLastAction(`${action} executed (${records} records)`);
    setTimeout(() => setLastAction(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Simulation Workspace
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-2">Hospital Staff User Simulator</h1>
        <p className="text-xs text-slate-600 mt-1">
          Execute actions as an authenticated physician to simulate normal vs anomalous EHR events in real time.
        </p>
      </div>

      {lastAction && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{lastAction} - Telemetry dispatched to SIEM engine!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Trigger 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <Download className="w-4 h-4 text-red-600" /> Bulk Export Action
          </div>
          <p className="text-xs text-slate-500">Downloads 850 Cardiology medical files simultaneously from a remote IP.</p>
          <button
            onClick={() => handleAction('Bulk Patient Data Export', 850, 'Critical')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-xs transition"
          >
            Simulate Bulk Export
          </button>
        </div>

        {/* Trigger 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> VIP Record Access
          </div>
          <p className="text-xs text-slate-500">Accesses restricted patient profiles outside assigned department schedule.</p>
          <button
            onClick={() => handleAction('Unauthorized VIP Record Scan', 15, 'High')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg text-xs transition"
          >
            Simulate VIP Access
          </button>
        </div>

        {/* Trigger 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <ShieldAlert className="w-4 h-4 text-purple-600" /> Off-Hours EHR Query
          </div>
          <p className="text-xs text-slate-500">Executes high-frequency database searches during unapproved hours.</p>
          <button
            onClick={() => handleAction('Off-Hours High-Volume EHR Query', 320, 'Critical')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg text-xs transition"
          >
            Simulate Off-Hours Query
          </button>
        </div>
      </div>
    </div>
  );
};