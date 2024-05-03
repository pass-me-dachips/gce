/* ==================================++++++++++++++++++++++++++++++++++++++======
   in this file, gconfigContent referes to either the content of the global
   config file, the content of the localconfigfile: gceconfig.json or {}.
   errors occuring in this file are caugth by the global error handler.
   ==============++++++++++++++++++++++++++++++==================================
*/
import { join } from "node:path";
import { 
   readFileSync,
   mkdirSync, 
   existsSync, 
   statSync
} from "node:fs";
import * as readLine from "node:readline/promises";
import { GOUTFORMAT, GPATHS } from "../var/system.js";
import Server from "../net/server.js";

export default async function Main(args) {
 const serviceOptions = args.slice(1);
 let servicePath = join(process.cwd(), args[0]);
 let isTemporary;
 let serviceGcce;
 let servicePort;
 let serviceType;
 //+++++++++++++++++ variables +++++++++++


 let port_raw = serviceOptions.find(elem => elem.startsWith("--port"))?.split(":");
 if (port_raw === undefined || port_raw.length !== 2){ servicePort = 0 }
 else if( Number(port_raw[1]) > 1023 && Number(port_raw[1]) < 49151 ) {
     servicePort  = Number(port_raw[1]);
 } else { 
    console.log(`\x1b[32;1mWARNING: the port ${port_raw[1]} is forbidden.`);//@log  
    console.log("ports can only be registered eg 1024 - 49150");//@log  
    console.log("gce would choose a random port in this case. \x1b[0m");//@log  
    servicePort  = 0;
 } //----------handle port options

 if (serviceOptions.includes("--temp")) {
   isTemporary = true;
   serviceType = "DIR";
    while (!existsSync(GPATHS.tServices)) {
       mkdirSync(GPATHS.tServices, { recursive: true })
    }
    let tempID = servicePort + Math.round(Math.random() * 100000);
    let fileName = args[0].replaceAll("/", "").replaceAll(":", "");
    servicePath = join(GPATHS.tServices, `TMP${tempID}-${fileName}`);
    while (existsSync(servicePath)) {
      tempID += Math.round(Math.random() * 12);
      /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
       *  The snippet above makes address conflict(two temporary directories sharing)
       *  the same address imposible, by iteratively checking if the randomly chossen 
       *  path name exists  ++++++++++++++++++++++++++++++++++++++++++++++++++****/
    }
    mkdirSync(servicePath); //------handle temp path if enabled  
 } else { 
    isTemporary = false;
    if (existsSync(servicePath)) {
      serviceType = statSync(servicePath).isDirectory() ? "DIR" : "FILE";
    } else { serviceType = "DIR"; mkdirSync(servicePath, { recursive: true}) }
    //+++++++++++ creates the path as a dir if it doesnt exists.
  }

 console.log(`start ${args[0]}, service-type=<${serviceType}>`); //@log  

 const gcces = existsSync(GPATHS.gcceConfig) && 
  JSON.parse(readFileSync(GPATHS.gcceConfig, GOUTFORMAT.encoding));

 if (typeof gcces === "object" && gcces.length > 0) {
    let gconfigContent = existsSync(GPATHS.globalConfig) ?
      JSON.parse(readFileSync(GPATHS.globalConfig, GOUTFORMAT.encoding)) : {};
    //=+++++++ gconfigContent as in globalConfig

    const isconfigForDir = serviceType === "DIR" && !isTemporary;

    const findGcce = (name)  => {
       const gcce = gcces.find(elem => elem.name === name);
       if (gcce) return gcce
       else return null
    }

    const specifyGcce = async () => {
       if (gcces.length === 1) { serviceGcce = gcces[0]; } 
       else {
         console.log("you have multiple gcce's installed"); //@log  
         gcces.forEach(elem => {
           console.log(
             `${GOUTFORMAT.tabA}name ${`\x1b[36m${elem.name}\x1b[0m`}, version ${`\x1b[33m${elem.version}\x1b[0m`}`
           )
         })
         const rl = readLine.createInterface({
             output: process.stdout, input: process.stdin
         })
         const prompt = "specify a gcce and its version eg = <gccename>,<version> "
         let gcceNV = await rl.question(prompt); //NV as in name, version
         const gcceSelected = (gcceNV) => {
            let gcce = gcces.find(elem => elem?.name === gcceNV?.split(",")[0] && 
            elem?.version === gcceNV?.split(",")[1])
            return gcce;
         }
         while (!gcceSelected(gcceNV)) { gcceNV = await rl.question(prompt); }
         rl.close();
         serviceGcce = gcceSelected(gcceNV);
       }
    } //+++++ function that determines the gcce to use.

    if (isconfigForDir) {
      const localconfigpath = join(servicePath, "gceconfig.json")
      if (existsSync(localconfigpath)) { gconfigContent =
          JSON.parse(readFileSync(localconfigpath, GOUTFORMAT.encoding)) ?? {};}
      /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      *** if the service has a gceconfig.json file in its root, then 
      *** let gconfigContent be its content instead of the global config content.
      ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    }

    const defaultKey = "def";
    if (defaultKey in gconfigContent === false) await specifyGcce();
    else if (defaultKey in gconfigContent && findGcce(gconfigContent.def) !== null) 
    { serviceGcce = findGcce(gconfigContent.def) } 
    else throw {
      message: `ABORTED: gcce <${gconfigContent?.def ?? "NULL"}> not found!`
    }

   Server({
     servicePath,
     serviceType,
     isTemporary,
     serviceGcce,
     servicePort,
     gconfigContent
    }); //++++++++++ pass control to the server
 } else throw { message: "ABORTED: no gcce installed." }
}
