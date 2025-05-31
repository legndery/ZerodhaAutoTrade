import axios from "axios";
import config from "../../config/config.js";
import { KiteTicker } from "kiteconnect";
import { autoLoginNormalUser } from "./autoLogin.js";

class KiteConnectForNormalUser {

  constructor(params) {
    this.enc_access_token = params.enc_access_token;
  }
  createAxiosInstance() {
    const axiosInstance = axios.create({
      headers: {
        authorization: this.enc_access_token ? `enctoken ${this.enc_access_token}` : ''
      }
    });
    return axiosInstance;
  }
  setEncAccessToken(enc_access_token) {
    this.enc_access_token = enc_access_token;
  }

  // startWebsocket(){
  //   const websocket = new WebSocket(`wss://ws.zerodha.com/?api_key=kitefront&user_id=${config.USERNAME}&enctoken=${this.enc_access_token}&user-agent=kite3-web&version=3.0.0`);
  //   const subscribe = { a: "subscribe", v: [27074577] };
  //   websocket.send(JSON.stringify(subscribe));
  //   const getLTP = { a: "mode", v: ["ltp", [27074577]] };
  //   websocket.send(JSON.stringify(getLTP));
  // }
}
let enc_access_token = "";

// const k = new KiteConnectForNormalUser({
//   enc_access_token
// });

// let ticker = new KiteTicker({
//   root: 'wss://ws.zerodha.com/',
//   api_key: `kitefront&user_id=${config.USERNAME}`,
//   access_token: `&enctoken=${encodeURIComponent(enc_access_token)}&user-agent=kite3-web&version=3.0.0`
// });
// ticker.autoReconnect(false, 1, 5);
// ticker.connect();
// ticker.on('ticks', onTicks);

// ticker.on('connect', console.log);
// ticker.on('message', console.log);
// // ticker.on('error', console.log);
// ticker.on('order_update', console.log);
// ticker.on('connect', subscribe);
// ticker.on('noreconnect', () => {
//   console.log('noreconnect');
// })
// ticker.on('reconnect', (reconnect_count, reconnect_interval) => {
//   console.log('Reconnecting: attempt - ', reconnect_count, ' interval - ', reconnect_interval)
// })

export function setEncryptedAccessToken(encAccessToken) {
  enc_access_token = encAccessToken;
  console.log(enc_access_token);
  // const websocket = new WebSocket(`wss://ws.zerodha.com/?api_key=kitefront&user_id=${config.USERNAME}&enctoken=${encodeURIComponent(enc_access_token)}&user-agent=kite3-web&version=3.0.0&uid=${new Date().getTime().toString()}`);
  // websocket.binaryType = "arraybuffer";
  // websocket.onopen = () => {
  //   console.log("opened");
  //   const subscribe = { a: "subscribe", v: [2707457] };
  //   websocket.send(JSON.stringify(subscribe));
  //   const getLTP = { a: "mode", v: ["ltp", [2707457]] };
  //   websocket.send(JSON.stringify(getLTP));
  // };
  // websocket.onmessage =(e) => console.log(e.data);



  const ticker = new KiteTicker({
    root: 'wss://ws.zerodha.com/',
    api_key: `kitefront&user_id=${config.USERNAME}`,
    access_token: `&enctoken=${encodeURIComponent(enc_access_token)}&user-agent=kite3-web&version=3.0.0`
  });
  ticker.autoReconnect(true, 10, 5);
  ticker.connect();
  ticker.on('ticks', onTicks);

  ticker.on('connect', console.log);
  ticker.on('message', console.log);
  ticker.on('error', console.log);
  ticker.on('order_update', console.log);
  ticker.on('connect', subscribe);
  ticker.on('noreconnect', () => {
    console.log('noreconnect')
  })
  ticker.on('reconnect', (reconnect_count, reconnect_interval) => {
    console.log('Reconnecting: attempt - ', reconnect_count, ' interval - ', reconnect_interval)
  })

  function onTicks(ticks) {
    console.log('Ticks', ticks)
  }
  function subscribe() {
    console.log("Subscribing");
    const items = [2707457];
    ticker.subscribe(items)
    ticker.setMode(ticker.modeLTP, items);
  }
}

