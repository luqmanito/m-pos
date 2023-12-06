import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginModel} from '../models/LoginModel';
import AuthNetwork from '../Network/lib/auth';
import messaging from '@react-native-firebase/messaging';
import firebaseNetwork from '../Network/lib/firebase';

type AuthContextData = {
  authData?: LoginModel;
  signIn(email: string, password: string): Promise<LoginModel | undefined>;
  signOut(): void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
interface AuthProviderProps {
  children: ReactNode;
}
const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [authData, setAuthData] = useState<LoginModel>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        const _authData: LoginModel = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
    } finally {
      //loading finished
      setLoading(false);
    }
  }

  const signIn = async (
    email: string,
    password: string,
  ): Promise<LoginModel | undefined> => {
    setLoading(true);
    try {
      const responseLogin = await AuthNetwork.login({email, password});
      if (responseLogin.data) {
        setAuthData(responseLogin.data);
        await AsyncStorage.setItem(
          '@AuthData',
          JSON.stringify(responseLogin.data),
        );
        await AsyncStorage.setItem('authToken', responseLogin.data.token);
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        await firebaseNetwork.sendDeviceToken(token);
        setLoading(false);
        return responseLogin.data;
      }
      return undefined;
    } catch (e) {
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setAuthData(undefined);
    await AsyncStorage.removeItem('@AuthData');
    await AsyncStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{authData, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {AuthContext, AuthProvider, useAuth};
