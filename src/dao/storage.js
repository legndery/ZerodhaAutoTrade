import path from 'path';
import { readFileSync } from 'fs';
import config from "../../config/config";
import { writeFileSync } from 'fs';

const lastNDaysDidntBuyPath = path.resolve(process.env.__DIRNAME, config.LAST_N_DAYS_DIDNT_BUY_PATH);

export function getLastNDaysDidntBuy() {
  return Number(readFileSync(lastNDaysDidntBuyPath));
}

export function increaseLastNDaysDidntBuyBy1(count) {
  return writeFileSync(lastNDaysDidntBuyPath, (count + 1).toString().toString());
}