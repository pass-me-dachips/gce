
"use strict";

import Cache from "../etc/cache.js";
import { createServer } from "node:http";
import execGcce from "./www/execGcce.js";
import handleRequests from "./www/handleRequest.js";
import handleSapiRequests from "./sapi/handleRequests.js";
import { join } from "node:path";
import { SYSTEM, PATHS } from "../var/system.js";
import url from "node:url";
import { WebSocketServer } from "ws";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";

/**
 * @author david, pass-me-dachips
 * @param {object} sdu the service date unit or information about the service
 * @returns {void}
 */
export default function Server(sdu) {
  
  const onServerStart = () => {
     const port = www.address().port;
     const serviceId = `${port}xS${(Math.floor(Math.random() * 100000))}`;
     while (!existsSync(PATHS.serviceLog)) {
       mkdirSync(PATHS.serviceLog, { recursive: true });
     }
     sdu.createdAt = new Date();
     sdu.serviceId = serviceId;
     sdu.servicePort = port;
     sdu.Pid = process.pid;
     const pathToServiceLog = join(PATHS.serviceLog, serviceId);
     writeFileSync(pathToServiceLog, JSON.stringify(sdu,"",4));

     const stdout = [
        `grand code environment(GCE) ${SYSTEM.version}, serviceOptions -:`,
        `${SYSTEM.tabA}\x1b[93mabsolute(0) ${sdu.servicePath}`,
        `${SYSTEM.tabA}temp = ${sdu.isTemporary}\x1b[0m\n`,
        `service gcce options -:`,
        `${SYSTEM.tabA}\x1b[93mabsolute(1) ${sdu.serviceGcce.abs}`,
        `${SYSTEM.tabA}name = ${sdu.serviceGcce.name}, version = ${sdu.serviceGcce.version}\x1b[0m\n`,
        `service NET options -:`,
        `${SYSTEM.tabA}\x1b[93minet = ${www.address().address}/lo, fixed`,
        `${SYSTEM.tabA}family = ${www.address().family}`,
        `${SYSTEM.tabA}port = ${port}, type = registered\x1b[0m\n`,
        `service started running on http://localhost:${port}\n`
     ];
     stdout.forEach(c => console.log(c));
     Cache.handleUpload(pathToServiceLog);
     Cache.handleStackUpload();
     execGcce(sdu.serviceGcce, port);
  };

  const www = createServer((req,res) => {
    let cbParams = sdu.serviceGcce;
    cbParams['serviceId'] = sdu.serviceId;
    handleRequests(req, res, sdu.serviceGcce);
  });
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws) => { handleSapiRequests(ws, sdu) });
 
  www.on("upgrade", (request, socket, head) => {
  const { pathname } = url.parse(request.url);
  if (pathname === "/sapi") {
     wss.handleUpgrade(request, socket, head, (ws) => {
       wss.emit("connection", ws);
     });
   } else socket.destroy();
  });

  www.listen(sdu.servicePort, onServerStart);
} 
