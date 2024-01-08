export type RootStackParamList = {
  LoginScreen: undefined;
  ForgotScreen: undefined;
  KitchenScreen: undefined;
  TellerScreen: undefined;
  OtpScreen: {email: string};
  PasswordScreen: {email: string; otp: string};
  RegisterScreen: undefined;
  ProductDetailsScreen: {id?: number};
  EmployeeDetailsScreen: {id?: number};
};
