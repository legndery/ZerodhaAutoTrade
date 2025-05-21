import puppeteer from "puppeteer";
import { TOTP } from "totp-generator";
import config from "../../config/config.js";
import { debug } from "../utils/util.js";
import chalk from "chalk";
import { setEncryptedAccessToken } from "./kiteApi.js";

const MARKER = "[AutoLogin]";

export async function autoLogin(loginUrl) {
  if (!config.AUTO_LOGIN) {
    console.log(`${MARKER} Manually open this: ${loginUrl}`);
    return;
  }
  try {
    console.log(chalk.yellow(`${MARKER} Trying to auto login!`));
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(loginUrl);
    console.log(chalk.yellow(`${MARKER} Opened login page!`));
    await page.locator('#userid').fill(config.USERNAME);
    await page.locator('#password').fill(config.PASSWORD);
    await page.locator('.actions button[type=submit]').click();
    console.log(chalk.yellow(`${MARKER} Opening OTP page!`));
    const { otp } = TOTP.generate(config.TOTP_SEED);
    debug() && console.log(otp);
    await page.locator('.twofa-form #userid').fill(otp);
    await page.waitForNavigation();
    console.log(chalk.bold.green(`${MARKER} Auto login successful!`))
    await delay(1000);
    await browser.close();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export async function autoLoginNormalUser(loginUrl = "https://kite.zerodha.com/") {
  if (!config.AUTO_LOGIN) {
    console.log(`${MARKER} Manually open this: ${loginUrl}`);
    return;
  }
  try {
    console.log(chalk.yellow(`${MARKER} Trying to auto login!`));
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.on('response', async (response) => {
      const request = response.request();
      console.log("------");
      if (request.url().includes("user/profile")){
        console.log(request.url());
        const headers = request.headers();
        console.log(headers);
        const encAccessToken = headers["authorization"].split("enctoken")[1].trim();
        setEncryptedAccessToken(encAccessToken);
      };
    })
    await page.goto(loginUrl);
    console.log(chalk.yellow(`${MARKER} Opened login page!`));
    await page.locator('#userid').fill(config.USERNAME);
    await page.locator('#password').fill(config.PASSWORD);
    await page.locator('.actions button[type=submit]').click();
    console.log(chalk.yellow(`${MARKER} Opening OTP page!`));
    const { otp } = TOTP.generate(config.TOTP_SEED);
    debug() && console.log(otp);
    await page.locator('.twofa-form #userid').fill(otp);
    await page.waitForNavigation();
    console.log(chalk.bold.green(`${MARKER} Auto login successful!`))
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