import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PaymentModelContent} from '../../models/PaymentMethod';

// Define an initial state
const initialState: PaymentModelContent[] = [];

// Create a slice
const paymentMethodSlice = createSlice({
  name: 'paymentsMethod',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<PaymentModelContent[]>) => {
      return action.payload;
    },
  },
});

export const {setPayments} = paymentMethodSlice.actions;

export default paymentMethodSlice.reducer;
