import express from 'express';
import { generateSession } from '../kite/kiteApi.js';
import { debug } from '../utils/util.js';
import { appEventEmitter, RESUME_WORK } from '../manager/eventManager.js';
const router = express.Router();

router.get('/redirect', async (req, res) => {
  const requestToken = req.query.request_token;
  debug() && console.log(requestToken);
  await generateSession(requestToken);
  res.send("Window can be closed");
  appEventEmitter.emit(RESUME_WORK);
})
export default router;