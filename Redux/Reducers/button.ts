import {createSlice} from '@reduxjs/toolkit';

export interface ButtonState {
  note: boolean;
  table_number: string;
  activeId?: number;
  selectedId?: number;
  bluetoothStatus: string;
  bluetoothName: string;
  payment_methodId: number | null;
  payment_method: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
}

const initialState: ButtonState = {
  note: false,
  table_number: '',
  bluetoothStatus: '',
  bluetoothName: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  activeId: 0,
  selectedId: 0,
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
    setSelectedId: (state, action) => {
      return {
        ...state,
        selectedId: action.payload,
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
    setCustomerName: (state, action) => {
      return {
        ...state,
        customerName: action.payload,
      };
    },
    setCustomerPhone: (state, action) => {
      return {
        ...state,
        customerPhone: action.payload,
      };
    },
    setCustomerEmail: (state, action) => {
      return {
        ...state,
        customerEmail: action.payload,
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
        selectedId: 0,
        table_number: '',
        bluetoothName: '',
        bluetoothStatus: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
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
  setSelectedId,
  clearStateButton,
  setCustomerEmail,
  setCustomerName,
  setCustomerPhone,
  setPaymentMethodId,
  setPaymentMethod,
  setBluetoohName,
} = buttonSlice.actions;
export default buttonSlice.reducer;
