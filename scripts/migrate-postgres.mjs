import nextEnv from '@next/env';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
nextEnv.loadEnvConfig(process.cwd());
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) throw new Error('Falta DATABASE_URL. Conecta Neon desde Storage/Marketplace de Vercel antes de compilar.');
await migrate(drizzle(neon(url)), { migrationsFolder: 'drizzle-pg' });
console.log('Migraciones PostgreSQL aplicadas.');
