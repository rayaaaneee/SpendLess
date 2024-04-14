import express from "express";
import Database from "better-sqlite3";
import cors from "cors";
import * as dotenv from "dotenv";
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'log/combined.log' }),
  ],
});

dotenv.config();

export const app = express();
const port = 3000;

const getDatabase = () => {
  const environment = process.env.NODE_ENV || 'development';

  if (environment === 'test') {
    return new Database("db/test_database.db");
  } else {
    return new Database("db/database.db");
  }
};

export const db = getDatabase();

app.use(express.json(), cors());

import('./router');

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}