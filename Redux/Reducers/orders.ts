// orderSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {OrderDetail} from '../../models/OrderDetail';
import {OrderModel} from '../../models/OrderModel';

export interface OrderState {
  orders: OrderModel[];
  order_detail: OrderDetail | null;
}

const initialState: OrderState = {
  orders: [],
  order_detail: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderState: (state, action: PayloadAction<OrderModel[]>) => {
      state.orders = action.payload;
    },
    setOrderDetailState: (state, action: PayloadAction<OrderDetail>) => {
      state.order_detail = action.payload;
    },
    resetOrderDetailState: state => {
      state.order_detail = null;
    },
    clearOrderState(state) {
      state.orders = [];
      state.order_detail = null;
    },
  },
});

export const {
  setOrderState,
  setOrderDetailState,
  clearOrderState,
  resetOrderDetailState,
} = orderSlice.actions;

export default orderSlice.reducer;
