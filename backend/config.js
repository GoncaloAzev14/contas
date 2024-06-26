import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000,

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test',

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || 'my sakdfho2390asjod$%jl)!sdjas0i secret',

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    transaction: {
      name: 'TransactionController',
      path: '../controllers/transactionController',
    },
    total: {
      name: 'TotalController',
      path: '../controllers/totalController',
    },
  },

  repos: {
    transaction: {
      name: 'TransactionRepo',
      path: '../repos/transactionRepo',
    },
    total: {
      name: 'TotalRepo',
      path: '../repos/totalRepo',
    },
  },

  services: {
    transaction: {
      name: 'TransactionService',
      path: '../services/transactionService',
    },
    total: {
      name: 'TotalService',
      path: '../services/totalService',
    },
  },
};
