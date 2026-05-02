/**
 * PostgreSQL Database Client
 * Initializes and manages database connection
 */

import { Pool } from 'pg';
import { logger } from '../utils/logger.js';

export let db: Pool;

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<void> {
  try {
    db = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'waidblick',
      user: process.env.DB_USER || 'waidblick_user',
      password: process.env.DB_PASSWORD || 'password',
      max: 20, // maximum number of clients the pool should contain
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
      connectionTimeoutMillis: 2000, // how long to wait for connection
    });

    // Test connection
    const client = await db.connect();
    logger.info('Database connection successful');
    client.release();
  } catch (error) {
    logger.error('Failed to connect to database', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.end();
    logger.info('Database connection closed');
  }
}

export default db;
