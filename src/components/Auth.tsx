import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@medtrace.com');
  const [password, setPassword] = useState('admin123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) {
      onLoginSuccess({
        id: 'SEC-101',
        name: 'Chief Information Security Officer',
        email,
        role: 'Security Administrator',
        department: 'Cybersecurity Operations Center'
      });
    } else {
      onLoginSuccess({
        id: 'DOC-204',
        name: 'Dr. Ravi Iyer',
        email,
        role: 'Hospital User',
        department: 'Cardiology'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-blue-600 p-3.5 rounded-2xl text-white mb-3 shadow-lg shadow-blue-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">MEDTRACE Enterprise</h2>
          <p className="text-slate-500 text-xs mt-1">Healthcare Digital Forensics Platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-600 block mb-1">Email ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-600 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
          >
            Sign In To Forensic Portal <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200">
          <p className="text-[11px] font-bold uppercase text-slate-500 mb-2.5">Demo Credentials Quick Select:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@medtrace.com');
                setPassword('admin123');
              }}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl text-left transition hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Set 1: Security Admin</div>
                  <div className="text-[10px] text-slate-500 font-mono">admin@medtrace.com</div>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-bold">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('doctor.iyer@hospital.org');
                setPassword('docpass2026');
              }}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 rounded-xl text-left transition hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Set 2: Hospital Staff / Doctor</div>
                  <div className="text-[10px] text-slate-500 font-mono">doctor.iyer@hospital.org</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">Doctor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};