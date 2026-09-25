import { Router } from 'express';
import { handleLogin } from '../controllers/auth.controller.js';
import { getAlerts, simulateAlert } from '../controllers/alert.controller.js';
import { kill, lock } from '../controllers/containment.controller.js';
import { dossier } from '../controllers/report.controller.js';
import { getTrends } from '../services/analytics.service.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const apiRouter = Router();
apiRouter.post('/auth/login', handleLogin);
apiRouter.get('/alerts', requireAuth, getAlerts);
apiRouter.post('/alerts/simulate', requireAuth, simulateAlert);
apiRouter.post('/containment/lock-account', requireAuth, requireRole('SECURITY_ADMIN'), lock);
apiRouter.post('/containment/kill-session', requireAuth, requireRole('SECURITY_ADMIN'), kill);
apiRouter.get('/reports/hacker-dossier/:id', requireAuth, requireRole('SECURITY_ADMIN'), dossier);
apiRouter.get('/analytics/trends', requireAuth, getTrends);