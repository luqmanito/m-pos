import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ButtonState {
  note: boolean;
  table_number: string | undefined;
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
  payment_methodId: 1,
  payment_method: null,
};

const createSetter =
  <K extends keyof ButtonState>(key: K) =>
  (state: ButtonState, action: PayloadAction<ButtonState[K]>) => {
    return {
      ...state,
      [key]: action.payload,
    };
  };

const buttonSlice = createSlice({
  name: 'ButtonSlice',
  initialState,
  reducers: {
    setNote: createSetter('note'),
    setActiveId: createSetter('activeId'),
    setSelectedId: createSetter('selectedId'),
    setTableNumber: createSetter('table_number'),
    setBluetoohStatus: createSetter('bluetoothStatus'),
    setBluetoohName: createSetter('bluetoothName'),
    setCustomerName: createSetter('customerName'),
    setCustomerPhone: createSetter('customerPhone'),
    setCustomerEmail: createSetter('customerEmail'),
    setPaymentMethodId: createSetter('payment_methodId'),
    setPaymentMethod: createSetter('payment_method'),

    clearStateButton: () => initialState,
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
