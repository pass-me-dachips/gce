import { existsAsync } from "../etc/existsAsync.js";
import { end } from "../spkg/v1.0.0.js";
import { GOUTFORMAT, GPATHS } from "../var/system.js";
import { join } from "node:path";
import ping from "../local/pingServer.js";
import { readdir, readFile } from "node:fs/promises";

async function cb() {
  const report = (message) => 
    console.log(
      `\x1b[96mreport[${new Date().toLocaleTimeString()}] >\x1b[0m ${message}`
    );
  const services = await existsAsync(GPATHS.serviceLog) ?
     await readdir(GPATHS.serviceLog, GOUTFORMAT.encoding): [];
  if (services.length > 0) {
     for (let i = 0; i < services.length; i++) {
       const serviceId = services[i];
       const servicePath = join(GPATHS.serviceLog, serviceId);
       // cb to call after pinging  
       const clearCb = async (pong) => {
         if (pong === null) {
           try {
            const sdu = await readFile(servicePath, GOUTFORMAT.encoding);
            await end(JSON.parse(sdu), false, false, true);
            } catch { report(`removed GH ${serviceId}`); }
         }
        };
       // cb to call after pinging  
       if (existsAsync(servicePath)) { ping(serviceId, clearCb); }
     }
  } else report("no services found");
  return void 0;
 }


export default async function Clean(args) {
 const keepAlive = args[1] === "--nosleep" ? true : false;
 const TBI = 180000; //3min
 if (keepAlive) { setInterval(cb, TBI); } 
 else cb();
 return void 0;
}
