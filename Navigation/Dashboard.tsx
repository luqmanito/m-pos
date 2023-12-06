import React, {useContext} from 'react';
import {PrimaryColorContext} from '../Context';
import HomeScreen from '../Screen/Home/Home';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'native-base';
import CatalogueScreen from '../Screen/Catalogue/Catalogue';
import Feather from 'react-native-vector-icons/Feather';
import {CashierScreen} from '../Screen/Cashier/Cashier';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {OrderScreen} from '../Screen/Order/Order';
import ReportScreen from '../Screen/Report/Report';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

type DashboardProps = {};
const Dashboard: React.FC<DashboardProps> = () => {
  const primaryColor = useContext(PrimaryColorContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primaryColor?.primaryColor,
        tabBarLabelPosition: 'below-icon',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons
              name={'home-outline'}
              size={size}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              color={focused ? color : '#999999'}
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
          tabBarIcon: ({focused, color, size}) => (
            <Feather
              name={'box'}
              size={size}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              color={focused ? color : '#999999'}
              textAlign={'center'}
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
          tabBarIcon: ({focused, color, size}) => (
            <AntDesign
              name={'isv'}
              size={size}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              color={focused ? color : '#999999'}
              textAlign={'center'}
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
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons
              name={'shopping-outline'}
              size={size}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text
              color={focused ? color : '#999999'}
              textAlign={'center'}
              fontSize={'xs'}>
              Pesanan
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={ReportScreen}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <AntDesign
              name="swap"
              size={size}
              color={focused ? color : '#999999'}
            />
          ),
          tabBarLabel: ({focused, color}) => (
            <Text fontSize={'xs'} color={focused ? color : '#999999'}>
              Laporan
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default Dashboard;
