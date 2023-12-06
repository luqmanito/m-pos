import React from 'react';
import {NavigationContainerRef} from '@react-navigation/native';

type RootParamList = {
  LoginScreen: 'LoginScreen';
  Dashboard: 'Dashboard';
  KitchenScreen: 'KitchenScreen';
};

export const navigationRef =
  React.createRef<NavigationContainerRef<RootParamList>>();

export const navigate = (name: keyof RootParamList, params?: any) => {
  if (navigationRef.current) {
    navigationRef.current.navigate({
      name: name,
      params: params,
    });
  }
};
