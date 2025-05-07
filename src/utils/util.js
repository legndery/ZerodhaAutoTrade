import { writeFileSync } from 'fs';
import path from 'path';
import config from '../../config/config.js';

export function writeSessionInfo(session) {
  writeFileSync(path.resolve(process.env.__DIRNAME, '../config/session.json'), JSON.stringify(session, null, 4));
}

export function debug() {
  return config.DEBUG;
}