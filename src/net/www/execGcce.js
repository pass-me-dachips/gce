"use strict";

import * as readLine from "node:readline";
import { exec } from "node:child_process";
import { platform } from "node:os";
import { promisify } from "node:util";
import { supportedPlatforms } from "../../var/osPaths.js";

/** a function that handles the gcce start script and execution
 * @author david, pass-me-dachips
 * @param {object} sdu the service data unit
 * @param {string} port the service port
 */
export default async function execBrowser(sdu, port) {
  if ("start" in sdu && sdu.start !== "default") {
    let { start, name, version } = sdu;
    start = start.replaceAll("{PORT}", port);
    console.log(
      `${name} v${version} uses a different start script which might not be trusted.`
    );
    console.log(`start script > \x1b[92m${start}\x1b[0m`);
    const rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const message = "reply (y) to proceed or (x) to abort: ";
    let rlAsync = promisify(rl.question).bind(rl);
    let answer = await rlAsync(message);
    while (answer !== "y" && answer !== "x") {
      answer = await rlAsync(message);
    }
    rl.close();
    if (answer === "y")
      exec(start, (error, string) => {
        if (error) throw error;
        console.log(string);
      });
    else process.exit(0);
  } else {
    if (supportedPlatforms.includes(platform())) {
      const proc = {
        android: "",
        linux: "xdg-open",
        darwin: "open",
        win32: "start",
      };
      exec(`${proc[platform()]} http://localhost:${port}`);
    }
  }
  return true;
}
// use case => execBrowser({...sdu}, port)
