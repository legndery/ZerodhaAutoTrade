import './populateEnv.js'
import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import router from './server/router.js';
import cron from 'node-cron';
import { appEventEmitter, START_ALGO_LOOP } from './manager/eventManager.js';
import chalk from 'chalk';

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
});

// cron every day at 3 15 pm
cron.schedule('15 15 * * *', () => {
  console.log(chalk.bold.green('Running cron job at 3:15 pm'));
  appEventEmitter.emit(START_ALGO_LOOP);
});

