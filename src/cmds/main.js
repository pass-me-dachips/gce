/* ==================================++++++++++++++++++++++++++++++++++++++======
   in this file, globalConfigContent referes to either the content of the global
   config file, the content of the localconfigfile: gceconfig.json or {}.
   errors occuring in this file are caugth by the global error handler.
   ==============++++++++++++++++++++++++++++++==================================
*/
import { join } from "node:path";
import { 
   writeFileSync, 
   mkdirSync, 
   existsSync, 
   statSync
} from "node:fs";
import * as readLine from "node:readline/promises";
import { GOUTFORMAT, GPATHS } from "../var/system.js";
// import Server from "../net/server.js";

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
    console.log(`\x1b[32;1mWARNING: the port ${port_raw[1]} is forbidden.`);
    console.log("ports can only be registered eg 1024 - 49150");
    console.log("gce would choose a random port in this case. \x1b[0m");
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
    if (existsSync(servicePath)) {
      serviceType = statSync(servicePath).isDirectory() ? "DIR" : "FILE";
    } else { serviceType = "DIR"; mkdirSync(servicePath, { recursive: true}) }
    //+++++++++++ creates the path as a dir if it doesnt exists.
  }


  console.log(servicePath, serviceType)

  
//  console.log(`start ${args[0]}, service-type=<${serviceType}>`);

 
//  const gcceConfigContent = existsSync(GPATHS.gcceConfig) && 
//   JSON.parse(readFileSync(GPATHS.gcceConfig, GOUTFORMAT.encoding))

//  if (typeof gcceConfigContent === "object" && gcceConfigContent.length > 0) {
//     let globalConfigContent = existsSync(GPATHS.globalConfig) ?
//       JSON.parse(readFileSync(GPATHS.globalConfig, GOUTFORMAT.encoding)) : {}

//     const ignoreLocalGcceConfigFORFILE = serviceType === "FILE" || isTemporary 
//     const isGceConfigForDir = serviceType === "DIR" && !isTemporary

//     const ingcceConfig = (def)  => {
//        const gcce = gcceConfigContent.find(elem => elem.name === def)
//        if (gcce) return gcce 
//        else return null
//     }

//     const specifyGcce = async () => {
//        if (gcceConfigContent.length === 1) {
//          serviceGcce = gcceConfigContent[0];
//        } else {
//          console.log("gce spotted multiple gcce's installed");
//          gcceConfigContent.forEach(elem => {
//            console.log(
//             `${GOUTFORMAT.tabA}name ${`\x1b[36m${elem.name}\x1b[0m`}, version ${`\x1b[33m${elem.version}\x1b[0m`}`
//            )
//          })
//          const rl = readLine.createInterface({
//            output: process.stdout, input: process.stdin
//         })
//         const q = "Specify a gcce and its version eg = <gccename>,<version> "
//         let answer = await rl.question(q);
//         const gcceSelected = (ans) => {
//           let gcce  = gcceConfigContent.find(
//             elem => elem?.name === ans?.split(',')[0] && 
//             elem?.version === ans?.split(',')[1])
//           return gcce;
//         }
//         while (!gcceSelected(answer)) {
//            answer = await rl.question(q);
//         }
//         rl.close();
//         serviceGcce = gcceSelected(answer);
//        }
//     }

//     // handle gcce options 
//     if (ignoreLocalGcceConfigFORFILE || isGceConfigForDir) {
//       if (isGceConfigForDir) {
//       const localconfigpath = join(servicePath,'gce.config.json')
//       if (existsSync(localconfigpath)) globalConfigContent =
//         JSON.parse(readFileSync(localconfigpath, GOUTFORMAT.encoding)) ?? {}
//       }

//       if ("def" in globalConfigContent === false) await specifyGcce()
//       else if ("def" in globalConfigContent && 
//         ingcceConfig(globalConfigContent.def) !== null) 
//            serviceGcce = ingcceConfig(globalConfigContent.def)
//        else throw {
//          message: `ABORTED: gcce <${globalConfigContent?.def ?? "NULL"}> not found!`
//         }
//     } // handle gcce options 

//     await Server({
//        servicePath,
//        serviceType,
//        buffering,
//        ccEnabled,
//        isTemporary,
//        servicePort,
//        serviceGcce,
//        globalConfigContent
//     });
//     //  pass control to the server
//  } else throw { message: "ABORTED: no gcce installed. "}
}