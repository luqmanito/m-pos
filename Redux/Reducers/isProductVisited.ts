import {createSlice} from '@reduxjs/toolkit';

export interface VisitState {
  cashierVisited: boolean;
  catalogueVisited: boolean;
}

const initialState: VisitState = {
  cashierVisited: false,
  catalogueVisited: false,
};

const isProductVisitedSlice = createSlice({
  name: 'isProductVisitedSlice',
  initialState,
  reducers: {
    setCashierVisited: (state, action) => {
      return {
        ...state,
        cashierVisited: action.payload,
      };
    },

    setCatalogueVisited: (state, action) => {
      return {
        ...state,
        catalogueVisited: action.payload,
      };
    },

    clearStateVisited: () => {
      return {
        cashierVisited: false,
        catalogueVisited: false,
      };
    },
  },
});

export const {setCashierVisited, setCatalogueVisited, clearStateVisited} =
  isProductVisitedSlice.actions;
export default isProductVisitedSlice.reducer;
