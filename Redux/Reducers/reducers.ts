import {combineReducers} from 'redux';
import authSlice from './auth';
import dataCameraSlice from './upload';
import productSlice from './product';
import cartSlice from './cart';
import employeeSlice from './employee';
import buttonSlice from './button';
import paymentSlice from './payment';
import {reducer as network} from 'react-native-offline';

const reducer = combineReducers({
  authSlice: authSlice,
  uploadSlice: dataCameraSlice,
  productSlice: productSlice,
  cartSlice: cartSlice,
  buttonSlice: buttonSlice,
  paymentSlice: paymentSlice,
  employeeSlice: employeeSlice,
  network,
});

export default reducer;
