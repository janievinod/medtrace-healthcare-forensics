import { io } from 'socket.io-client';
import type { Severity, ThreatAlert, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? '';
const tokenKey = 'medtrace_access_token';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(tokenKey);
  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers }
  });
  if (!response.ok) throw new Error((await response.json()).error ?? 'Request failed');
  return response.json() as Promise<T>;
}

export async function apiLogin(email: string, password: string): Promise<User> {
  const result = await request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  localStorage.setItem(tokenKey, result.token);
  return result.user;
}

export async function apiAlerts(severity?: Severity): Promise<ThreatAlert[]> {
  const result = await request<{ alerts: ThreatAlert[] }>(`/alerts${severity ? `?severity=${severity}` : ''}`);
  return result.alerts;
}

export async function apiSimulate(action: string, recordsAccessed: number, severity: Severity): Promise<ThreatAlert> {
  const result = await request<{ alert: ThreatAlert }>('/alerts/simulate', { method: 'POST', body: JSON.stringify({ action, recordsAccessed, severity }) });
  return result.alert;
}

export const threatSocket = () => io(API_URL || window.location.origin, { transports: ['websocket'], autoConnect: false });
export const clearApiToken = () => localStorage.removeItem(tokenKey);