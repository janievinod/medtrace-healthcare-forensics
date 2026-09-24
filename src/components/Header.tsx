import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, ArrowLeft, Home, LayoutDashboard, UserCheck, Share2, ShieldAlert, FileText, LogOut, Play, Square, TrendingUp } from 'lucide-react';
import { User, NotificationItem } from '../types';

interface HeaderProps {
  currentRoute: string;
  setRoute: (route: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  notifications: NotificationItem[];
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  setRoute,
  currentUser,
  onLogout,
  notifications,
  demoMode,
  setDemoMode
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Home Overview', route: '/home', icon: Home },
    { label: 'SIEM Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', route: '/analytics', icon: TrendingUp },
    { label: 'User Simulation', route: '/user-dashboard', icon: UserCheck },
    { label: 'Threat Graph', route: '/graph', icon: Share2 },
    { label: 'Response Center', route: '/response-center', icon: ShieldAlert },
    { label: 'Forensic Report', route: '/ai-report', icon: FileText }
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Universal Motion Back Button */}
        <div className="flex items-center gap-3">
          {currentRoute !== '/home' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRoute('/home')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition border border-slate-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </motion.button>
          )}

          <div onClick={() => setRoute('/home')} className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">MEDTRACE</span>
              <span className="text-[10px] text-slate-500 font-semibold">Enterprise Forensics</span>
            </div>
          </div>
        </div>

        {/* Navigation Item Motion Bar */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentRoute === item.route;
            return (
              <motion.button
                key={item.route}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRoute(item.route)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  active ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </motion.button>
            );
          })}
        </nav>

        {/* Controls and Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              demoMode ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {demoMode ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5" />}
            {demoMode ? 'Stop Demo Mode' : 'Start Demo Mode'}
          </motion.button>

          {/* Logout Button */}
          {currentUser && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLogout}
              className="p-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition"
              title="Logout & Clear Session"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};