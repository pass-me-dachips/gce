
"use strict";

import { end } from "../spkg/v1.0.0.js";
import { join } from "node:path";
import { PATHS, SYSTEM } from "../var/system.js";
import { readdirSync, readFileSync, existsSync } from "node:fs";

/** handler for the kill command
 * @author david, pass-me-dachips
 * @param {Array} args 
 * @returns {void}
 */
export default async function Kill(args) {
  if (args.length === 1) {
    const services = existsSync(PATHS.serviceLog) ? readdirSync(PATHS.serviceLog, SYSTEM.encoding).length : 0;
    console.log(
      `assass1n: ${services} target${services > 1 ? "s": ""}, ${services} ready to be killed.`
    );
    return void 0;
  } else { 
    const serviceId = args[1];
    const servicePath = join(PATHS.serviceLog, serviceId);
    if (existsSync(servicePath)) {
      try {
      const sdu = readFileSync(servicePath, SYSTEM.encoding);
      await end(JSON.parse(sdu), false, false, true);
      } catch { console.log("kill ESRCH: ghost removed") }
    } else console.log("cannot find service %s", serviceId);
    return void 0;
  }
}
