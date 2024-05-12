
import { request } from "node:http";
import { GOUTFORMAT } from "../var/system.js";

async function ping(port, cb) {
  let pong;
  try {
    const options = {
    host: "localhost",
    port,
    path: "/ping",
    method: "GET",
    headers: {
       'Content-Type': 'application/json',
       'Content-Length': 0
    }
    }
    const req = request(options, (res)=> {
      res.setEncoding(GOUTFORMAT.encoding);
      res.on("data", ()=> {}); //do nothing
      res.on("end", ()=> {
      if (res.statusCode === 200) pong = true;
      else pong = false;
      });
    })
    req.on("error", () => { pong = false })
    req.end();
    req.on("close", ()=> cb(pong));
  } catch { pong = false; return pong; }
}

// usage =>
// await ping(8501, (res)=> {
//    console.log(res)
// })
