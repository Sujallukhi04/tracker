import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = "Something went wrong";
  let details: any = undefined;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }
  // Handle Mongoose Validation Errors
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
  }
  // Handle Mongoose Cast Errors (e.g., invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for path: ${err.path}`;
  }
  // Handle MongoDB duplicate key error
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {}).join(", ");
    message = `Duplicate field value entered: ${field}`;
  }
  // Handle our custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle other explicitly thrown standard errors
  else if (err instanceof Error) {
    message = err.message;
  }

  // Log error details for development/debug
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

