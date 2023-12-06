import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  ReportModelPaymentMethods,
  ReportModelTotalTransaction,
} from '../../models/ReportModel';

export interface ReportState {
  reportDataPayment: ReportModelPaymentMethods[] | null;
  reportDataTotal: ReportModelTotalTransaction[] | null;
  pendingTransaction: [];
}

const initialState: ReportState = {
  reportDataPayment: null,
  reportDataTotal: null,
  pendingTransaction: [],
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportDataPayment: (
      state,
      action: PayloadAction<ReportModelPaymentMethods[]>,
    ) => {
      state.reportDataPayment = action.payload;
    },
    setReportDataTotal: (
      state,
      action: PayloadAction<ReportModelTotalTransaction[]>,
    ) => {
      state.reportDataTotal = action.payload;
    },
    setPendingTransaction: (state, action: PayloadAction<[]>) => {
      state.pendingTransaction = action.payload;
    },
    clearReportState(state) {
      state.reportDataPayment = null;
      state.reportDataTotal = null;
      state.pendingTransaction = [];
    },
  },
});

export const {
  setReportDataPayment,
  setReportDataTotal,
  setPendingTransaction,
  clearReportState,
} = reportSlice.actions;

export default reportSlice.reducer;
