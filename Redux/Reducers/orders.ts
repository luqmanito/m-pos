// orderSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {OrderModel} from '../../models/OrderModel';

export interface OrderState {
  orders: OrderModel[];
}

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderState: (state, action: PayloadAction<OrderModel[]>) => {
      state.orders = action.payload;
    },
    clearOrderState(state) {
      state.orders = [];
    },
  },
});

export const {setOrderState, clearOrderState} = orderSlice.actions;

export default orderSlice.reducer;
