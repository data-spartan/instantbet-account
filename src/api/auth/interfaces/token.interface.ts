export interface Token {
  sub: string;
  iat: number;
  exp: number;
}

export interface EmailToken {
  email: string;
  iat: number;
  exp: number;
}
