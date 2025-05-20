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
  let diff = businessDiffInclusive(moment(), moment().endOf('month'));
  console.log(chalk.yellow(`Business days remaining from Today(before market): ${diff}`));
  return (budget / (diff + howManyDaysDidntBuy)) * (1 + howManyDaysDidntBuy);
}

export function calculateQuantityToBuy(stock_price, funds, howManyDaysDidntBuy) {
  // increase price to nearest 5 to get some leeway
  const price = Math.ceil(stock_price / 5) * 5;
  const dailyBudget = daysBudget(funds, howManyDaysDidntBuy);
  if (dailyBudget >= price) {
    // cannot buy fractional in indian system
    return Math.floor(dailyBudget / price);
  } else {
    // think of the fund to use
    funds = funds > config.max_per_day_fund ? config.max_per_day_fund : funds;
    return Math.floor(funds / price);
  }
}

export function businessDiffInclusive(d1, d2) {
  const start = d1 < d2 ? d1 : d2;
  const end = d2 > d1 ? d2 : d1;
  let daysBetween = 0;

  if (start.isSame(end, 'day')) {
    return daysBetween + (start.isBusinessDay() ? 1 : 0);
  }

  while (start.isSameOrBefore(end, 'day')) {
    if (start.isBusinessDay()) {
      daysBetween += 1;
    }
    start.add(1, 'day');
  }
  return daysBetween;
};