import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface DataCamera {
  uri?: string;
  fileName?: string;
  fileSize?: number;
  type?: string;
  dataCamera?: any;
  base64?: string;
}

interface DataCameraState {
  dataCamera: DataCamera | undefined;
}

const initialState: DataCameraState = {
  dataCamera: undefined,
};

const dataCameraSlice = createSlice({
  name: 'dataCamera',
  initialState,
  reducers: {
    setDataCamera: (state, action: PayloadAction<DataCamera | undefined>) => {
      state.dataCamera = action.payload;
    },
    clearDataCamera: state => {
      state.dataCamera = undefined;
    },
  },
});

export const {setDataCamera, clearDataCamera} = dataCameraSlice.actions;

export default dataCameraSlice.reducer;
