import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Product} from '../../models/OrderDetail';

export interface PaymentItem {
  totalPrice: number | string;
  totalPayment: number;
  exchangePayment: number;
  invoiceNumber: string;
  datePayment: string;
  cashierName: string | undefined;
  products?: Product[];
}

export interface PaymentState {
  items: PaymentItem[];
}

const initialState: PaymentState = {
  items: [],
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    createPayment(state, action: PayloadAction<PaymentItem>) {
      const {
        totalPrice,
        totalPayment,
        exchangePayment,
        invoiceNumber,
        datePayment,
        cashierName,
        products,
      } = action.payload;

      state.items = [
        {
          totalPrice,
          totalPayment,
          exchangePayment,
          invoiceNumber,
          datePayment,
          cashierName,
          products,
        },
      ];
    },
    clearCartPayment(state) {
      state.items = [];
    },
  },
});

export const {createPayment, clearCartPayment} = paymentSlice.actions;

export default paymentSlice.reducer;
