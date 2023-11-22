import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {
  getAuthState,
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from 'src/store/auth';
import {StorageKeys, get} from 'src/lib/storage';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

import client from 'src/api/client';
import {View, StyleSheet} from 'react-native';
import Loader from '@ui/Loader';
import colors from 'src/constants/colors';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.CONTRAST,
  },
};

const Navigator = () => {
  const {loggedIn, busy} = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthInfo = async () => {
      updateBusyState(true);
      try {
        const token = await get(StorageKeys.AuthToken);
        if (!token) {
          return updateBusyState(false);
        }

        const {data} = await client.get('/auth/is-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedInState(true));
      } catch (error) {
        console.log('auth error', error);
      }
      updateBusyState(false);
    };
    fetchAuthInfo();
  }, []);

  return (
    <NavigationContainer theme={AppTheme}>
      {busy ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.OVERLAY,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <Loader />
        </View>
      ) : null}
      {loggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default Navigator;
