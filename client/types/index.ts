// GMS domain types

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  companyCode: string;
  gateId: number;
  gateName: string;
  permissions: string[];
}

export interface Gate {
  id: number;
  code: string;
  name: string;
  location: string;
  isActive: boolean;
}

export interface Location {
  id: number;
  code: string;
  name: string;
  companyCode: string;
}

export interface Designation {
  id: number;
  code: string;
  name: string;
  companyCode: string;
}

export interface Security {
  id: number;
  code: string;
  name: string;
  mobile: string;
  gender: "Male" | "Female" | "Other";
  photo?: string;
  companyCode: string;
}

export interface Visitor {
  id: number;
  mobile: string;
  visitorType: string;
  name: string;
  company: string;
  toMeet: string;
  remarks?: string;
  vehicleNo?: string;
  passNo?: string;
  inTime: string;
  outTime?: string;
  photo?: string;
  date: string;
  gateId: number;
  companyCode: string;
}

export interface Vehicle {
  id: number;
  vehicleNo: string;
  mobile: string;
  visitType: string;
  name: string;
  company: string;
  warehouse: string;
  remarks?: string;
  passNo?: string;
  inTime: string;
  outTime?: string;
  photo?: string;
  date: string;
  gateId: number;
  companyCode: string;
}

export interface Patrol {
  id: number;
  patrolStart: string;
  patrolEnd?: string;
  remarks?: string;
  gateId: number;
  securityId: number;
  securityName?: string;
  companyCode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  gate: Gate;
}