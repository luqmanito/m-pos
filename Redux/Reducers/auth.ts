import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface AuthState {
  code: string;
  email: string;
}

const initialState: AuthState = {
  code: '',
  email: '',
};

const createSetter =
  <K extends keyof AuthState>(key: K) =>
  (state: AuthState, action: PayloadAction<AuthState[K]>) => {
    return {
      ...state,
      [key]: action.payload,
    };
  };

const authSlice = createSlice({
  name: 'ButtonSlice',
  initialState,
  reducers: {
    setCode: createSetter('code'),
    setEmailUser: createSetter('email'),

    clearStateAuth: () => initialState,
  },
});

export const {setCode, setEmailUser, clearStateAuth} = authSlice.actions;
export default authSlice.reducer;
