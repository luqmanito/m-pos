import {createSlice} from '@reduxjs/toolkit';

export interface ProductState {
  imageID: number;
  categoryCode: string;
  categoryName: string;
}

const initialState: ProductState = {
  categoryCode: '',
  categoryName: '',
  imageID: 0,
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
    setDetailImageId: (state, action) => {
      return {
        ...state,
        imageID: action.payload,
      };
    },

    clearStateProduct: () => {
      return {
        categoryCode: '',
        categoryName: '',
        imageID: 0,
      };
    },
  },
});

export const {
  setCategoryCode,
  setDetailImageId,
  setCategoryName,
  clearStateProduct,
} = productSlice.actions;
export default productSlice.reducer;
