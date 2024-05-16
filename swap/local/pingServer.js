
import { request } from "node:http";
import { GOUTFORMAT } from "../var/system.js";

export default function ping(elem, cb) {
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
      let data = "";
      res.on("data", (chunk)=> data += chunk ); //do nothing
      res.on("end", ()=> {
      if (res.statusCode === 200) pong = data;
      else pong = null;
      });
    })
    req.on("error", () => { pong = null })
    req.end();
    req.on("close", ()=> cb(pong, elem));
  } catch { pong = false; return pong; }
}

// usage =>
// ping("8501xS....", (res)=> {
//    console.log(res)
// })
