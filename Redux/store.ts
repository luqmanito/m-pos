import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import reducers from './Reducers/reducers';
import {AuthState} from './Reducers/auth';
import {DataCamera} from './Reducers/upload';
import {ProductState} from './Reducers/product';
import {CartState} from './Reducers/cart';
import {ButtonState} from './Reducers/button';
import {PaymentState} from './Reducers/payment';
import {EmployeesState} from './Reducers/employee';
// import {offline} from '@redux-offline/redux-offline';
// import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
// RootState type to define the global state type
export interface RootState {
  authSlice: AuthState;
  uploadSlice: DataCamera;
  productSlice: ProductState;
  cartSlice: CartState;
  buttonSlice: ButtonState;
  paymentSlice: PaymentState;
  employeeSlice: EmployeesState;
  // Add other slices if you have them
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [''],
};

const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  // enhancers: [offline(offlineConfig) as StoreEnhancer],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({thunk: true, serializableCheck: false}),
});

export const persistedStore = persistStore(store);
export default store;
