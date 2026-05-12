/**
 * API response object.
 */
export class ApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  meta?: any;

  constructor(statusCode: number, data: T, message?: string, meta?: any) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message || "Success";
    this.success = statusCode < 400;
    this.meta = meta;
  }
}
