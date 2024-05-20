
"use strict";

import { end } from "../spkg/v1.0.0.js";
import { existsAsync } from "../etc/existsAsync.js";
import { join } from "node:path";
import ping from "../local/services/pingServer.js";
import { readdir, readFile } from "node:fs/promises";
import { SYSTEM, PATHS } from "../var/system.js";

async function cb() {
  const report = (message) => 
    console.log(
      `\x1b[96mreport[${new Date().toLocaleTimeString()}] >\x1b[0m ${message}`
    );
  const services = await existsAsync(PATHS.serviceLog) ?
     await readdir(PATHS.serviceLog, SYSTEM.encoding): [];
  if (services.length > 0) {
     for (let i = 0; i < services.length; i++) {
       const serviceId = services[i];
       const servicePath = join(PATHS.serviceLog, serviceId);
       // cb to call after pinging  
       const clearCb = async (pong) => {
         if (pong === null) {
           try {
            const sdu = await readFile(servicePath, SYSTEM.encoding);
            await end(JSON.parse(sdu), false, false, true);
            } catch { report(`removed ghost ${serviceId}`); }
         }
        };
       // cb to call after pinging  
       if (existsAsync(servicePath)) { ping(serviceId, clearCb); }
     }
  } else report("no services found");
  return void 0;
 }

/**
 * @author david, pass-me-dachips
 * @param {Array} args 
 * @returns {void}
 */
export default async function Clean(args) {
 const keepAlive = args[1] === "--nosleep" ? true : false;
 const TBI = 180000; //3min
 if (keepAlive) { setInterval(cb, TBI); } 
 else cb();
 return void 0;
}
