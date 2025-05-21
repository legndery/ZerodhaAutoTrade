import path from 'path';
import { appendFileSync, readFileSync } from 'fs';
import config from "../../config/config.js";
import { writeFileSync } from 'fs';
// eslint-disable-next-line no-unused-vars
import moment from 'moment-business-days';

const lastNDaysDidntBuyPath = path.resolve(process.env.__DIRNAME, config.LAST_N_DAYS_DIDNT_BUY_PATH);

export function getLastNDaysDidntBuy() {
  return Number(readFileSync(lastNDaysDidntBuyPath));
}

export function increaseLastNDaysDidntBuyBy1(count) {
  return writeFileSync(lastNDaysDidntBuyPath, (count + 1).toString().toString());
}
/**
 * 
 * @param {moment()} dateMoment 
 * @param {String} instrument 
 * @param {any} price 
 */
export function storeCurrentPrice(/** @type {moment()}*/dateMoment, instrument, price) {
  const filePath = path.resolve(process.env.__DIRNAME, `../data/${instrument}_${dateMoment.format('YYYY-MM-DD')}.csv`);
  const formattedDate = dateMoment.format('YYYY-MM-DD HH:mm:ss');
  const csvLine = `${formattedDate},${instrument},${price}\n`;
  
  // Check if file exists and create header if it doesn't
  try {
    readFileSync(filePath);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // File doesn't exist, create with header
    console.log(`Creating file ${filePath}`);
    writeFileSync(filePath, 'date,instrument,price\n');
  }
  
  appendFileSync(filePath, csvLine);
}