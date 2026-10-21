import { ApiError } from '../utils/ApiError.js';

export function notFound(_req, _res, next) {
  next(new ApiError(404, 'Route not found.'));
}

// Every error leaves the server in the same shape: { error: { status, message, retryAfter } }
export function errorHandler(err, _req, res, _next) {
  const known = err instanceof ApiError;
  const status = known ? err.status : 500;
  if (!known) console.error(err);
  if (status === 429 && err.retryAfter) res.set('Retry-After', String(err.retryAfter));
  res.status(status).json({
    error: {
      status,
      message: known ? err.message : 'Something went wrong on the server.',
      retryAfter: known ? err.retryAfter : null,
    },
  });
}
