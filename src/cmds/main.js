
"use strict";

import * as readLine from "node:readline";
import { join } from "node:path";
import { PATHS, SYSTEM } from "../var/system.js";
import { promisify } from "node:util";
import { 
   readFileSync,
   mkdirSync, 
   existsSync, 
   statSync
} from "node:fs";
import Server from "../net/server.js";

/** handler for the core start service command
 * @author david, pass-me-dachips
 * @param {Array} args 
 * @returns {void}
 */
export default async function Main(args) {
 try {
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
    console.log(`\x1b[92m\n- WARNING: the port ${port_raw[1]} is forbidden.`);//@log  
    console.log("- ports can only be registered eg 1024 - 49150");//@log  
    console.log("- gce would choose a random port in this case. \x1b[0m");//@log  
    servicePort  = 0;
 } //----------handle port options

 if (serviceOptions.includes("--temp")) {
   isTemporary = true;
   serviceType = "DIR";
    while (!existsSync(PATHS.tServices)) {
       mkdirSync(PATHS.tServices, { recursive: true })
    }
    let tempID = servicePort + Math.round(Math.random() * 100000);
    let fileName = args[0].replaceAll("/", "").replaceAll(":", "");
    servicePath = join(PATHS.tServices, `TMP${tempID}-${fileName}`);
    while (existsSync(servicePath)) {
      tempID += Math.round(Math.random() * 12);
      /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
       *  The snippet above makes address conflict(two temporary directories sharing)
       *  the same address imposible, by iteratively checking if the randomly chosen 
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

 console.log(`\x1b[94m\nstart ${args[0]}, service-type=<${serviceType}>\x1b[0m`); 
 //@log  

 const gcces = existsSync(PATHS.gcceConfig) && 
  JSON.parse(readFileSync(PATHS.gcceConfig, SYSTEM.encoding));

 if (typeof gcces === "object" && gcces.length > 0) {
    let gconfigContent = existsSync(PATHS.globalConfig) ?
      JSON.parse(readFileSync(PATHS.globalConfig, SYSTEM.encoding)) : {};
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
         console.log("\n- you have multiple gcce's installed"); //@log  
         gcces.forEach(elem => {
           console.log(
             `${SYSTEM.tabA}name ${`\x1b[36m${elem.name}\x1b[0m`}, version ${`\x1b[33m${elem.version}\x1b[0m`}`
           )
         })
         const rl = readLine.createInterface({
             output: process.stdout, input: process.stdin
         })
         let rlAsync = promisify(rl.question).bind(rl);
         const prompt = "- specify a gcce and its version in which you want to use eg = <gccename>,<version> "
         let gcceNV = await rlAsync(prompt); //NV as in name, version
         const gcceSelected = (gcceNV) => {
            let gcce = gcces.find(elem => elem?.name === gcceNV?.split(",")[0] && 
            elem?.version === gcceNV?.split(",")[1])
            return gcce;
         }
         while (!gcceSelected(gcceNV)) { gcceNV = await rlAsync(prompt); }
         rl.close();
         serviceGcce = gcceSelected(gcceNV);
       }
    } //+++++ function that determines the gcce to use.

    if (isconfigForDir) {
      const localconfigpath = join(servicePath, "gceconfig.json");
      if (existsSync(localconfigpath)) { gconfigContent =
          JSON.parse(readFileSync(localconfigpath, SYSTEM.encoding)) ?? {};}
      /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      *** if the service has a gceconfig.json file in its root, then 
      *** let gconfigContent be its content instead of the global config content.
      ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    }

    const defaultKey = "default";
    if (defaultKey in gconfigContent === false) await specifyGcce();
    else if (defaultKey in gconfigContent && findGcce(gconfigContent.default) !== null) 
    { serviceGcce = findGcce(gconfigContent.default) } 
    else throw {
      message: `gcce <${gconfigContent?.default ?? "NULL"}> not found!`
    }

    console.log("\x1b[93m\n~ Published at %s, Copyright (c) 2024 by David.A", SYSTEM.releaseDate);//@log
    console.log("~ Official repository at: https://github.com/pass-me-dachips/gce");//@log   
    console.log("~ Hint: run gce --help to see all available commands and options\n\x1b[0m");//@log  

   Server({
     servicePath,
     serviceType,
     isTemporary,
     serviceGcce,
     servicePort,
     gconfigContent
    }); //++++++++++ pass control to the server
  } else throw { message: "no gcce installed" }
 } catch(error) {
   console.log(error.message);
 }
}
