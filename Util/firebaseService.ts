import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

async function onMessageReceived(
  message: FirebaseMessagingTypes.RemoteMessage,
) {
  console.log(message, 'dari firebase');

  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'default',
    lights: true,
    vibration: true,
  });

  await notifee.displayNotification({
    title: message?.notification?.title,
    body: message?.notification?.body,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
  });
}

export function initFCMHandlers() {
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);
}
