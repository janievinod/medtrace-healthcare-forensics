import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, BarChart3, LineChart } from 'lucide-react';

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

export const AnalyticsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const activeData = viewMode === 'weekly' ? weeklyData : monthlyData;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header and Toggle Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Deep Trend Forensics
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">Historical Anomaly Analytics</h1>
          <p className="text-slate-600 text-xs mt-1">
            Comparative analysis of medical record access violations and abnormal insider activities.
          </p>
        </div>

        {/* Animated Segment Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1 border border-slate-200">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'weekly' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Weekly View
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'monthly' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Monthly Trends
          </motion.button>
        </div>
      </div>

      {/* Dual Chart Perspectives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART TYPE 1: Animated Area Gradient Flow Chart */}
        <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">Chart Type 1: Volume Growth Curve</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">{viewMode} breakdown</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Area type="monotone" dataKey="anomalies" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorAnomalies)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CHART TYPE 2: Critical Severity Bar Spectrum */}
        <motion.div whileHover={{ y: -2 }} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-slate-800 text-sm">Chart Type 2: Critical Incident Frequency</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">{viewMode} breakdown</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="critical" fill="#dc2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};