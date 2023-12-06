import LoginScreen from '../Screen/Login/Login';
import {ForgotScreen} from '../Screen/Forgot/Forgot';
import {OtpScreen} from '../Screen/OTP/Otp';
import {PasswordScreen} from '../Screen/Password/Password';
import {RegisterScreen} from '../Screen/Register/Register';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const stackScreens = [
  {name: 'LoginScreen', component: LoginScreen},
  {name: 'ForgotScreen', component: ForgotScreen},
  {name: 'OtpScreen', component: OtpScreen},
  {name: 'PasswordScreen', component: PasswordScreen},
  {name: 'RegisterScreen', component: RegisterScreen},
];

const UnauthenticatedFlow = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}>
      {stackScreens.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default UnauthenticatedFlow;
