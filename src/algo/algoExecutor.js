
import { NIFTYBEES } from "../utils/constants.js";
import { checkAccessToken, getFunds, getHolding, placeOrder } from "../kite/kiteApi.js";
import config from "../../config/config.js"
import { daysBudget } from "../utils/util.js";
import chalk from "chalk";
import { getLastNDaysDidntBuy, increaseLastNDaysDidntBuyBy1 } from "../dao/storage.js";
const MARKER = "[AlgoExecutor]";

export async function executeAlgo() {
  const niftybees = await getHolding(NIFTYBEES);
  console.log(`${MARKER} Day change % for ${chalk.bold.green(NIFTYBEES)}: ${chalk.bold.yellow(niftybees?.day_change_percentage)}`);
  let howManyDaysDidntBuy = getLastNDaysDidntBuy();

  if (config.FORCE_BUY || niftybees?.day_change_percentage <= 0) {
    console.log(`${MARKER} Trying to buy some ${chalk.bold.green(NIFTYBEES)}`);
    const funds = await getFunds();
    console.log(`${MARKER} Funds available:`, chalk.bold.green(funds));
    const possibleQuantity = calculateQuantityToBuy(niftybees, funds, howManyDaysDidntBuy);
    console.log(chalk.bold.green(`${MARKER} Buying ${possibleQuantity} ${NIFTYBEES} at ${niftybees?.last_price} per share`));

    config.LIVE_ORDER && placeOrder({
      tradingsymbol: NIFTYBEES,
      quantity: possibleQuantity
    });

  } else {
    console.log(chalk.yellow(`${MARKER} No need to buy ${NIFTYBEES}`));
    increaseLastNDaysDidntBuyBy1(howManyDaysDidntBuy);
  }
}

export async function algoLoop() {
  try {
    await checkAccessToken();
    console.log(chalk.bold.green(`${MARKER} Access token valid`));
    await executeAlgo();
    console.log(chalk.bold.green(`${MARKER} Algo Executed for the day`));
    // exit(0);
  } catch (error) {
    console.error('Initialization failed:', error);
    console.log(chalk.bold.red(`${MARKER} Access token expired`));
    // if (error.message.indexOf('access_token') > -1) {
    throw error;
    // }
  }
}

function calculateQuantityToBuy(niftybees, funds, howManyDaysDidntBuy) {
  // increase price to nearest 5 to get some leeway
  const price = Math.ceil(niftybees?.last_price / 5) * 5;
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