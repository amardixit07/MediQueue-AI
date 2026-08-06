import { io } from 'socket.io-client';

const URL = 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const joinDoctorQueue = (doctorId) => {
  if (socket.connected) {
    socket.emit('join-queue', { doctorId });
  }
};

export const joinPatientQueueTracker = (patientId) => {
  if (socket.connected) {
    socket.emit('join-patient', { patientId });
  }
};

export const onQueueUpdate = (callback) => {
  socket.on('queue-updated', callback);
};

export const offQueueUpdate = () => {
  socket.off('queue-updated');
};

export const onTokenCalled = (callback) => {
  socket.on('token-called', callback);
};

export const offTokenCalled = () => {
  socket.off('token-called');
};
