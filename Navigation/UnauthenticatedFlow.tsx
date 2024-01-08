import LoginScreen from '../Screen/Login/Login';
import ForgotScreen from '../Screen/Forgot/Forgot';
import OtpScreen from '../Screen/OTP/Otp';
import PasswordScreen from '../Screen/Password/Password';
import RegisterScreen from '../Screen/Register/Register';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootStackParamList';
import KitchenScreen from '../Screen/Kitchen/Kitchen';
import TellerScreen from '../Screen/Teller/Teller';
const Stack = createNativeStackNavigator<RootStackParamList>();

const stackScreens = [
  {name: 'LoginScreen', component: LoginScreen},
  {name: 'ForgotScreen', component: ForgotScreen},
  {name: 'OtpScreen', component: OtpScreen},
  {name: 'PasswordScreen', component: PasswordScreen},
  {name: 'RegisterScreen', component: RegisterScreen},
  {name: 'KitchenScreen', component: KitchenScreen},
  {name: 'TellerScreen', component: TellerScreen},
];

const UnauthenticatedFlow = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}>
      {stackScreens.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name as keyof RootStackParamList}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default UnauthenticatedFlow;
