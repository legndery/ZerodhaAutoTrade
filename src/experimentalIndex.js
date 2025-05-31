import { autoLoginNormalUser } from "./kite/autoLogin.js"

(async ()=>{
  await autoLoginNormalUser();
})().then(console.log).catch(console.error);