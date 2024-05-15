import { platform } from "node:os";
import { exec } from "node:child_process";
import * as readLine from "node:readline/promises";

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
      output: process.stdout
    });
    const message = "reply (y) to proceed or (x) to abort: ";
    let answer = await rl.question(message);
    while (answer !== "y" && answer !== "x") {
      answer = await rl.question(message);
    };
    rl.close();
    if (answer === "y") exec(start, (error, string)=> {
      if (error) throw error;
      console.log(string);
    });
    else process.exit(0);
  } else {
    let platforms = ["darwin", "freebsd", "linux", "win32", "openbsd"];
    if (platforms.includes(platform())) {
       const LFO = "xdg-open" //linux,freebsd,openbsd
       const proc = {
         darwin: "open",
         freebsd: LFO,
         linux: LFO,
         win32: "start",
         openbsd: LFO,
       };
       exec(`${proc[platform()]} http://localhost:${port}`);
     } 
  }
  return true;
}
// use case => execBrowser({...sdu}, port)
