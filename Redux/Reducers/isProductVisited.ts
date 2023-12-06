import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface VisitState {
  cashierVisited: boolean;
  catalogueVisited: boolean;
}

const initialState: VisitState = {
  cashierVisited: false,
  catalogueVisited: false,
};

const createSetter =
  <K extends keyof VisitState>(key: K) =>
  (state: VisitState, action: PayloadAction<VisitState[K]>) => {
    return {
      ...state,
      [key]: action.payload,
    };
  };

const isProductVisitedSlice = createSlice({
  name: 'isProductVisitedSlice',
  initialState,
  reducers: {
    setCashierVisited: createSetter('cashierVisited'),
    setCatalogueVisited: createSetter('catalogueVisited'),

    clearStateVisited: () => initialState,
  },
});

export const {setCashierVisited, setCatalogueVisited, clearStateVisited} =
  isProductVisitedSlice.actions;
export default isProductVisitedSlice.reducer;
