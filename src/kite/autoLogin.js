import puppeteer from "puppeteer";
import { TOTP } from "totp-generator";
import config from "../../config/config.js";
import { debug } from "../utils/util.js";

export async function autoLogin(loginUrl) {
  if (!config.AUTO_LOGIN) {
    console.log(`Manually open this: ${LOGIN_URL}`);
    return;
  }
  try {
    console.log("Trying to auto login!")
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(loginUrl);
    await page.locator('#userid').fill(config.USERNAME);
    await page.locator('#password').fill(config.PASSWORD);
    await page.locator('.actions button[type=submit]').click();
    const { otp } = TOTP.generate(config.TOTP_SEED);
    debug() && console.log(otp);
    await page.locator('.twofa-form #userid').fill(otp);
    await page.waitForNavigation();
    console.log("Auto login successful!")
    await delay(1000);
    await browser.close();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}