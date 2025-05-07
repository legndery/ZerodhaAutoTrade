import path from 'path';
import config from '../../config/config.js';

export const CANDLE_URL = '';
export const NIFTYBEES = 'NIFTYBEES';
// export const NIFTYBEES = 'ADANIPOWER';
export const SESSION_CONFIG_PATH = path.resolve(process.env.__DIRNAME, '../config/session.json');
export const LOGIN_URL = `https://kite.zerodha.com/connect/login?v=3&api_key=${config.API_KEY}`;