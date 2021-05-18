// global
import mongoose from 'mongoose';

// local
import config from '../config';

const connect = () => {
  const authPrefix = `${config.database.username}:${config.database.password}@`;
  mongoose.connect(`${config.database.prefix}${authPrefix}${config.database.host}/${config.database.dbname}`, {
    dbName: 'apiServer',
    useNewUrlParser: true,
    useCreateIndex: true,
  }, (err) => {
    if (err) {
      console.log('MongoDB ERROR : ', err);
    } else {
      console.log('MongoDB connection was successful');
    }
  });
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error : ', err);
});

mongoose.connection.on('disconnected', () => {
  console.error('Reconnect to MongoDB');
  connect();
});

export default connect;
