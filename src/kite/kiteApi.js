import { KiteConnect } from "kiteconnect";
import { readFileSync, existsSync } from "fs";
import { debug, writeSessionInfo } from "../utils/util.js";
import { SESSION_CONFIG_PATH } from "../utils/constants.js";
import config from "../../config/config.js";

const apiKey = config.API_KEY;
const apiSecret = config.API_SECRET;

let session = {};

if (existsSync(SESSION_CONFIG_PATH)) {
  const sessionJson = readFileSync(SESSION_CONFIG_PATH);
  session = JSON.parse(sessionJson || '{}');
}

const kc = new KiteConnect({ api_key: apiKey, access_token: session.access_token, debug: false });

export async function generateSession(requestToken) {
  try {
    const response = await kc.generateSession(requestToken, apiSecret);
    kc.setAccessToken(response.access_token);
    writeSessionInfo(response);
    debug() && console.log("Session generated:", response);
  } catch (err) {
    console.error("Error generating session:", err);
  }
}

export async function checkAccessToken() {
  try {
    const profile = await kc.getProfile();
    debug() && console.log("Profile:", profile);
  } catch (err) {
    debug() && console.error("Error getting profile:", err);
    throw err;
  }
}
/**
 * Returns holdings
 * @returns 
 */
export async function getHoldings() {
  try {
    const holdings = await kc.getHoldings();
    debug() && console.log("Holdings:", holdings);
    return holdings;
  } catch (err) {
    console.error("Error getting holdings:", err);
    throw err;
  }
}

export async function getHolding(tradingSymbol) {
  const holdings = await getHoldings();
  return holdings.find((holding) => holding.tradingsymbol === tradingSymbol);
}

export async function placeOrder(params) {
  const { tradingsymbol, quantity } = params;
  try {
    const order = await kc.placeOrder("regular", {
      tradingsymbol,
      exchange: "NSE",
      transaction_type: 'BUY',
      order_type: "MARKET",
      quantity,
      product: 'CNC',
      validity: "DAY"
    });
    console.log("Order placed:", order);
  } catch (err) {
    console.error("Error placing order:", err);
  }
}

export async function getFunds() {
  try {
    const funds = await kc.getMargins();
    debug() && console.log("Funds:", funds);
    return funds.equity?.net;
  } catch (err) {
    console.error("Error getting funds:", err);
  }

}