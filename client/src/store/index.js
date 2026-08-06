import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentReducer from './slices/appointmentSlice';
import queueReducer from './slices/queueSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    appointment: appointmentReducer,
    queue: queueReducer,
  },
});

export default store;
