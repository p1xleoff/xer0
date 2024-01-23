// src/services/pushNotificationService.js
import axios from 'axios';

const sendPushNotification = async (expoPushToken, title, body) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: { someData: 'goes here' },
  };

  try {
    await axios.post('https://expo.io/--/api/v2/push/send', message);
    console.log('Push notification sent successfully!');
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

export { sendPushNotification };
