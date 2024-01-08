import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const prefix = 'cache';
const expiryInMinutes = 5;

const store = async (key: string, value: any) => {
  const item = {
    value,
    timeStamp: moment().valueOf(),
  };

  try {
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
  } catch (err) {
    console.log(err);
  }
};

const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(prefix + key);
  } catch (err) {
    console.log(err);
  }
};

const isExpired = (item: {timeStamp: moment.MomentInput}) => {
  const now = moment(moment().valueOf());
  const storedTime = moment(item.timeStamp);
  return now.diff(storedTime, 'minutes') > expiryInMinutes;
};

const get = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    if (value) {
      const item = JSON.parse(value);
      if (isExpired(item)) {
        await AsyncStorage.removeItem(prefix + key);
        return null;
      }
      return item.value;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

export default {store, get, removeItem};
