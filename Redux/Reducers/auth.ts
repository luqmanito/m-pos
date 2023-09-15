import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  // Define your state properties here
  code: string;
  email: string;
  // Other properties if you have them
}

const initialState: AuthState = {
  code: '',
  email: '',
  // Other initial state properties if you have them
};

const authSlice = createSlice({
  name: 'AuthSlice',
  initialState,
  reducers: {
    setCode: (state, action) => {
      return {
        ...state,
        code: action.payload,
      };
    },
    setEmailUser: (state, action) => {
      return {
        ...state,
        email: action.payload,
      };
    },

    clearStateAuth: () => {
      return {
        code: '',
        email: '',
      };
    },
  },
});

export const {setCode, setEmailUser, clearStateAuth} = authSlice.actions;
export default authSlice.reducer;
