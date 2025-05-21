
import { NIFTYBEES } from "../utils/constants.js";
import { getFunds, getHolding, placeOrder } from "../kite/kiteApi.js";
import config from "../../config/config.js"
import { calculateQuantityToBuy, debug } from "../utils/util.js";
import chalk from "chalk";
import { getLastNDaysDidntBuy, increaseLastNDaysDidntBuyBy1, storeCurrentPrice } from "../dao/storage.js";
import moment from "moment-business-days";
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

    if (config.LIVE_ORDER && possibleQuantity > 0) {
      console.log(chalk.bold.green(`${MARKER} Buying ${possibleQuantity} ${NIFTYBEES} at ${niftybees?.last_price} per share`));
      placeOrder({
        tradingsymbol: NIFTYBEES,
        quantity: possibleQuantity
      });
    } else {
      console.log(chalk.yellow(`${MARKER} No need to buy ${NIFTYBEES}`));
    }
  } else {
    console.log(chalk.yellow(`${MARKER} No need to buy due to positive market for ${NIFTYBEES}`));
    increaseLastNDaysDidntBuyBy1(howManyDaysDidntBuy);
  }
}

export async function executeDataCollection() {
  const niftybees = await getHolding(NIFTYBEES);
  console.log(`${MARKER} Day change % for ${chalk.bold.green(NIFTYBEES)}: ${chalk.bold.yellow(niftybees?.day_change_percentage)}`);
  storeCurrentPrice(moment(), niftybees?.tradingsymbol, niftybees?.last_price);
}

export async function algoLoop() {
  try {
    await executeAlgo();
    console.log(chalk.bold.green(`${MARKER} Algo Executed for the day`));
    // exit(0);
  } catch (error) {
    console.error('Initialization failed:', error);
    console.log(chalk.bold.red(`${MARKER} Access token expired`));
    throw error;
  }
}