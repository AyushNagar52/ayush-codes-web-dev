const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/constants');

// Connect to Database
connectDB();

const server = app.listen(PORT, () => {
  console.log(`[Server] Paper Trading API listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.name}: ${err.message}`);
  server.close(() => process.exit(1));
});
