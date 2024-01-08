import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {extendTheme, NativeBaseProvider} from 'native-base';
import full_logo from './Public/Assets/full-logo.png';
import store from './Redux/store';
import {Dimensions, ImageBackground} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {LoadingProvider, PrimaryColorProvider} from './Context';
import {ReduxNetworkProvider} from 'react-native-offline';
import {StyleSheet} from 'react-native';
import {initFCMHandlers} from './Util/firebaseService';
import {navigationRef, navigate} from './Network/rootNavigator';
import NotificationHandler from './NotificationHandler';
import {AuthProvider} from './Contexts/Auth';
import {Router} from './Navigation/Router';
import i18next from './services/i18next';
import {I18nextProvider} from 'react-i18next';

export const screenWidth = Dimensions.get('window').width;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage.data?.type === 'new_order') {
    setTimeout(() => {
      return navigate('Dashboard', {screen: 'Order'});
    }, 5000);
  } else if (remoteMessage.data?.type === 'kitchen_order') {
    setTimeout(() => {
      return navigate('KitchenScreen');
    }, 5000);
  }
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    initFCMHandlers();
    setIsLoading(false);
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
      primary: {
        50: '#E3F2F9',
        100: '#C5E4F3',
        200: '#A2D4EC',
        300: '#7AC1E4',
        400: '#29B9DC',
        500: '#29B9DC',
        600: '#007AB8',
        700: '#006BA1',
        800: '#005885',
        900: '#003F5E',
      },
      // Redefining only one shade, rest of the color will remain same.
      secondary: {
        400: '#ffe96c',
      },
      warning: '#fadedb',
      danger: '#FF5252',
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: 'light',
    },
  });

  return (
    <I18nextProvider i18n={i18next}>
      <LoadingProvider>
        <PrimaryColorProvider>
          <AuthProvider>
            <Provider store={store}>
              <ReduxNetworkProvider
                pingTimeout={1000}
                pingServerUrl={'https://www.google.com/'}
                shouldPing={false}
                pingInterval={1000}
                pingOnlyIfOffline={true}
                pingInBackground={false}
                httpMethod={'HEAD'}>
                <NavigationContainer ref={navigationRef}>
                  <NativeBaseProvider theme={theme}>
                    <Router />
                    <NotificationHandler />
                  </NativeBaseProvider>
                </NavigationContainer>
              </ReduxNetworkProvider>
            </Provider>
          </AuthProvider>
        </PrimaryColorProvider>
      </LoadingProvider>
    </I18nextProvider>
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
