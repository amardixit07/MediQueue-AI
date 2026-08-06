const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Doctor joins their specific queue room
    socket.on('join-doctor-room', (doctorId) => {
      socket.join(`queue-${doctorId}`);
      console.log(`Doctor ${doctorId} joined their queue room`);
    });

    // Patient joins their specific room to get direct notifications
    socket.on('join-patient-room', (patientId) => {
      socket.join(`patient-${patientId}`);
      console.log(`Patient ${patientId} joined their personal room`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocket };
