import type { Request, Response } from 'express';
import { dossierText, getDossier } from '../services/dossier.service.js';

export async function dossier(request: Request, response: Response) {
  try {
    const data = await getDossier(String(request.params.id));
    const format = request.query.format === 'json' ? 'json' : 'txt';
    response.setHeader('Content-Disposition', `attachment; filename="MedTrace_Dossier_${request.params.id}.${format}"`);
    response.type(format === 'json' ? 'application/json' : 'text/plain').send(format === 'json' ? JSON.stringify(data, null, 2) : dossierText(data));
  } catch { response.status(404).json({ error: 'Dossier not found' }); }
}