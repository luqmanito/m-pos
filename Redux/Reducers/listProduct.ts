import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ProductListModel} from '../../models/ProductModel';

const initialState: ProductListModel = {
  data: [],
  dataCashier: [],
};

const productListSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductListModel>) => {
      state.data = action.payload.data;
    },
    setProductsCashier: (state, action: PayloadAction<ProductListModel>) => {
      state.dataCashier = action.payload.data;
    },
  },
});

export const {setProducts, setProductsCashier} = productListSlice.actions;

export default productListSlice.reducer;
