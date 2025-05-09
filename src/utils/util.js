import { writeFileSync } from 'fs';
import path from 'path';
import config from '../../config/config.js';
import moment from 'moment-business-days';
import chalk from 'chalk';

export function writeSessionInfo(session) {
  writeFileSync(path.resolve(process.env.__DIRNAME, '../config/session.json'), JSON.stringify(session, null, 4));
}

export function debug() {
  return config.DEBUG;
}

export function daysBudget(budget, howManyDaysDidntBuy) {
  const diff = moment().businessDiff(moment().endOf('month'));
  console.log(chalk.yellow(`Business days remaining from Today(before market): ${diff}`));
  return (budget / (diff + howManyDaysDidntBuy)) * (1 + howManyDaysDidntBuy);
}