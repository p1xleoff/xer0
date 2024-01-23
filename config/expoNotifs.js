// src/config/expoNotifications.js
import * as Notifications from 'expo-notifications';

const registerForPushNotificationsAsync = async () => {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.error('Failed to get push token for push notification!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);

  // Save this token to your database for the user
};

export { registerForPushNotificationsAsync };
