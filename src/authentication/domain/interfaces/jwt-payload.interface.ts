export interface JwtPayload {
  sub: string; // User ID
  username: string;
  fullname: string;
  roleId: number;
  iat?: number;
  exp?: number;
}
