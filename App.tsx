import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider, Text} from 'native-base';
import LoginScreen from './Screen/Login/Login';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from './Screen/Home/Home';
import {LogoutScreen} from './Screen/Logout/Logout';
import {ForgotScreen} from './Screen/Forgot/Forgot';
import {OtpScreen} from './Screen/OTP/Otp';
import {PasswordScreen} from './Screen/Password/Password';
import {RegisterScreen} from './Screen/Register/Register';
import store from './Redux/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {CatalogueScreen} from './Screen/Catalogue/Catalogue';
import {CashierScreen} from './Screen/Cashier/Cashier';
import {OrderScreen} from './Screen/Order/Order';
import {TransactionScreen} from './Screen/Transaction/Transaction';
import {HeaderComponent} from './Components/Header/Header';
import {AddProductScreen} from './Screen/Product/AddProduct';
import CategoryScreen from './Screen/Categories/Category';
import ProductList from './Screen/Product/ProductList';
import {ProductDetail} from './Screen/Product/ProductDetail';
import {CheckoutScreen} from './Screen/Cashier/Checkout';
import {PaymentScreen} from './Screen/Payment/Payment';
import {SuccessfulPaymentScreen} from './Screen/Payment/SuccessfulPayment';
import {OrderDetailScreen} from './Screen/Order/OrderDetail';
import AddCategoryScreen from './Screen/Categories/AddCategories';
import {Dimensions} from 'react-native';
import SettingScreen from './Screen/Settings/Settings';
import PrinterSetting from './Screen/Printer/PrintSettings';
import PrinterConfiguration from './Screen/Printer/PrinterConfig';
import ReportScreen from './Screen/Report/Report';
import NotificationScreen from './Screen/Notification/Notification';
import {LoadingProvider} from './Context';
// import {NetworkProvider} from 'react-native-offline';
import {ReduxNetworkProvider} from 'react-native-offline';
import PaymentMethodScreen from './Screen/PaymentMethod/PaymentMethod';
import PaymentSettings from './Screen/PaymentMethodSettings/PaymentSettings';
import SyncDataScreen from './Screen/Sync/Sync';
import EmployeeSettings from './Screen/Employee/EmployeeSetting';
import EmployeeDetail from './Screen/Employee/EmployeeDetail';
import AddEmployee from './Screen/Employee/AddEmployee';
import NewEmployee from './Screen/Employee/NewEmployee';
import AdminDetail from './Screen/Employee/AdminDetail';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const screenWidth = Dimensions.get('window').width;
type DashboardProps = {};

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0c50ef',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <MaterialCommunityIcons
              name={'home-outline'}
              size={screenWidth > 600 ? 27 : 30}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              color={focused ? color : '#999999'}
              marginLeft={screenWidth > 600 ? 5 : null}
              textAlign={'center'}
              fontSize={'xs'}>
              Home
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Catalogue"
        component={CatalogueScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Feather
              name={'box'}
              size={screenWidth > 600 ? 27 : 30}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              color={focused ? color : '#999999'}
              textAlign={'center'}
              marginLeft={screenWidth > 600 ? 5 : null}
              fontSize={'xs'}>
              Katalog
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Cashier"
        component={CashierScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <AntDesign
              name={'isv'}
              size={screenWidth > 600 ? 27 : 30}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              color={focused ? color : '#999999'}
              textAlign={'center'}
              marginLeft={screenWidth > 600 ? 5 : null}
              fontSize={'xs'}>
              Kasir
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <MaterialCommunityIcons
              name={'shopping-outline'}
              size={screenWidth > 600 ? 27 : 30}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              color={focused ? color : '#999999'}
              textAlign={'center'}
              marginLeft={screenWidth > 600 ? 5 : null}
              fontSize={'xs'}>
              Pesanan
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={TransactionScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <AntDesign
              name="swap"
              size={screenWidth > 600 ? 27 : 30}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              marginLeft={screenWidth > 600 ? 5 : null}
              fontSize={'xs'}
              color={focused ? color : '#999999'}>
              Transaksi
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const UnauthenticatedFlow = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="PasswordScreen" component={PasswordScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
      <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
      <Stack.Screen name="SyncDataScreen" component={SyncDataScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="HeaderComponent" component={HeaderComponent} />
      <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
      <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} />
      <Stack.Screen name="PaymentSettings" component={PaymentSettings} />
      <Stack.Screen name="EmployeeSettings" component={EmployeeSettings} />
      <Stack.Screen name="EmployeeDetail" component={EmployeeDetail} />
      <Stack.Screen name="AddEmployee" component={AddEmployee} />
      <Stack.Screen name="NewEmployee" component={NewEmployee} />
      <Stack.Screen name="AdminDetail" component={AdminDetail} />
      <Stack.Screen name="ReportScreen" component={ReportScreen} />
      <Stack.Screen
        name="PaymentMethodScreen"
        component={PaymentMethodScreen}
      />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen
        name="PrinterConfiguration"
        component={PrinterConfiguration}
      />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />

      <Stack.Screen name="PrinterSetting" component={PrinterSetting} />
      <Stack.Screen
        name="SuccessfulPaymentScreen"
        component={SuccessfulPaymentScreen}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserToken = async () => {
      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
      try {
        const token = await AsyncStorage.getItem('authToken');
        await sleep(2000);
        if (token) {
          setUserToken(token);
          setIsSignedIn(true);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    getUserToken();
  }, [userToken]);

  if (isLoading) {
    return (
      <NativeBaseProvider>
        <Text>Loading...</Text>
      </NativeBaseProvider>
    );
  }

  // const theme = extendTheme({
  //   colors: {
  //     // Add new color
  //     primary: {
  //       50: '#E3F2F9',
  //       100: '#C5E4F3',
  //       200: '#A2D4EC',
  //       300: '#7AC1E4',
  //       400: '#47A9DA',
  //       500: '#0088CC',
  //       600: '#007AB8',
  //       700: '#006BA1',
  //       800: '#005885',
  //       900: '#0c50ef',
  //     },
  //     // Redefining only one shade, rest of the color will remain same.
  //     amber: {
  //       400: '#d97706',
  //     },
  //   },
  //   config: {
  //     // Changing initialColorMode to 'dark'
  //     initialColorMode: 'dark',
  //   },
  // });

  return (
    <LoadingProvider>
      <Provider store={store}>
        <ReduxNetworkProvider
          pingTimeout={10000}
          pingServerUrl={'https://www.google.com/'}
          shouldPing={true}
          pingInterval={0}
          pingOnlyIfOffline={false}
          pingInBackground={false}
          httpMethod={'HEAD'}>
          <NavigationContainer>
            <NativeBaseProvider>
              {isSignedIn ? (
                <>
                  <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen
                      name="SyncDataScreen"
                      component={SyncDataScreen}
                    />
                    <Stack.Screen name="AdminDetail" component={AdminDetail} />
                    <Stack.Screen name="AddEmployee" component={AddEmployee} />
                    <Stack.Screen name="NewEmployee" component={NewEmployee} />
                    <Stack.Screen
                      name="EmployeeDetail"
                      component={EmployeeDetail}
                    />
                    <Stack.Screen
                      name="EmployeeSettings"
                      component={EmployeeSettings}
                    />
                    <Stack.Screen
                      name="ForgotScreen"
                      component={ForgotScreen}
                    />
                    <Stack.Screen
                      name="PaymentMethodScreen"
                      component={PaymentMethodScreen}
                    />
                    <Stack.Screen name="OtpScreen" component={OtpScreen} />
                    <Stack.Screen
                      name="NotificationScreen"
                      component={NotificationScreen}
                    />
                    <Stack.Screen
                      name="PaymentSettings"
                      component={PaymentSettings}
                    />
                    <Stack.Screen
                      name="LogoutScreen"
                      component={LogoutScreen}
                    />
                    <Stack.Screen
                      name="ProductDetail"
                      component={ProductDetail}
                    />
                    <Stack.Screen
                      name="ReportScreen"
                      component={ReportScreen}
                    />
                    <Stack.Screen name="ProductList" component={ProductList} />
                    <Stack.Screen
                      name="SettingScreen"
                      component={SettingScreen}
                    />
                    <Stack.Screen
                      name="PrinterConfiguration"
                      component={PrinterConfiguration}
                    />
                    <Stack.Screen
                      name="PrinterSetting"
                      component={PrinterSetting}
                    />
                    <Stack.Screen
                      name="AddCategoryScreen"
                      component={AddCategoryScreen}
                    />
                    <Stack.Screen
                      name="PaymentScreen"
                      component={PaymentScreen}
                    />
                    <Stack.Screen
                      name="OrderDetailScreen"
                      component={OrderDetailScreen}
                    />
                    <Stack.Screen
                      name="SuccessfulPaymentScreen"
                      component={SuccessfulPaymentScreen}
                    />
                    <Stack.Screen
                      name="CheckoutScreen"
                      component={CheckoutScreen}
                    />
                    <Stack.Screen
                      name="CategoryScreen"
                      component={CategoryScreen}
                    />
                    <Stack.Screen
                      name="AddProductScreen"
                      component={AddProductScreen}
                    />
                    <Stack.Screen
                      name="HeaderComponent"
                      component={HeaderComponent}
                    />
                    <Stack.Screen
                      name="PasswordScreen"
                      component={PasswordScreen}
                    />
                    <Stack.Screen
                      name="RegisterScreen"
                      component={RegisterScreen}
                    />
                  </Stack.Navigator>
                </>
              ) : (
                <UnauthenticatedFlow />
              )}
            </NativeBaseProvider>
          </NavigationContainer>
        </ReduxNetworkProvider>
      </Provider>
    </LoadingProvider>
  );
};

export default App;
