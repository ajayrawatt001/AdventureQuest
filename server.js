const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception Shutting down!!');
  console.log(err.name, err.message);
  process.exit(1);
});

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
  console.log('DB Connected Successfully');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on('unhandleRejection', (err) => {
  console.log('Unhandle Rejection! Shutting down!!');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
