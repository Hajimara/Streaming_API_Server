export default {
  database: {
    prefix: 'mongodb://',
    host: process.env.DATABASEHOST || 'localhost',
    port: process.env.DATABASEPORT || 27017,
    dbname: 'apiServer',
    username: 'ksnc',
    password: 'Ksncio!',
  },
};
