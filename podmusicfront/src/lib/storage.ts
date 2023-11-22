import AsyncStorage from '@react-native-async-storage/async-storage';

export const save = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {}
};

export const get = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch {}
};

export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch {}
};

export enum StorageKeys {
  AuthToken = 'auth_token',
}
