export interface IErrorTypeObject {
  status: number;
  message: string;
  stack: string;
}

export interface IErrorResponse {
  statusCode: number;
  message: string;
  // timestamp: string;
  path: string;
  method: string;
  stack: string | void;
}
