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

function s3(serviceId) {
  const servicePath = join(GPATHS.serviceLog, serviceId);
  if (existsSync(servicePath)) {
    const serviceDetails = 
      JSON.parse(readFileSync(servicePath, GOUTFORMAT.encoding));
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
    console.log( GOUTFORMAT.tabA + `port = \x1b[92m${port}\x1b[0m, id = \x1b[92m${id}\x1b[0m, temp = \x1b[92m${isTemp}\x1b[0m`);
    console.log( GOUTFORMAT.tabA + `path = \x1b[92m${path}\x1b[0m, type = \x1b[92m${type}\x1b[0m`);
    console.log( GOUTFORMAT.tabA + `gcce =  \x1b[92m${gcce}\x1b[0m, v = \x1b[92m${version}\x1b[0m, cat = \x1b[92m${createdAt}\x1b[0m`);
    console.log( GOUTFORMAT.tabA + `ttal bytes-written \x1b[92m(${bw})\x1b[0m, ttal bytees-dropped \x1b[92m(${bd})\x1b[0m`);
    console.log( GOUTFORMAT.tabA + `ttal dirs-written \x1b[92m(${dw})\x1b[0m, ttal dirs-dropped \x1b[92m(${dd})\x1b[0m`);
    console.log( GOUTFORMAT.tabA + `uptime = \x1b[92m${uptime}\x1b[0m, idle-since = \x1b[92m${idleSince}\x1b[0m`);
    console.log( GOUTFORMAT.tabA + `pid = \x1b[92m${Pid}\x1b[0m, s-mem = \x1b[92m${mem}\x1b[0m, r-mem = \x1b[92m${tmem}\x1b[0m \n`);
  } else console.log("service %s does not exists", serviceId)
}

export default function Services(args) {
  args = args.slice(1);
  if (args.length === 0) s1();
  else if(args[0] === "-x") s2();
  else if(args[0] === "-s" && args[1]) s3(args[1]);
  else throw { message: "ABORTED: invalid option recieved" }
}
