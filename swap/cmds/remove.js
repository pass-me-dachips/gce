import * as readLine from "node:readline";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { GPATHS, GOUTFORMAT } from "../var/system.js";

export default function Remove(args) {
  if (args.length === 2) {
    const gcceName = args[1];
    if (existsSync(GPATHS.gcceConfig)) {
      const configContent = JSON.parse(readFileSync(
        GPATHS.gcceConfig, GOUTFORMAT.encoding
      ));
      let gcceExists = false;
      for (let f = 0; f < configContent.length; f++) {
        if (configContent[f]?.name === gcceName) {gcceExists = true; break};
      } // checks if the gcce exists

      if (gcceExists) {
        const gcceDuplicate = [];
        let isgcceDuplicate = false;

        for (let d = 0; d <= configContent.length; d++) {
          const elem = configContent[d];
          if (elem?.name === gcceName && gcceDuplicate.includes(elem?.name)) {
            isgcceDuplicate = true
            break;
          } else gcceDuplicate.push(elem?.name);
        } // checks if they are duplicates

        if (isgcceDuplicate) {
          const rl = readLine.createInterface({
            output:process.stdout, 
            input:process.stdin 
          });
          rl.question("Duplicates Found. input a version to remove ", (v)=> {
             const contentEncapsulated = [];
             configContent.forEach(elem => {
               if(elem?.name !== gcceName || elem?.name === gcceName
               && elem?.version !== v) contentEncapsulated.push(elem)
             })
             writeFileSync(GPATHS.gcceConfig, JSON.stringify(contentEncapsulated));
             // ----++++++ If the version wasnt found, gce wont notify you. 
             // run gce gcce to confirm removal +++++++----------
             rl.close();
          });
        } else {
          const contentEncapsulated = [];
          configContent.forEach(elem => {
             if (elem?.name !== gcceName) contentEncapsulated.push(elem)
          });
          writeFileSync(GPATHS.gcceConfig, JSON.stringify(contentEncapsulated));
        }
      } else throw { message: "ABORTED: gcce does not exist" }
    } else throw { message: "ABORTED: no gcce installed" }
  } else {
    let message = "ABORTED: cmd expects only 1 argument: <name_of_gcce>";
    throw { message }
  }
}
