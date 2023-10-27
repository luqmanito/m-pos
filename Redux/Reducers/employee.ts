// employeesSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Employee {
  name: string | null;
  mobile_number: string | null;
  email: string | null;
  role: string | null;
}

export interface EmployeesState {
  dataEmployee: Employee;
}

const initialState: EmployeesState = {
  dataEmployee: {
    name: null,
    mobile_number: null,
    email: null,
    role: null,
  },
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setNewEmployeeData: (state, action: PayloadAction<Employee>) => {
      state.dataEmployee = action.payload;
    },
  },
});

export const {setNewEmployeeData} = employeesSlice.actions;

export default employeesSlice.reducer;
