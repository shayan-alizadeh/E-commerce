import { Response, Request } from 'express';

export function sendErrorResponse(
  response: Response,
  request: Request,
  status: number,
  message: string | string[],
) {
  // اگر class-validator آرایه‌ای از خطاها داد، اولی را برمی‌داریم
  const finalMessage = Array.isArray(message) ? message[0] : message;

  response.status(status).json({
    success: false,
    statusCode: status,
    message: finalMessage,
    timeStamp: new Date().toISOString(), // فرمت استانداردتر نسبت به toString
    path: request.url,
  });
}
