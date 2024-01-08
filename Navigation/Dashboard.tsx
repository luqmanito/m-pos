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
import {useTranslation} from 'react-i18next';
const Tab = createBottomTabNavigator();

type DashboardProps = {};
const Dashboard: React.FC<DashboardProps> = () => {
  const primaryColor = useContext(PrimaryColorContext);
  const {t} = useTranslation();

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
              {t('home')}
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
              {t('catalogue')}
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
              {t('cashier')}
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
              {t('order')}
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
              {t('report')}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default Dashboard;
