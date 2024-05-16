import * as readLine from "node:readline";
import { existsSync, writeFileSync } from "node:fs";
import { GPATHS } from "../var/system.js";
import { TglobalConfig } from "../var/templates.js";

export default function ResetGlobalC() {
  if (existsSync(GPATHS.globalConfig)) {
     const rl = readLine.createInterface({
       output: process.stdout, input: process.stdin
     })
     let cb = (data) => {
       rl.close()
       if (data === "ACK") {
         writeFileSync(GPATHS.globalConfig, JSON.stringify(TglobalConfig, "",2));
       } else throw { message: "Cannot acknowledge request" }
     }
     rl.question("Acknowledge this action by inputing `ACK` ", cb);  
  } else throw { message: "ABORTED: nothing to reset" };
}
