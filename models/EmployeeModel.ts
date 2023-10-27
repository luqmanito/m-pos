export interface NewEmployeeModel {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: any;
  created_at: string;
  updated_at: string;
  business_id: number;
  deleted_at: any;
  business: Business;
}

export interface Business {
  id: number;
  parent_id: any;
  name: string;
  phone: string;
  email: any;
  address: string;
  lat: any;
  lng: any;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}

export type ListEmployeeModel = EmployeeDetailModel[];

export interface EmployeeDetailModel {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: any;
  created_at: string;
  updated_at: string;
  business_id: number;
  deleted_at: any;
}

export interface UpdateEmployeeModel {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: any;
  created_at: string;
  updated_at: string;
  business_id: number;
  deleted_at: any;
  business: Business;
}
