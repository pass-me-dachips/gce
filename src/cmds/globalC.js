"use strict";

import * as readLine from "node:readline";
import { execSync } from "node:child_process";
import { globalConfigTemplate } from "../var/templates.js";
import { join } from "node:path";
import { PATHS, SYSTEM } from "../var/system.js";
import { platform as Platform } from "node:os";
import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from "node:fs";

/**
 * handler for the globalConfig command
 * @author david, super-user-d0
 * @param {string} cwd
 * @returns {void}
 */
export default function GlobalC(cwd) {
  const TEMPFILENAME = "SETCONFIG.json";
  const TEMPFILE = join(cwd, TEMPFILENAME);
  while (!existsSync(PATHS.configDir)) {
    mkdirSync(PATHS.configDir);
  }
  const prevConfig = existsSync(PATHS.globalConfig)
    ? JSON.parse(readFileSync(PATHS.globalConfig, SYSTEM.encoding))
    : null;

  writeFileSync(
    TEMPFILE,
    JSON.stringify(prevConfig ? prevConfig : globalConfigTemplate, null, 2),
    SYSTEM.encoding
  );

  console.log("## gce created a temporary file: SETCONFIG.json in your cwd");
  console.log("## specify your desired configurations in that file.");
  console.log(
    "\x1b[92m## avoid making any JSON related errors when writing to the SETCONFIG.json file"
  );
  console.log("## as gce would be unable to parse the file ANYMORE.\x1b[0m");
  console.log(
    "\x1b[95m## in that case, run `gce resetGlobalConfig` to reset the global configurations\x1b[0m"
  );

  const platform = Platform();
  const updateConfigChanges = () => {
    const SETCONFIGcontent = readFileSync(TEMPFILE, SYSTEM.encoding);
    writeFileSync(PATHS.globalConfig, SETCONFIGcontent, SYSTEM.encoding);
    rmSync(TEMPFILE);
  };

  if (platform === "darwin") {
    execSync(`open ${TEMPFILE}`);
    updateConfigChanges();
  } else if (platform === "linux") {
    execSync(`xdg-open ${TEMPFILE}`);
    updateConfigChanges();
  } else if (platform === "win32") {
    execSync(`start ${TEMPFILE}`);
    updateConfigChanges();
  } else {
    //assumes platform is android
    console.log(`\n~ platform = ${platform}`);
    console.log(`~ cannot launch the ${TEMPFILE} on your default text editor.`);
    console.log(
      `~ navigate to the file manually and make your configurations.`
    );
    const rl = readLine.createInterface({
      output: process.stdout,
      input: process.stdin,
    });
    rl.question("~ Hit enter to confirm completation ", () => {
      rl.close();
      updateConfigChanges();
    });
  }
}
