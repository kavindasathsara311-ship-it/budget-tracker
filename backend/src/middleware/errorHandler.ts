import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });
  }

  // Handle Prisma specific errors if needed
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A record with this information already exists.',
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : 'Error',
    message: status === 500 && process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred.' 
      : message,
  });
};
