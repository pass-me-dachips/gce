
"use strict";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { hmr } from "../spkg/v1.0.0.js";
import { join } from "node:path";
import ping from "../local/services/pingServer.js";
import { SYSTEM, PATHS } from "../var/system.js";

function s1() {
  const services =  existsSync(PATHS.serviceLog) ?
  readdirSync(PATHS.serviceLog, SYSTEM.encoding) : [];
  if (services.length !== 0) {
    const servicesFound = services.length;
    console.log(`pinging (${servicesFound}) service${servicesFound > 1 ? "s": ""} (ghosts inclusive):`);
    console.log('services currently running')
    const cb = (pong, elem) => {
      if (pong !== null && pong === elem) {console.log(SYSTEM.tabA +  elem)};
    }
    services.forEach((elem) => { ping(elem, cb) });
  } else { console.log("no running service"); }
  return void 0;
}

function s2() {
  console.log("listing services (ghosts exclusive)");
  const services =  existsSync(PATHS.serviceLog) ?
  readdirSync(PATHS.serviceLog, SYSTEM.encoding).reverse() : [];
  let Index = 0;
  const cb = (pong, elem) => {
    if (pong !== null && pong === elem) {
      Index = Index + 1;
      const servicePath = join(PATHS.serviceLog, elem);
      const serviceDetails = 
        JSON.parse(readFileSync(servicePath, SYSTEM.encoding));
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

      console.log(`service (${Index})`);
      console.log( SYSTEM.tabA + `port ${port}, id ${id}, temp ${isTemp}`);
      console.log( SYSTEM.tabA + `gcce ${gcce}, v ${version}, cat ${createdAt}`);
      console.log( SYSTEM.tabA + `pid ${Pid}, s-mem ${mem}, r-mem ${tmem} \n`);
    }
  }
  for (let i = 0; i < services.length; i++) {
    const elem = services[i];
    ping(elem, cb);
  }
  if (services.length > 0) {
  console.log("\x1b[93ms-mem > total memory currently used by the service.\x1b[0m");
  console.log("\x1b[96mr-mem > total memory currently used by the runtime including the s-mem, v8 engine, external components etc.\x1b[0m");
  }
  return void 0;
}

function s3(serviceId) {
  const servicePath = join(PATHS.serviceLog, serviceId);
  const cb = (pong) => {
  if (pong !== null && pong === serviceId && existsSync(servicePath)) {
    const serviceDetails = 
      JSON.parse(readFileSync(servicePath, SYSTEM.encoding));
    const {
      servicePort:port,
      serviceId: id,
      servicePath: path,
      serviceType: type,
      createdAt,
      isTemporary: isTemp,
      Pid,
      uptime,
      idleSince
    } = serviceDetails;
    const gcce = serviceDetails.serviceGcce.name;
    const version = serviceDetails.serviceGcce.version;
    const mem = serviceDetails?.memUsage?.heapUsed ?
       hmr(serviceDetails?.memUsage?.heapUsed) : "no records";
    const tmem = serviceDetails?.memUsage?.rss ?
    hmr(serviceDetails?.memUsage?.rss) : "no records";
    const bw = serviceDetails?.fs?.total_bytes_written ?
       hmr(serviceDetails?.fs?.total_bytes_written) : "no records";
    const bd = serviceDetails?.fs?.total_bytes_dropped ?
       hmr(serviceDetails?.fs?.total_bytes_dropped) : "no records";
    const dw = serviceDetails?.fs?.total_dirs_written ?
       serviceDetails?.fs?.total_dirs_written : "no records";
    const dd = serviceDetails?.fs?.total_dirs_dropped ?
       serviceDetails?.fs?.total_dirs_dropped : "no records";
    console.log(`service (${id})`);
    console.log( SYSTEM.tabA + `port = \x1b[92m${port}\x1b[0m, id = \x1b[92m${id}\x1b[0m, temp = \x1b[92m${isTemp}\x1b[0m`);
    console.log( SYSTEM.tabA + `path = \x1b[92m${path}\x1b[0m, type = \x1b[92m${type}\x1b[0m`);
    console.log( SYSTEM.tabA + `gcce = \x1b[92m${gcce}\x1b[0m, v = \x1b[92m${version}\x1b[0m, cat = \x1b[92m${createdAt}\x1b[0m`);
    console.log( SYSTEM.tabA + `total bytes-written \x1b[92m(${bw})\x1b[0m, total bytes-dropped \x1b[92m(${bd})\x1b[0m`);
    console.log( SYSTEM.tabA + `total dirs-written \x1b[92m(${dw})\x1b[0m, total dirs-dropped \x1b[92m(${dd})\x1b[0m`);
    console.log( SYSTEM.tabA + `uptime = \x1b[92m${uptime ?? "no records"}\x1b[0m, idle-since = \x1b[92m${idleSince ?? "no records"}\x1b[0m`);
    console.log( SYSTEM.tabA + `pid = \x1b[92m${Pid}\x1b[0m, s-mem = \x1b[92m${mem}\x1b[0m, r-mem = \x1b[92m${tmem}\x1b[0m \n`);
  } else console.log("service %s does not exists", serviceId)
  }
  ping(serviceId, cb);
}

/** handler for the services command
 * @author david, pass-me-dachips
 * @param {Array} args
 * @returns {void}
 */
export default function Services(args) {
  args = args.slice(1);
  if (args.length === 0) s1();
  else if(args[0] === "-x") s2();
  else if(args[0] === "-s" && args[1]) s3(args[1]);
  else throw { message: "invalid sub-command recieved" }
}
