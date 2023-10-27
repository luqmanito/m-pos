export interface UserModel {
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
  photo: Photo[];
  modules: Modules[];
}

export interface Modules {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  pivot: PivotModule;
}

export interface PivotModule {
  business_id: number;
  module_id: number;
  setting_value: number;
}

export interface Photo {
  id: number;
  model_type: string;
  model_id: number;
  uuid: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string;
  disk: string;
  conversions_disk: string;
  size: number;
  manipulations: any[];
  custom_properties: any[];
  generated_conversions: any[];
  responsive_images: any[];
  order_column: number;
  created_at: string;
  updated_at: string;
  original_url: string;
  preview_url: string;
}
