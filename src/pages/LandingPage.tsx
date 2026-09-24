import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, ArrowRight, Zap, Calendar, TrendingUp, BarChart3, LineChart, ShieldAlert, Sparkles } from 'lucide-react';

interface LandingPageProps {
  setRoute: (route: string) => void;
  totalAlerts: number;
  demoMode: boolean;
}

const weeklyData = [
  { time: 'Mon', anomalies: 12, critical: 3 },
  { time: 'Tue', anomalies: 19, critical: 5 },
  { time: 'Wed', anomalies: 8, critical: 1 },
  { time: 'Thu', anomalies: 24, critical: 8 },
  { time: 'Fri', anomalies: 31, critical: 12 },
  { time: 'Sat', anomalies: 15, critical: 4 },
  { time: 'Sun', anomalies: 9, critical: 2 },
];

const monthlyData = [
  { time: 'Jan', anomalies: 120, critical: 24 },
  { time: 'Feb', anomalies: 98, critical: 18 },
  { time: 'Mar', anomalies: 145, critical: 32 },
  { time: 'Apr', anomalies: 210, critical: 45 },
  { time: 'May', anomalies: 180, critical: 29 },
  { time: 'Jun', anomalies: 250, critical: 58 },
];

export const LandingPage: React.FC<LandingPageProps> = ({ setRoute, totalAlerts, demoMode }) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const activeData = viewMode === 'weekly' ? weeklyData : monthlyData;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Translucent Moving Health / ECG Banner Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 260;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Translucent Pulse wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.4)';
      ctx.lineWidth = 2.5;

      const midY = canvas.height / 2;
      for (let x = 0; x < canvas.width; x++) {
        const offset = (x + step) % 180;
        let y = midY;
        if (offset > 40 && offset < 50) y -= 15;
        else if (offset >= 50 && offset < 65) y += 35;
        else if (offset >= 65 && offset < 80) y -= 50;
        else if (offset >= 80 && offset < 95) y += 20;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += 2;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Motion Banner with Translucent Canvas Background */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 border border-slate-800 rounded-2xl p-8 shadow-xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

        <div className="max-w-2xl space-y-4 relative z-10 text-white">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" /> Translucent Health Forensics
          </span>

          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Healthcare Digital Forensics Platform
          </h1>

          <p className="text-slate-300 text-xs lg:text-sm leading-relaxed">
            Monitor insider threats, analyze real-time medical record access anomalies, view graph node connections, and execute automated incident containment playbooks.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setRoute('/dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5"
            >
              Go to SIEM Dashboard <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setRoute('/response-center')}
              className="bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg backdrop-blur-md transition hover:-translate-y-0.5"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" /> Response Center
            </button>
          </div>
        </div>

        {/* Floating Shield Engine Indicator */}
        <div className="w-full lg:w-72 h-56 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col items-center justify-center relative backdrop-blur-lg shadow-2xl shrink-0 z-10">
          <div className="relative z-10 bg-blue-600/30 p-5 rounded-2xl border border-blue-400/50 shadow-xl shadow-blue-500/30 animate-pulse">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-[11px] font-bold text-white uppercase tracking-widest mt-4">Forensic Engine Active</p>
          <p className="text-[10px] text-blue-300 font-mono mt-0.5">SHA-256 Chain Verified</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Protection Status</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">Active Shield</p>
          <p className="text-[11px] text-slate-500 mt-1">Write-time tamper checking active</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Total Incident Alerts</h3>
          <p className="text-2xl font-black text-blue-600 mt-2">{totalAlerts}</p>
          <p className="text-[11px] text-slate-500 mt-1">Inspected across hospital EHR</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Simulation Mode</h3>
          <p className="text-2xl font-black text-slate-800 mt-2">{demoMode ? 'Running (1 min loop)' : 'Idle'}</p>
          <p className="text-[11px] text-slate-500 mt-1">First alert pops in 5s upon start</p>
        </div>
      </div>

      {/* Motionable Interactive Analytics Charts */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Interactive Analytics
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Historical Anomaly Trend Analysis</h2>
            <p className="text-xs text-slate-500">Interactive motion charts mapping system threat spikes over selected timeframes.</p>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                viewMode === 'weekly' ? 'bg-white text-blue-600 shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Weekly
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                viewMode === 'monthly' ? 'bg-white text-blue-600 shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Motion Chart 1: Smooth Wave Area */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <LineChart className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Chart 1: Anomaly Access Volume</h3>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeData}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px' }} />
                  <Area
                    type="monotone"
                    dataKey="anomalies"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#blueGradient)"
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Motion Chart 2: Animated Bar Spikes */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 transition hover:border-red-300 hover:shadow-md">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <BarChart3 className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Chart 2: Critical Severity Spikes</h3>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px' }} />
                  <Bar
                    dataKey="critical"
                    fill="#dc2626"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};