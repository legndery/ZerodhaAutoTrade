import 'dotenv/config';
import { populate } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
populate(process.env, {
  __DIRNAME: __dirname
}, { override: true, debug: true })
export default {};