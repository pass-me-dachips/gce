import { existsSync, readFileSync } from "node:fs";
import { GPATHS , GOUTFORMAT } from "../var/system.js";

export default function Gcce() {
  if (existsSync(GPATHS.gcceConfig)) {
    const configContent = JSON.parse(readFileSync(
      GPATHS.gcceConfig, GOUTFORMAT.encoding
    ));
   let defaultGcce = "unable_to_determine";
   if (existsSync(GPATHS.globalConfig)) {
      const globalConfig = JSON.parse(readFileSync(GPATHS.globalConfig));
      if ("def" in globalConfig) {
        for (let i = 0; i <= configContent.length; i++) {
          let elem = configContent[i];
          if (elem?.name === globalConfig?.def) { 
             defaultGcce = globalConfig?.def; 
             break;
          }
        }
      }
   } // determine the default editor
   console.log(
    `gcce: installed = ${configContent.length}, global-default <${defaultGcce}>`
   );
   for (let k = 0; k < configContent.length; k++) {
     let elem = configContent[k];
     console.log(`${GOUTFORMAT.tabA}gcce ${elem?.name}, version ${elem?.version}`);
   }
  } else throw { message: "ABORTED: no gcce found" }
}
