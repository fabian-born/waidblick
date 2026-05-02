/**
 * API Response Formatter
 * Standardizes all API responses
 */

import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}

/**
 * Send successful response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): void {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  statusCode: number = 500,
  message: string = 'Error',
  code: string = 'INTERNAL_ERROR'
): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
}

export { SuccessResponse, ErrorResponse };
