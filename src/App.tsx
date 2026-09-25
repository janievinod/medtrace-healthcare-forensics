import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/Auth';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { SIEMDashboard } from './pages/SIEMDashboard';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UserDashboard } from './pages/UserDashboard';
import { GraphPage } from './pages/GraphPage';
import { ResponseCenter } from './pages/ResponseCenter';
import { AIReportPage } from './pages/AIReportPage';
import { User, NotificationItem, ThreatAlert, Severity } from './types';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { apiAlerts, apiSimulate, clearApiToken, threatSocket } from './services/api';

const initialMockAlerts: ThreatAlert[] = [
  {
    id: 'ALT-1092',
    timestamp: '18:12:04',
    doctorName: 'Dr. Ravi Iyer',
    doctorId: 'EMP1001',
    department: 'Cardiology',
    action: 'Bulk Patient Data Export',
    severity: 'Critical',
    status: 'Uninvestigated',
    patientId: 'MRN-8821',
    description: 'Bulk download of 850 cardiac records detected via external terminal.',
    recordsAccessed: 850,
    ipAddress: '10.0.5.99',
    location: 'Chennai Central Wing - Terminal 4',
    accessedModule: '/EHR/Cardiology/Export',
    deviceInfo: 'Win11-Workstation-Cardio04'
  }
];

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoute, setRoute] = useState<string>('/home');
  const [demoMode, setDemoMode] = useState<boolean>(false);
  
  const [alerts, setAlerts] = useState<ThreatAlert[]>(initialMockAlerts);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activePopupAlert, setActivePopupAlert] = useState<ThreatAlert | null>(null);

  const handleLogout = () => {
    clearApiToken();
    setCurrentUser(null);
    setRoute('/home');
    setDemoMode(false);
    setAlerts(initialMockAlerts);
    setNotifications([]);
    setActivePopupAlert(null);
  };

  useEffect(() => {
    if (!currentUser) return;
    apiAlerts().then(setAlerts).catch(() => undefined);
    const socket = threatSocket();
    socket.on('threat-alert', (alert: ThreatAlert) => {
      setAlerts(prev => [alert, ...prev.filter(existing => existing.id !== alert.id)]);
      setActivePopupAlert(alert);
    });
    socket.connect();
    return () => { socket.disconnect(); };
  }, [currentUser]);

  const triggerDynamicAlert = async (actionName?: string, recordCount?: number, customSev?: Severity) => {
    const actions = ['Bulk Data Export', 'Record Tampering Attempt', 'Privilege Misuse', 'Off-Hours EHR Scan'];
    const chosenAction = actionName || actions[Math.floor(Math.random() * actions.length)];

    try {
      const newAlert = await apiSimulate(chosenAction, recordCount || Math.floor(100 + Math.random() * 400), customSev || 'Critical');
      setAlerts(prev => [newAlert, ...prev.filter(existing => existing.id !== newAlert.id)]);
      setActivePopupAlert(newAlert);
      return;
    } catch {
      // Keep the demo UI functional when the API is offline.
    }
    const newAlert: ThreatAlert = {
      id: `ALT-${Math.floor(2000 + Math.random() * 8000)}`,
      timestamp: new Date().toLocaleTimeString(),
      doctorName: 'Dr. Ravi Iyer',
      doctorId: 'EMP1001',
      department: 'Cardiology',
      action: chosenAction,
      severity: customSev || 'Critical',
      status: 'Uninvestigated',
      patientId: `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
      description: `Simulated anomaly event: ${chosenAction} executed.`,
      recordsAccessed: recordCount || Math.floor(100 + Math.random() * 400),
      ipAddress: `10.0.${Math.floor(1 + Math.random() * 9)}.${Math.floor(10 + Math.random() * 80)}`,
      location: 'Chennai Central - Station 2',
      accessedModule: '/EHR/Clinical/Access',
      deviceInfo: 'Demo-Simulation-Node'
    };

    setAlerts(prev => [newAlert, ...prev]);
    setActivePopupAlert(newAlert);
  };

  // Demo mode timer: First alert triggers in 5s, recurring alerts every 1 minute (60,000ms)
  useEffect(() => {
    if (!demoMode) return;

    const initialTimeout = setTimeout(() => {
      triggerDynamicAlert('Demo Threat Initialized (5s Trigger)', 450, 'Critical');
    }, 5000); // 5 Seconds First Alert

    const recurringInterval = setInterval(() => {
      triggerDynamicAlert('Recurring Demo Threat (1 Min Loop)', 300, 'Critical');
    }, 60000); // 1 Minute Interval

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(recurringInterval);
    };
  }, [demoMode]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative">
      <Header
        currentRoute={currentRoute}
        setRoute={setRoute}
        currentUser={currentUser}
        onLogout={handleLogout}
        notifications={notifications}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
      />

      {/* Security Threat Popup Overlay */}
      {activePopupAlert && (
        <div className="fixed top-20 right-6 z-50 max-w-md w-full bg-white border-2 border-red-500 rounded-xl shadow-2xl p-5 animate-bounce-once">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span>LIVE SECURITY THREAT DETECTED</span>
            </div>
            <button onClick={() => setActivePopupAlert(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-1">
            <p className="font-bold text-slate-900 text-base">{activePopupAlert.action}</p>
            <p className="text-xs text-slate-600">{activePopupAlert.description}</p>
            <div className="text-[11px] bg-slate-50 p-2 border border-slate-200 rounded text-slate-700 font-mono mt-2">
              <div><strong>User:</strong> {activePopupAlert.doctorName} ({activePopupAlert.department})</div>
              <div><strong>Location:</strong> {activePopupAlert.location}</div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setActivePopupAlert(null);
                setRoute('/response-center');
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 shadow-sm transition"
            >
              Contain Threat <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActivePopupAlert(null)}
              className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {currentRoute === '/home' && <LandingPage setRoute={setRoute} totalAlerts={alerts.length} demoMode={demoMode} />}
        {currentRoute === '/dashboard' && <SIEMDashboard alerts={alerts} onInvestigate={() => setRoute('/response-center')} />}
        {currentRoute === '/analytics' && <AnalyticsPage />}
        {currentRoute === '/user-dashboard' && (
          <UserDashboard onTriggerAction={(action, records, severity) => triggerDynamicAlert(action, records, severity)} />
        )}
        {currentRoute === '/graph' && <GraphPage />}
        {currentRoute === '/response-center' && <ResponseCenter />}
        {currentRoute === '/ai-report' && <AIReportPage alerts={alerts} />}
      </main>
    </div>
  );
}