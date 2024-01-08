import Dashboard from './Dashboard';
import NewEmployee from '../Screen/Employee/NewEmployee';
import EmployeeDetail from '../Screen/Employee/EmployeeDetail';
import EmployeeSettings from '../Screen/Employee/EmployeeSetting';
import PaymentMethodScreen from '../Screen/PaymentMethod/PaymentMethod';
import PaymentSettings from '../Screen/PaymentMethodSettings/PaymentSettings';
import ProductDetail from '../Screen/Product/ProductDetail';
import ReportScreen from '../Screen/Report/Report';
import ProductList from '../Screen/Product/ProductList';
import SettingScreen from '../Screen/Settings/Settings';
import PrinterConfiguration from '../Screen/Printer/PrinterConfig';
import PrinterSetting from '../Screen/Printer/PrintSettings';
import AddCategoryScreen from '../Screen/Categories/AddCategories';
import PaymentScreen from '../Screen/Payment/Payment';
import SuccessfulPaymentScreen from '../Screen/Payment/SuccessfulPayment';
import CheckoutScreen from '../Screen/Cashier/Checkout';
import CategoryScreen from '../Screen/Categories/Category';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Role from '../Consts/Role';
import KitchenScreen from '../Screen/Kitchen/Kitchen';
import TellerScreen from '../Screen/Teller/Teller';
import {LogoutScreen} from '../Screen/Logout/Logout';
import LoginScreen from '../Screen/Login/Login';
import {RootStackParamList} from './RootStackParamList';
import {CashierScreen} from '../Screen/Cashier/Cashier';
import SyncDataScreen from '../Screen/Sync/Sync';

const stackScreens = [
  {
    name: 'Dashboard',
    component: Dashboard,
    roles: [Role.ADMIN, Role.USER],
  },
  {name: 'NewEmployee', component: NewEmployee, roles: [Role.ADMIN]},
  {name: 'EmployeeDetail', component: EmployeeDetail, roles: [Role.ADMIN]},
  {name: 'EmployeeSettings', component: EmployeeSettings, roles: [Role.ADMIN]},
  {
    name: 'PaymentMethodScreen',
    component: PaymentMethodScreen,
    roles: [Role.ADMIN, Role.CASHIER],
  },
  {name: 'PaymentSettings', component: PaymentSettings, roles: [Role.ADMIN]},
  {name: 'ProductDetail', component: ProductDetail, roles: [Role.ADMIN]},
  {name: 'ReportScreen', component: ReportScreen, roles: [Role.ADMIN]},
  {name: 'ProductList', component: ProductList, roles: [Role.ADMIN]},
  {name: 'SettingScreen', component: SettingScreen, roles: [Role.ADMIN]},
  {name: 'SyncDataScreen', component: SyncDataScreen, roles: [Role.ADMIN]},
  {
    name: 'PrinterConfiguration',
    component: PrinterConfiguration,
    roles: [Role.ADMIN],
  },
  {name: 'PrinterSetting', component: PrinterSetting, roles: [Role.ADMIN]},
  {
    name: 'AddCategoryScreen',
    component: AddCategoryScreen,
    roles: [Role.ADMIN],
  },
  {
    name: 'PaymentScreen',
    component: PaymentScreen,
    roles: [Role.ADMIN, Role.CASHIER],
  },
  {
    name: 'SuccessfulPaymentScreen',
    component: SuccessfulPaymentScreen,
    roles: [Role.ADMIN, Role.USER, Role.CASHIER],
  },
  {
    name: 'CheckoutScreen',
    component: CheckoutScreen,
    roles: [Role.ADMIN, Role.USER, Role.CASHIER],
  },
  {
    name: 'EditOrderScreen',
    component: CashierScreen,
    roles: [Role.ADMIN, Role.USER, Role.CASHIER],
  },
  {name: 'CategoryScreen', component: CategoryScreen, roles: [Role.ADMIN]},
  {name: 'KitchenScreen', component: KitchenScreen, roles: [Role.KITCHEN]},
  {name: 'TellerScreen', component: TellerScreen, roles: [Role.CASHIER]},
  {
    name: 'LogoutScreen',
    component: LogoutScreen,
    roles: [Role.KITCHEN, Role.ADMIN, Role.CASHIER, Role.USER],
  },
  {
    name: 'LoginScreen',
    component: LoginScreen,
    roles: [Role.KITCHEN, Role.ADMIN, Role.CASHIER, Role.USER],
  },
];

const Stack = createNativeStackNavigator<RootStackParamList>();
type AuthNavigationProps = {
  roles: string;
};
const AuthNavigation: React.FC<AuthNavigationProps> = ({roles}) => {
  return (
    <Stack.Navigator
      initialRouteName={
        (roles === Role.KITCHEN
          ? 'KitchenScreen'
          : roles === Role.CASHIER
          ? 'TellerScreen'
          : 'Dashboard') as keyof RootStackParamList
      }
      screenOptions={{headerShown: false}}>
      {stackScreens
        .filter(d => {
          return d.roles.includes(roles);
        })
        .map((screen, index) => (
          <Stack.Screen
            key={`admin-screen-${index}`}
            name={screen.name as keyof RootStackParamList}
            component={screen.component}
          />
        ))}
    </Stack.Navigator>
  );
};

export default AuthNavigation;
