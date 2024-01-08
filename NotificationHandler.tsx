import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import cache from './Util/cache';
import notifee from '@notifee/react-native';
import {navigate} from './Network/rootNavigator';
import useAlert from './Hooks/useAlert';
const NotificationHandler = () => {
  const alert = useAlert();
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async () => {
      const dataUser = await cache.get('DataUser');
      const notification = await notifee.getTriggerNotificationIds();
      if (notification) {
        alert.showAlert('success', 'Ada Pesanan Baru Masuk !');
      }
      if (dataUser?.role?.toLowerCase() === 'cashier') {
        navigate('KitchenScreen');
      }
      if (dataUser?.role?.toLowerCase() === 'kitchen') {
        navigate('KitchenScreen');
      }
      if (dataUser?.role?.toLowerCase() === 'admin') {
        navigate('Dashboard', {screen: 'Order'});
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default NotificationHandler;
