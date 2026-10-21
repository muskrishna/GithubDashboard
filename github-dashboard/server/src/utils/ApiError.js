export class ApiError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.retryAfter = extra.retryAfter ?? null;
  }
}
