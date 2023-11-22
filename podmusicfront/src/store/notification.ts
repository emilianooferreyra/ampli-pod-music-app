import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';

type NotificationType = 'error' | 'success';

interface Notification {
  type: NotificationType;
  message: string;
}

const initialState: Notification = {
  type: 'error',
  message: '',
};

const slice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    updateNotification(
      notificationState,
      {payload}: PayloadAction<Notification>,
    ) {
      notificationState.message = payload.message;
      notificationState.type = payload.type;
    },
  },
});

export const getNotificationState = createSelector(
  (state: RootState) => state.notification,
  notificationState => notificationState,
);

export const {updateNotification} = slice.actions;

export default slice.reducer;
