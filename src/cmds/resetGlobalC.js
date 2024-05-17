
"use strict";

import * as readLine from "node:readline";
import { existsSync, writeFileSync } from "node:fs";
import { PATHS } from "../var/system.js";
import { globalConfigTemplate } from "../var/templates.js";

/**
 * handler for the resetGlobalConfig command
 * @author david, pass-me-dachips
 * @returns {void}
 */
export default function ResetGlobalC() {
  if (existsSync(PATHS.globalConfig)) {
     console.log("~ you are about to reset your global configurations");
     const rl = readLine.createInterface({
       output: process.stdout, input: process.stdin
     });
     let cb = (data) => {
       rl.close();
       if (data === "ACK") {
         writeFileSync(PATHS.globalConfig, JSON.stringify(
             globalConfigTemplate, null, 2
         ));
       } else throw { message: "cannot acknowledge request" }
     }
     rl.question("acknowledge this action by replying `ACK` ", cb);  
  } else throw { message: "no configurations to reset" };
}
