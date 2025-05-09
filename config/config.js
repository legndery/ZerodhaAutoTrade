export default {
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  DEBUG: process.env.DEBUG === 'true',
  // if AUTO_LOGIN is true then needs username password and totp seed
  AUTO_LOGIN: process.env.AUTO_LOGIN === 'true',
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,
  TOTP_SEED: process.env.TOTP_SEED,

  // Normal configs
  budget: 25000,
  max_per_day_fund: 1000,
  FORCE_BUY: true,
  LIVE_ORDER: false,
  LAST_N_DAYS_DIDNT_BUY_PATH: '../config/buystock.txt'
}