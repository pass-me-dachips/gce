
import { createServer } from "node:http";
import handleRequests from "./www/handleRequest";
// import { WebSocketServer } from "ws";
// import { GSYSTEM, GOUTFORMAT, GPATHS } from "../var/system.js";
// import { writeFileSync, existsSync, mkdirSync } from "node:fs";
// import { join } from "node:path";
// import wcb from "./web/wcb.js";
// import execBrowser from "./web/openBrower.js";
// import { randomUUID } from "node:crypto"
// import SAPI from "./api/sapi.js"; //SAPI as in service API
// import url from "node:url";

export default function Server(options) {
//   console.log(options)
//   let LOGID;
  const onServerStart = () => {
//     // i/o in this cb are handled synchronously on purpose.
//     LOGID = `${webserver.address().port}xS${(Math.floor(Math.random() * 100000))}`
//     const serviceLogPath = join(GPATHS.tempDir, "SERVICELOG");
//     while (!existsSync(serviceLogPath)) {
//        mkdirSync(serviceLogPath, {recursive: true});
//     }
//     writeFileSync(join(serviceLogPath, LOGID), JSON.stringify(options, "", 4));
//     const launchMessage = 
//       `grand code environment(GCE) ${GSYSTEM.version}, serviceOptions ->`;
//     console.log(launchMessage);
//     console.log(`${GOUTFORMAT.tabA}absolute(0) ${options.servicePath}`);
//     if (options.ccEnabled) console.log(
//       `${GOUTFORMAT.tabA}buffering = ${options.buffering.enabled}, locked = ${options.buffering.locked}`
//     );
//     console.log(`${GOUTFORMAT.tabA}temp = ${options.isTemporary}`);
//     console.log("service gcce options ->");
//     console.log(`${GOUTFORMAT.tabA}absolute(1) ${options.serviceGcce.abs}`);
//     console.log(`${GOUTFORMAT.tabA}name = ${options.serviceGcce.name}, version = ${options.serviceGcce.version}`);
//     console.log("service NET options ->");
//     console.log(`${GOUTFORMAT.tabA}inet = ${webserver.address().address}/fixed`);
//     console.log(`${GOUTFORMAT.tabA}family = ${webserver.address().family}`);
//     console.log(`${GOUTFORMAT.tabA}port = ${webserver.address().port}, type = registered`);
//     console.log("\x1b[1;93m[-]\x1b[0m service started.");
//     if (options.ccEnabled) 
//         console.log(
//          `\x1b[1;93m[-]\x1b[0m \x1b[1;93mYour cc password is ${CCPASSWORD}\x1b[0m`
//     )
//     // execBrowser(`http://localhost:${webserver.address().port}`);
  }

  const www = createServer((req,res) => handleRequests(req, res, options));
//   const wss = new WebSocketServer({ noServer: true });

//   wss.on("connection", async  (ws,req) => {
//   options.netIp = (req.headers["x-forwarded-for"]||req.socket.localAddress),
//   options.serviceId = LOGID
//   await SAPI(ws, req, options)
//   })
 
//   webserver.on("upgrade", async (request, socket, head) => {
//   const requestUrl = request.url;
//   const { pathname, query } = url.parse(requestUrl);
//   const key = query && query.split("&")[0].split("=");
//   const netIp = request.headers["x-forwarded-from"]||request.socket.localAddress;
//   if (pathname === "/sapi") {
//     if (options.ccEnabled && !request.socket.remoteAddress === netIp) {
//       if (CCPASSWORD === (key ?? [0,0])[1]) {
//         console.log(`accepted CONNECTION from ${netIp}`);
//       } else {
//         console.log(`\x1b[92mDESTROYED CONNECTION from ${netIp}. \x1b[0m`);
//         socket.destroy();
//       }
//     }
//     wss.handleUpgrade(request, socket, head, (ws, request) => {
//       wss.emit("connection", ws, request);
//     });
//   } else socket.destroy();
//   });

  www.listen(options.servicePort, onServerStart);
} 
