export type PaymentMethodModel = PaymentModelContent[];

export interface PaymentModelContent {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  pivot: Pivot;
}

export interface Pivot {
  business_id: number;
  payment_method_id: number;
  status: number;
}
