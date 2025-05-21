import { EventEmitter } from 'events';
import { algoLoop, executeDataCollection } from '../algo/algoExecutor.js';
import { autoLogin } from '../kite/autoLogin.js';
import { LOGIN_URL } from '../utils/constants.js';
import chalk from 'chalk';

const MARKER = '[EventManager]';
export const appEventEmitter = new EventEmitter();
export const START_ALGO_LOOP = 'START_ALGO_LOOP';
export const AUTO_LOGIN = 'AUTO_LOGIN';
export const RESUME_WORK = 'RESUME_WORK';
export const DATA_COLLECTION = 'DATA_COLLECTION';

export const WORK_QUEUE = [];

appEventEmitter.on(START_ALGO_LOOP, async () => {
  try {
    await algoLoop();
  } catch (e) {
    console.error(e);
    appEventEmitter.emit(AUTO_LOGIN, { next: START_ALGO_LOOP });
  }
});

appEventEmitter.on(AUTO_LOGIN, async (nextEvent) => {
  console.log(chalk.yellow(`${MARKER} Will resume ${nextEvent?.next} after login`))
  WORK_QUEUE.push(nextEvent?.next);
  await autoLogin(LOGIN_URL);
  // await autoLoginNormalUser();
  // await checkAccessToken();
});

appEventEmitter.on(RESUME_WORK, () => {
  console.log(chalk.yellow(`${MARKER} Resuming work`));
  const nextEvent = WORK_QUEUE.shift();
  if (nextEvent) {
    console.log(chalk.yellow(`${MARKER} Work to Resume: ${nextEvent}`));
    appEventEmitter.emit(nextEvent);
  }
});

appEventEmitter.on(DATA_COLLECTION, async () => {
  try {
    await executeDataCollection();
  } catch (e) {
    console.error(e);
    // appEventEmitter.emit(AUTO_LOGIN, { next: DATA_COLLECTION })
  }
})