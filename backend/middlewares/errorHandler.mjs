// utils/errorHandler.mjs
import { NODE_ENV } from '../utils/config.mjs';
import logger from '../utils/logger.mjs'; 

export function errorHandler(err, req, res, next) {
  // Status HTTP di default
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details;

  // Gestione errori specifici
  if (err.name === 'ValidationError' || err.errors) {
    // Esempio: express-validator
    status = 400;
    message = 'Validation failed';
    details = err.errors || [];
  } else if (err.code === 'P2002') {
    // Prisma unique constraint violation
    status = 400;
    message = `Unique constraint failed on field: ${err.meta?.target || 'unknown'}`;
  } else if (err.code === 'P2025') {
    // Prisma record not found
    status = 404;
    message = 'Record not found';
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // Log completo lato server (solo per dev o log professionale)
  if (NODE_ENV !== 'production') {
    console.error('--- ERROR HANDLER ---');
    console.error('Status:', status);
    console.error('Message:', message);
    console.error('Details:', details || err);
    console.error('Stack:', err.stack);
    console.error('--------------------');
  } else {
    // In produzione logga in file o logger esterno senza esporre stack
    logger.error({
      status,
      message,
      details: details || err,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    }, 'Server error');
  }

  // Risposta sobria al client
  const payload = { error: message };
  if (details && details.length) payload.details = details;
  if (NODE_ENV !== 'production') payload.stack = err.stack;

  return res.status(status).json(payload);
}
