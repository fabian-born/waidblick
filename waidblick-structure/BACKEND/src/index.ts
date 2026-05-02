/**
 * Waidblick Backend - Main Entry Point
 * Initializes and starts the Express server
 */

import dotenv from 'dotenv';
import { app } from './server.js';
import { initializeDatabase } from './database/client.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start application
 */
async function startServer() {
  try {
    logger.info(`Starting server in ${NODE_ENV} mode...`);

    // Initialize database connection
    await initializeDatabase();
    logger.info('Database connection initialized');

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`API available at http://localhost:${PORT}/api`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();
