import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'yup';
import httpStatus from 'http-status-codes';
import { messagesHelper } from '../helpers/messages.helper';

function basicErrorRes(res: Response, e: any): Response {
  const statusCode = e.statusCode || httpStatus.BAD_REQUEST;

  return res.status(statusCode).json({
    status: httpStatus.getStatusText(statusCode),
    statusCode: statusCode,
    error: e.message,
  });
}

function yupValidationRes(res: Response, e: ValidationError): Response {
  return res.status(httpStatus.BAD_REQUEST).json({
    status: httpStatus.getStatusText(httpStatus.BAD_REQUEST),
    statusCode: httpStatus.BAD_REQUEST,
    message: messagesHelper.VALIDATION_ERROR,
    errors: e.inner.reduce((acc: any, cur) => {
      const key = cur.path;
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push({
        message: cur.message,
      });

      return acc;
    }, {}),
  });
}

export function errorMiddleware(e: any, req: Request, res: Response, next: NextFunction): Response {
  if (e.name === 'ValidationError') return yupValidationRes(res, e);

  return basicErrorRes(res, e);
}
