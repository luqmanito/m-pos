/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {extendTheme, NativeBaseProvider, Text} from 'native-base';
import LoginScreen from './Screen/Login/Login';
import full_logo from './Public/Assets/full-logo.png';
import userNetwork from '../mobile-pos/Network/lib/user';
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
import {Dimensions, ImageBackground} from 'react-native';
import SettingScreen from './Screen/Settings/Settings';
import PrinterSetting from './Screen/Printer/PrintSettings';
import PrinterConfiguration from './Screen/Printer/PrinterConfig';
import ReportScreen from './Screen/Report/Report';
import NotificationScreen from './Screen/Notification/Notification';
import {
  LoadingProvider,
  PrimaryColorContext,
  PrimaryColorProvider,
} from './Context';
import {ReduxNetworkProvider} from 'react-native-offline';
import PaymentMethodScreen from './Screen/PaymentMethod/PaymentMethod';
import PaymentSettings from './Screen/PaymentMethodSettings/PaymentSettings';
import SyncDataScreen from './Screen/Sync/Sync';
import EmployeeSettings from './Screen/Employee/EmployeeSetting';
import EmployeeDetail from './Screen/Employee/EmployeeDetail';
import AddEmployee from './Screen/Employee/AddEmployee';
import NewEmployee from './Screen/Employee/NewEmployee';
import AdminDetail from './Screen/Employee/AdminDetail';
import {KitchenScreen} from './Screen/Kitchen/Kitchen';
import {EditOrderScreen} from './Screen/Order/EditOrder';
import {StyleSheet} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const screenWidth = Dimensions.get('window').width;
type DashboardProps = {};

const Dashboard: React.FC<DashboardProps> = () => {
  const primaryColor = useContext(PrimaryColorContext);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primaryColor?.primaryColor,
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
      <Stack.Screen name="EditOrderScreen" component={EditOrderScreen} />
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
      <Stack.Screen name="KitchenScreen" component={KitchenScreen} />

      <Stack.Screen name="PrinterSetting" component={PrinterSetting} />
      <Stack.Screen
        name="SuccessfulPaymentScreen"
        component={SuccessfulPaymentScreen}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  // const {userData} = useUserInfo();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const primaryColor = useContext(PrimaryColorContext);
  // const {primaryColor} = usePrimaryColor();
  useEffect(() => {
    const getUserToken = async () => {
      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
      await sleep(2000);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          try {
            const userData = await userNetwork.userProfile();
            setRole(userData.data.role);
            setIsSignedIn(true);
          } catch (error) {
            console.log(error);
          }
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
  }, []);

  if (isLoading) {
    return (
      <NativeBaseProvider>
        <ImageBackground
          source={full_logo}
          style={styles.background}
          resizeMode="contain"
        />
      </NativeBaseProvider>
    );
  }

  const theme = extendTheme({
    colors: {
      // Add new color
      primary: primaryColor?.primaryColor,

      // Redefining only one shade, rest of the color will remain same.
      secondary: {
        400: '#d97706',
      },
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: 'light',
    },
  });

  return (
    <LoadingProvider>
      <PrimaryColorProvider>
        <Provider store={store}>
          <ReduxNetworkProvider
            pingTimeout={10000}
            pingServerUrl={'https://www.google.com/'}
            shouldPing={true}
            pingInterval={0}
            pingOnlyIfOffPrimaryColorProviderline={false}
            pingInBackground={false}
            httpMethod={'HEAD'}>
            <NavigationContainer>
              <NativeBaseProvider theme={theme}>
                {isSignedIn && role !== 'KITCHEN' && role !== 'CASHIER' ? (
                  <>
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                      <Stack.Screen name="Dashboard" component={Dashboard} />
                      <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                      />
                      <Stack.Screen
                        name="SyncDataScreen"
                        component={SyncDataScreen}
                      />
                      <Stack.Screen
                        name="AdminDetail"
                        component={AdminDetail}
                      />
                      <Stack.Screen
                        name="AddEmployee"
                        component={AddEmployee}
                      />
                      <Stack.Screen
                        name="NewEmployee"
                        component={NewEmployee}
                      />
                      <Stack.Screen
                        name="KitchenScreen"
                        component={KitchenScreen}
                      />
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
                      <Stack.Screen
                        name="ProductList"
                        component={ProductList}
                      />
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
                        name="EditOrderScreen"
                        component={EditOrderScreen}
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
                ) : isSignedIn && (role === 'KITCHEN' || role === 'CASHIER') ? (
                  <>
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                      <Stack.Screen
                        name="KitchenScreen"
                        component={KitchenScreen}
                      />
                      <Stack.Screen name="Dashboard" component={Dashboard} />
                      <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                      />
                      <Stack.Screen
                        name="SyncDataScreen"
                        component={SyncDataScreen}
                      />
                      <Stack.Screen
                        name="AdminDetail"
                        component={AdminDetail}
                      />
                      <Stack.Screen
                        name="AddEmployee"
                        component={AddEmployee}
                      />
                      <Stack.Screen
                        name="NewEmployee"
                        component={NewEmployee}
                      />
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
                      <Stack.Screen
                        name="ProductList"
                        component={ProductList}
                      />
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
      </PrimaryColorProvider>
    </LoadingProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#29B9DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
