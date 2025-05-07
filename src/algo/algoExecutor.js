
import { NIFTYBEES } from "../utils/constants.js";
import { checkAccessToken, getHolding, placeOrder } from "../kite/kiteApi.js";
import { exit } from "process";

const LIVE = true;
const FORCEBUY = false;

export async function executeAlgo() {
  const niftybees = await getHolding(NIFTYBEES);
  console.log(`Day change % for ${NIFTYBEES}: ${niftybees?.day_change_percentage}`);
  if (FORCEBUY || niftybees?.day_change_percentage <= 0) {
    console.log(`Buy some ${NIFTYBEES}`);
    LIVE && placeOrder({
      tradingsymbol: NIFTYBEES,
      quantity: 1
    });
  } else {
    console.log(`No need to buy ${NIFTYBEES}`);
  }
}

export async function algoLoop() {
  try {
    await checkAccessToken();
    console.log('Access token valid');
    await executeAlgo();
    console.log("Algo Executed");
    // exit(0);
  } catch (error) {
    console.error('Initialization failed:', error);
    if (error.message.indexOf('access_token') > -1) {
      throw error;
    }
  }
}