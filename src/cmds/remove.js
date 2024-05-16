
"use strict";

import * as readLine from "node:readline";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { PATHS, SYSTEM } from "../var/system.js";

/**
 * handle for remove command
 * @param {Array} args 
 * @returns {void}
 */
export default function Remove(args) {
  if (args.length === 2) {
    const gcceName = args[1];
    if (existsSync(PATHS.gcceConfig)) {
      const registry = JSON.parse(readFileSync(
        PATHS.gcceConfig, SYSTEM.encoding
      ));
      let gcceExists = false;
      for (let gcce = 0; gcce < registry.length; gcce++) {
        if (registry[gcce]?.name === gcceName) { gcceExists = true; break };
      } // checks if the gcce exists

      if (gcceExists) {
        const gcceDuplicate = [];
        let isgcceDuplicate = false;

        for (let d = 0; d <= registry.length; d++) {
          const gcce = registry[d];
          if (gcce?.name === gcceName && gcceDuplicate.includes(gcce?.name)) {
            isgcceDuplicate = true
            break;
          } else gcceDuplicate.push(gcce?.name);
        } // checks if they are duplicates

        if (isgcceDuplicate) {
          const rl = readLine.createInterface({
            output:process.stdout, 
            input:process.stdin 
          });
          rl.question("Duplicates Found. input a version to remove ", (v)=> {
             const newregistry = [];
             registry.forEach(gcce => {
               if(gcce?.name !== gcceName || gcce?.name === gcceName
               && gcce?.version !== v) newregistry.push(gcce)
             })
             writeFileSync(PATHS.gcceConfig, JSON.stringify(newregistry));
             // ----++++++ If the version is not found, gce wont notify you. 
             // run gce gcce to confirm removal +++++++----------
             rl.close();
          });
        } else {
          const newregistry = [];
          registry.forEach(gcce => {
             if (gcce?.name !== gcceName) newregistry.push(gcce)
          });
          writeFileSync(PATHS.gcceConfig, JSON.stringify(newregistry));
        }
      } else throw { message: "gcce does not exist" }
    } else throw { message: "no gcce installed" }
  } else {
    const message = "remove expects only 1 argument which is the name of the gcce";
    throw { message }
  }
}
