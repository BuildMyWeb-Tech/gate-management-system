export interface AuthUser {
  id: number;
  username: string;
  name: string;
  role: string;
  companyCode: string;
  gateId: number;
  permissions: string[];
}

export interface JwtPayload {
  id: number;
  companyCode: string;
  gateId: number;
  role: string;
}