import { end } from "../spkg/v1.0.0.js";
import { GPATHS, GOUTFORMAT } from "../var/system.js";
import { join } from "node:path";
import { readdirSync, readFileSync, existsSync } from "node:fs";

export default async function Kill(args) {
  if (args.length === 1) {
    const services = readdirSync(GPATHS.serviceLog, GOUTFORMAT.encoding).length;
    console.log(
      `assass1n: ${services} target${services > 1 ? "s": ""}, ${services} ready to be killed.`
    );
    return void 0;
  } else { 
    const serviceId = args[1];
    const servicePath = join(GPATHS.serviceLog, serviceId);
    if (existsSync(servicePath)) {
      try {
      const sdu = readFileSync(servicePath, GOUTFORMAT.encoding);
      await end(JSON.parse(sdu), false, false, true);
      } catch { console.log("kill ESRCH: ghost removed.") }
    } else console.log("cannot find service %s", serviceId);
    return void 0;
  }
}
