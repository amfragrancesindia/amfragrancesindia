export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(500, message, false);
  }
}

export const handleApiError = (error: unknown): Response => {
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({ error: error.message, statusCode: error.statusCode }),
      { status: error.statusCode, headers: { 'Content-Type': 'application/json' } }
    );
  }

  console.error('Unhandled error:', error);
  return new Response(
    JSON.stringify({ error: 'Internal server error', statusCode: 500 }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
};
