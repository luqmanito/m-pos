export interface PaymentModel {
  id: number;
  business_id: number;
  customer_id: any;
  status: any;
  order_code: string;
  created_by: number;
  edited_by: any;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  table_no: string;
  payment_method_id: number;
  note: any;
  total_paid: number;
  total: string;
  products: Product[];
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
  note: string;
}
