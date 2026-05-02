/**
 * Request Logger Middleware
 * Logs all incoming HTTP requests
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const method = req.method;
  const path = req.path;

  // Log response when it ends
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    logger.info(`${method} ${path} ${statusCode}`, {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
}

export default requestLogger;
