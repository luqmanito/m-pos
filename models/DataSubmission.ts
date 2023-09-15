export type DataSubmission = DataSubmissionDetail[];

export interface DataSubmissionDetail {
  products: Product[];
  table_no: string;
  payment_method: number;
  total_paid: number;
  ref: string;
  invoiceNumber: string;
  date: string;
  total_price: number;
  cashierName: string;
}

export interface Product {
  id: number;
  quantity: number;
  note: string;
}
