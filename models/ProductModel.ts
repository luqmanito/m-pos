export interface ProductListModel {
  data: ProductModel[];
}

export interface ProductModel {
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
  category: Category;
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

export interface Category {
  id: number;
  business_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}
