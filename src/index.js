import './populateEnv.js'
import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import router from './server/router.js';
import cron from 'node-cron';
import { appEventEmitter, AUTO_LOGIN, START_ALGO_LOOP } from './manager/eventManager.js';
import chalk from 'chalk';
import moment from 'moment-business-days';

const app = express();
const port = 3000;

const key = fs.readFileSync(path.resolve(process.env.__DIRNAME, '../cert/localhost.key'));
const cert = fs.readFileSync(path.resolve(process.env.__DIRNAME, '../cert/localhost.crt'));
const credentials = {
  key: key,
  cert: cert
};
const httpsServer = https.createServer(credentials, app);
app.use('/', router);

httpsServer.listen(port, async () => {
  console.log(chalk.bold.green(`Server listening on port ${port}\n`));
  // appEventEmitter.emit(START_ALGO_LOOP);
  appEventEmitter.emit(AUTO_LOGIN);
});

// cron every week day at 3 15 pm
cron.schedule('15 15 * * 1-5', () => {
  console.log(chalk.bold.green('Running cron job at 3:15 pm'));
  if (!moment().isBusinessDay()){
    console.log(chalk.bold.red('Today is holiday, skipping algo run'));
    return;
  }
  appEventEmitter.emit(START_ALGO_LOOP);
});

