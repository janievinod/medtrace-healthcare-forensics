import React, { useEffect, useState } from 'react';
import { Shield, Cpu, Lock, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing MEDTRACE Digital Forensics Engine...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        if (prev === 30) setStatusText('Verifying SHA-256 Cryptographic Chain...');
        if (prev === 70) setStatusText('Establishing Secure SIEM Telemetry Bridge...');
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950 text-white z-50 flex flex-col items-center justify-center p-6">
      <div className="relative flex items-center justify-center mb-8">
        {/* Animated Scanning Rings */}
        <div className="absolute w-32 h-32 rounded-full border-2 border-blue-500/30 animate-ping" />
        <div className="absolute w-24 h-24 rounded-full border border-blue-400/50 animate-spin" />
        <div className="bg-blue-600 p-5 rounded-2xl shadow-2xl shadow-blue-500/50 relative z-10">
          <Shield className="w-12 h-12 text-white animate-pulse" />
        </div>
      </div>

      <h1 className="text-3xl font-black tracking-wider text-white">MEDTRACE ENTERPRISE</h1>
      <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mt-1">Healthcare Forensics & Threat Detection</p>

      {/* Progress Bar Container */}
      <div className="w-80 bg-slate-800 rounded-full h-2 mt-8 overflow-hidden border border-slate-700">
        <div 
          className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs font-mono text-slate-400">
        <Cpu className="w-3.5 h-3.5 text-blue-400 animate-spin" />
        <span>{statusText}</span>
        <span className="font-bold text-white">({progress}%)</span>
      </div>
    </div>
  );
};