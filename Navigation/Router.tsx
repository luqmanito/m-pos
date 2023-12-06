import {useAuth} from '../Contexts/Auth';
import AuthNavigation from './AuthNavigation';
import React from 'react';
import UnauthenticatedFlow from './UnauthenticatedFlow';

export const Router = () => {
  const {authData} = useAuth();

  return authData ? (
    <AuthNavigation roles={authData.user.role} />
  ) : (
    <UnauthenticatedFlow />
  );
};
