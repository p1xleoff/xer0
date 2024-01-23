import * as Notifications from 'expo-notifications';

const sendPushNotification = async (expoPushToken, title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { data: 'goes here' },
      },
      to: expoPushToken,
      trigger: null, // Trigger immediately
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

export { sendPushNotification };
