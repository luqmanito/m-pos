import {createSlice} from '@reduxjs/toolkit';

export interface ProductState {
  productId: number;
  categoryCode: string;
  categoryName: string;
}

const initialState: ProductState = {
  categoryCode: '',
  categoryName: '',
  productId: 0,
};

const productSlice = createSlice({
  name: 'ProductSlice',
  initialState,
  reducers: {
    setCategoryCode: (state, action) => {
      return {
        ...state,
        categoryCode: action.payload,
      };
    },
    setCategoryName: (state, action) => {
      return {
        ...state,
        categoryName: action.payload,
      };
    },
    setProductId: (state, action) => {
      return {
        ...state,
        productId: action.payload,
      };
    },

    clearStateProduct: () => {
      return {
        categoryCode: '',
        categoryName: '',
        productId: 0,
      };
    },
  },
});

export const {
  setCategoryCode,
  setProductId,
  setCategoryName,
  clearStateProduct,
} = productSlice.actions;
export default productSlice.reducer;
