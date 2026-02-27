import { Response } from "express";

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

const sendResponse = <T>(
  res: Response<any, Record<string, any>>,
  { statusCode, success, message, data }: ApiResponse<T>
) => {
  return res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
  });
};

export default sendResponse;

