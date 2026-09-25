import 'dotenv/config';

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'
};