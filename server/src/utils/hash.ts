import { createHash } from 'node:crypto';

export const sha256 = (value: string): string => createHash('sha256').update(value, 'utf8').digest('hex');

export const hashAlert = (alert: Record<string, unknown>): string =>
  sha256(JSON.stringify(Object.keys(alert).sort().reduce<Record<string, unknown>>((result, key) => {
    result[key] = alert[key];
    return result;
  }, {})));