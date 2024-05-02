import { TglobalConfig } from "../var/templates.js";
import { GPATHS, GOUTFORMAT } from "../var/system.js";
import { writeFileSync, existsSync, mkdirSync, readFileSync, rmSync} from "node:fs";
import * as readLine from "node:readline";

export default function GlobalC() {
  const TEMPFILENAME = "SETCONFIG.json";
  while (!existsSync(GPATHS.configDir)) {
     mkdirSync(GPATHS.configDir);
  }
  while (!existsSync(GPATHS.globalConfig)) {
     writeFileSync(
       GPATHS.globalConfig, 
       JSON.stringify(TglobalConfig), 
       GOUTFORMAT.encoding
     );
  }
  writeFileSync(TEMPFILENAME, JSON.stringify(
    JSON.parse(readFileSync(GPATHS.globalConfig, GOUTFORMAT.encoding)), "", 2
  ));
  console.log("## Gce created a temporary file: SETCONFIG.json in your cwd");
  console.log("## Specify your configurations in that file.");
  console.log(
    "\x1b[1;33m## Do not make any JSON related bug when writing to temp SETCONFIG.json"
  );
  console.log("## As Gce would not be able to parse the file Anymore.\x1b[0;0m");
  console.log("\x1b[1;36m## In this case, Run `gce resetGlobalConfig` to reset the globalConfig\x1b[0;0m");

  const rl = readLine.createInterface({output:process.stdout, input:process.stdin });
  rl.question("Press enter to continue ", ()=> {
    rl.close();
    const SETCONFIGcontent = readFileSync(TEMPFILENAME);
    writeFileSync(GPATHS.globalConfig, SETCONFIGcontent);
    rmSync(TEMPFILENAME);
  });
}
