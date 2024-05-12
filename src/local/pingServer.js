
import { request } from "node:http";
import { GOUTFORMAT } from "../var/system.js";

export default function ping(elem,index, cb) {
  let pong;
  try {
    const options = {
    host: "localhost",
    port: elem.split("x")[0],
    path: "/ping",
    method: "GET",
    headers: {
       "Content-Type": "application/json",
       "Content-Length": 0
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
    req.on("close", ()=> cb(pong, elem, index));
  } catch { pong = false; return pong; }
}

// usage =>
// ping(3921xS...., 0, (res)=> {
//    console.log(res)
// })
