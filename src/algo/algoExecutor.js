
import { NIFTYBEES } from "../utils/constants.js";
import { checkAccessToken, getFunds, getHolding, placeOrder } from "../kite/kiteApi.js";
import config from "../../config/config.js"
import { calculateQuantityToBuy, debug } from "../utils/util.js";
import chalk from "chalk";
import { getLastNDaysDidntBuy, increaseLastNDaysDidntBuyBy1 } from "../dao/storage.js";
const MARKER = "[AlgoExecutor]";

export async function executeAlgo() {
  const niftybees = await getHolding(NIFTYBEES);
  debug() && console.log(niftybees);
  console.log(`${MARKER} Day change % for ${chalk.bold.green(NIFTYBEES)}: ${chalk.bold.yellow(niftybees?.day_change_percentage)}`);
  let howManyDaysDidntBuy = getLastNDaysDidntBuy();

  let possibleQuantity = 0;
  if (config.FORCE_BUY || niftybees?.day_change_percentage <= 0) {
    console.log(`${MARKER} Trying to buy some ${chalk.bold.green(NIFTYBEES)}`);
    const funds = await getFunds();
    console.log(`${MARKER} Funds available:`, chalk.bold.green(funds));
    possibleQuantity = calculateQuantityToBuy(niftybees?.last_price, funds, howManyDaysDidntBuy);
    console.log(chalk.bold.yellow(`${MARKER} Can buy ${possibleQuantity} ${NIFTYBEES} at ${niftybees?.last_price} per share`));
  }

  if (config.LIVE_ORDER && possibleQuantity > 0) {
    console.log(chalk.bold.green(`${MARKER} Buying ${possibleQuantity} ${NIFTYBEES} at ${niftybees?.last_price} per share`));
    placeOrder({
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