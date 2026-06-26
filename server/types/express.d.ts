// Adapted from OTT — replaced IUser with GMS AuthUser
declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        username: string;
        name: string;
        role: string;
        companyCode: string;
        gateId: number;
        permissions: string[];
      };
    }
  }
}

export {};