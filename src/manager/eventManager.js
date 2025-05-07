import { EventEmitter } from 'events';
import { algoLoop } from '../algo/algoExecutor.js';
import { autoLogin } from '../kite/autoLogin.js';
import { LOGIN_URL } from '../utils/constants.js';

export const appEventEmitter = new EventEmitter();
export const START_ALGO_LOOP = 'START_ALGO_LOOP';
export const AUTO_LOGIN = 'AUTO_LOGIN';

appEventEmitter.on(START_ALGO_LOOP, async () => {
  try {
    await algoLoop();
  } catch (e) {
    appEventEmitter.emit(AUTO_LOGIN);
  }
});

appEventEmitter.on(AUTO_LOGIN, async () => {
  await autoLogin(LOGIN_URL);
})