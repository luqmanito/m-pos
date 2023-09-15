import {createSlice} from '@reduxjs/toolkit';

export interface ButtonState {
  note: boolean;
  table_number: string;
  activeId?: number;
  bluetoothStatus: string;
  bluetoothName: string;
  payment_methodId: number | null;
  payment_method: string | null;
}

const initialState: ButtonState = {
  note: false,
  table_number: '',
  bluetoothStatus: '',
  bluetoothName: '',
  activeId: 0,
  payment_methodId: null,
  payment_method: null,
};

const buttonSlice = createSlice({
  name: 'ButtonSlice',
  initialState,
  reducers: {
    setNote: (state, action) => {
      return {
        ...state,
        note: action.payload,
      };
    },
    setActiveId: (state, action) => {
      return {
        ...state,
        activeId: action.payload,
      };
    },
    setTableNumber: (state, action) => {
      return {
        ...state,
        table_number: action.payload,
      };
    },
    setBluetoohStatus: (state, action) => {
      return {
        ...state,
        bluetoothStatus: action.payload,
      };
    },
    setBluetoohName: (state, action) => {
      return {
        ...state,
        bluetoothName: action.payload,
      };
    },
    setPaymentMethodId: (state, action) => {
      return {
        ...state,
        payment_methodId: action.payload,
      };
    },
    setPaymentMethod: (state, action) => {
      return {
        ...state,
        payment_method: action.payload,
      };
    },

    clearStateButton: () => {
      return {
        note: false,
        activeId: 0,
        table_number: '',
        bluetoothName: '',
        bluetoothStatus: '',
        payment_methodId: null,
        payment_method: null,
      };
    },
  },
});

export const {
  setNote,
  setActiveId,
  setBluetoohStatus,
  setTableNumber,
  clearStateButton,
  setPaymentMethodId,
  setPaymentMethod,
  setBluetoohName,
} = buttonSlice.actions;
export default buttonSlice.reducer;
