
"use strict";

import { existsSync, readFileSync } from "node:fs";
import { PATHS , SYSTEM } from "../var/system.js";

/**
 * handler for the gcce command
 * @author david, pass-me-dachips
 * @returns {void}
 */
export default function Gcce() {
  if (existsSync(PATHS.gcceConfig)) {
    const registry = JSON.parse(readFileSync(
      PATHS.gcceConfig, SYSTEM.encoding
    ));
   let defaultGcce = "cannot determine";
   if (existsSync(PATHS.globalConfig)) {
      const globalConfig = JSON.parse(readFileSync(
        PATHS.globalConfig,
        SYSTEM.encoding
      ));
      if ("default" in globalConfig) {
        for (let i = 0; i <= registry.length; i++) {
          let gcce = registry[i];
          if (gcce?.name === globalConfig?.default) { 
             defaultGcce = globalConfig?.default; 
             break;
          }
        }
      }
   } // determine the default gcce
   console.log(
    `gcce installed = ${registry.length}, global-default = ${defaultGcce}`
   );
   for (let i = 0; i < registry.length; i++) {
     let gcce = registry[i];
     console.log(`${SYSTEM.tabA}gcce ${gcce?.name}, v ${gcce?.version}, repo \x1b[95m${gcce?.repo}\x1b[0m`);
   }
  } else throw { message: "no gcce installed" }
}
