import {useEffect} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import cache from './Util/cache';
import notifee from '@notifee/react-native';
import ToastAlert from './Components/Toast/Toast';
import {useToast} from 'native-base';
import {navigate} from './Network/rootNavigator';
const NotificationHandler = () => {
  const toast = useToast();
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const dataUser = await cache.get('DataUser');
      console.log('tes fg', remoteMessage);
      const notification = await notifee.getTriggerNotificationIds();
      if (notification) {
        ToastAlert(toast, 'sukses', 'Ada Pesanan Baru Masuk !');
      }
      if (dataUser?.role?.toLowerCase() === 'cashier') {
        navigate('KitchenScreen');
      }
      if (dataUser?.role?.toLowerCase() === 'kitchen') {
        navigate('KitchenScreen');
      }
      if (dataUser?.role?.toLowerCase() === 'admin') {
        console.log('jalan');
        navigate('Dashboard', {screen: 'Order'});
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // This component doesn't render anything
};

export default NotificationHandler;
