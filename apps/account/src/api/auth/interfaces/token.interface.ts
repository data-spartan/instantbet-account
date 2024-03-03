export interface Token {
  sub: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenI {
  sub: string;
  iat: number;
  exp: number;
  tokenId: string;
}

export interface EmailToken {
  email: string;
  iat: number;
  exp: number;
}
