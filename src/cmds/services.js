import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { GOUTFORMAT, GPATHS } from "../var/system.js";
import { hmr } from "../spkg/v1.0.0.js";

function s1() {
  const services =  existsSync(GPATHS.serviceLog) ?
  readdirSync(GPATHS.serviceLog, GOUTFORMAT.encoding) : [];
  services.forEach((elem, index) => {
    process.stdout.write(
       GOUTFORMAT.tabA + (index+1 === services.length ? elem+'\n' : elem)
    );
  });
  return void 0;
}

function s2() {
  const services =  existsSync(GPATHS.serviceLog) ?
  readdirSync(GPATHS.serviceLog, GOUTFORMAT.encoding).reverse() : [];
  for (let i = 0; i < services.length; i++) {
    const servicePath = join(GPATHS.serviceLog, services[i]);
    const serviceDetails = 
      JSON.parse(readFileSync(servicePath, GOUTFORMAT.encoding));
    const {
      servicePort:port,
      serviceId: id,
      createdAt,
      isTemporary: isTemp,
      Pid
    } = serviceDetails;
    const gcce = serviceDetails.serviceGcce.name;
    const version = serviceDetails.serviceGcce.version;
    const mem = serviceDetails?.memUsage?.heapUsed ?
       hmr(serviceDetails?.memUsage?.heapUsed) : "no records";
    const tmem = serviceDetails?.memUsage?.rss ?
       hmr(serviceDetails?.memUsage?.rss) : "no records";

    console.log(`service (${i})`);
    console.log( GOUTFORMAT.tabA + `port ${port}, id ${id}, temp ${isTemp}`);
    console.log( GOUTFORMAT.tabA + `gcce ${gcce}, v ${version}, cat ${createdAt}`);
    console.log( GOUTFORMAT.tabA + `pid ${Pid}, s-mem ${mem}, r-mem ${tmem} \n`);
  }
  if (services.length > 0) {
  console.log("\x1b[93ms-mem > total memory currently used by the service.\x1b[0m");
  console.log("\x1b[96mr-mem > total memory currently used by the runtime including the s-mem, v8 engine, external components etc.\x1b[0m");
  }
  return void 0;
}

export default function Services(args) {
  args = args.slice(1);
  if (args.length === 0) s1();
  else if(args[0] === "-x") s2();
  else if(args[0] === "-s" && args[1]) {
     console.log("specific gce service");
     // a specific gce service and all its info is listed.
  } else {
    let message = "ABORTED: invalid option recieved";
    throw { message }
  }
}