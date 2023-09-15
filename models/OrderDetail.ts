export interface OrderDetail {
  id: number;
  business_id: number;
  customer_id: any;
  status: any;
  order_code: string;
  created_by: CreatedBy;
  edited_by: any;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  table_no: any;
  payment_method_id: number;
  note: any;
  total_paid: number;
  total: number;
  products: Product[];
}

export interface CreatedBy {
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

export interface Product {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  note?: string;
  product?: Product2;
}

export interface Product2 {
  id: number;
  business_id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  category_id: number;
  is_subtract: boolean;
  quantity: number;
  photos: Photo[];
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
