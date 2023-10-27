import {combineReducers} from 'redux';
import authSlice from './auth';
import dataCameraSlice from './upload';
import productSlice from './product';
import cartSlice from './cart';
import orderSlice from './orders';
import employeeSlice from './employee';
import buttonSlice from './button';
import paymentSlice from './payment';
import isProductVisited from './isProductVisited';
import paymentMethodSlice from './paymentMethod';
import productListSlice from './listProduct';
import {reducer as network} from 'react-native-offline';

const reducer = combineReducers({
  authSlice,
  uploadSlice: dataCameraSlice,
  productSlice,
  orderSlice,
  cartSlice,
  buttonSlice,
  paymentSlice,
  isProductVisited,
  paymentMethodSlice,
  employeeSlice,
  productListSlice,
  network,
});

export default reducer;
