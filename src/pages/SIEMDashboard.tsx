import React, { useState } from 'react';
import { ThreatAlert } from '../types';
import { ShieldAlert, MapPin, HardDrive, Filter, CheckCircle2, ArrowRight } from 'lucide-react';

interface SIEMDashboardProps {
  alerts: ThreatAlert[];
  onInvestigate: (alert: ThreatAlert) => void;
}

export const SIEMDashboard: React.FC<SIEMDashboardProps> = ({ alerts, onInvestigate }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const filteredAlerts = filterSeverity === 'All' 
    ? alerts 
    : alerts.filter(a => a.severity === filterSeverity);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Live Monitoring
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">SIEM Threat Dashboard</h1>
          <p className="text-xs text-slate-600 mt-1">Real-time incident feed collected from electronic health record modules.</p>
        </div>

        {/* Severity Filter Controls */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-2" />
          {['All', 'Critical', 'High', 'Medium'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterSeverity === sev ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
            No incident alerts matched the current filter criteria.
          </div>
        ) : (
          filteredAlerts.map((a) => (
            <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-blue-600">{a.id}</span>
                  <span className="text-[11px] text-slate-400">{a.timestamp}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    a.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                    {a.location}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{a.action}</h3>
                <p className="text-xs text-slate-600">{a.description}</p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                  <div><strong>User:</strong> {a.doctorName} ({a.department})</div>
                  <div className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> IP: {a.ipAddress}</div>
                  <div><strong>Records:</strong> {a.recordsAccessed} items</div>
                </div>
              </div>

              <button
                onClick={() => onInvestigate(a)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm transition hover:-translate-y-0.5"
              >
                Investigate Threat <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};