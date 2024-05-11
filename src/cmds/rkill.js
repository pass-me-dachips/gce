import * as readLine from "node:readline/promises";
import { end } from "../spkg/v1.0.0.js";
import { GPATHS, GOUTFORMAT } from "../var/system.js";
import { join } from "node:path";
import { existsAsync } from "../etc/existsAsync.js";
import { readFile, readdir } from "node:fs/promises";

export default async function Rkill() {
  const rl = readLine.createInterface({
     input: process.stdin,
     output: process.stdout
  });
  await rl.question("Hit enter to acknowledge this request ");
  rl.close();

  const services = await existsAsync(GPATHS.serviceLog) ?
     await readdir(GPATHS.serviceLog, GOUTFORMAT.encoding): [];
  if (services.length > 0) {
     for (let i = 0; i < services.length; i++) {
       const serviceId = services[i];
       const servicePath = join(GPATHS.serviceLog, serviceId);
       try {
         if (existsAsync(servicePath)) {
            const sdu = await readFile(servicePath, GOUTFORMAT.encoding);
            await end(JSON.parse(sdu), false);
            console.log(`\x1b[93mkilled service ${serviceId} [success]\x1b[0m`);
         } else console.log(`\x1b[95mcannot find service ${serviceId} [failed]\x1b[0m`);
       } catch { console.log(`\x1b[95mfailed to kill ${serviceId} [failed]\x1b[0m`); }
    }
  } else console.log("no service to kill");
  return void 0;
}