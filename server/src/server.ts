import http from 'node:http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import { config } from './config.js';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFound } from './middleware/errors.js';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: config.clientOrigin } });
app.set('io', io);
app.use(helmet());
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '100kb' }));
app.get('/health', (_request, response) => response.json({ status: 'ok', service: 'medtrace-api' }));
app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);
io.on('connection', (socket) => socket.emit('connected', { service: 'medtrace-api' }));

httpServer.listen(config.port, () => console.log(`MEDTRACE API listening on http://localhost:${config.port}`));