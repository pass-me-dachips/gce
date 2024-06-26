"use strict";

import Cache from "../etc/cache.js";
import { code_1 } from "./sapi/codes.js";
import cors from "cors";
import { createServer } from "node:http";
import execGcce from "./www/execGcce.js";
import { join } from "node:path";
import serviceApi from "./cbs/coreapi.js";
import serviceUtil from "./cbs/coreutils.js";
import { SYSTEM, PATHS } from "../var/system.js";
import { URL } from "node:url";
import webServer from "./cbs/ws.js";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";

/**
 * @param {object} sdu - The service data unit or information about the service
 * @returns {void}
 */
export default function Server(sdu) {
  const onServerStart = () => {
    const port = server.address().port;
    const serviceId = `${port}xS${Math.floor(Math.random() * 100000)}`;
    while (!existsSync(PATHS.serviceLog)) {
      mkdirSync(PATHS.serviceLog, { recursive: true });
    }
    sdu.createdAt = new Date();
    sdu.serviceId = serviceId;
    sdu.servicePort = port;
    sdu.Pid = process.pid;
    const pathToServiceLog = join(PATHS.serviceLog, serviceId);
    writeFileSync(pathToServiceLog, JSON.stringify(sdu, "", 4));
    const stdout = [
      `grand code environment(GCE) ${SYSTEM.version}, serviceOptions -:`,
      `${SYSTEM.tabA}\x1b[93mabsolute(0) ${sdu.servicePath}`,
      `${SYSTEM.tabA}temp = ${sdu.isTemporary}`,
      `${SYSTEM.tabA}serviceId = ${serviceId}\x1b[0m\n`,
      `service gcce options -:`,
      `${SYSTEM.tabA}\x1b[93mabsolute(1) ${sdu.serviceGcce.path}`,
      `${SYSTEM.tabA}name = ${sdu.serviceGcce.name}, version = ${sdu.serviceGcce.version}\x1b[0m\n`,
      `service NET options -:`,
      `${SYSTEM.tabA}\x1b[93minet = ${server.address().address}/lo, fixed`,
      `${SYSTEM.tabA}family = ${server.address().family}`,
      `${SYSTEM.tabA}port = ${port}, type = registered\x1b[0m\n`,
      `service started running on http://localhost:${port}\n`,
    ];
    stdout.forEach((c) => console.log(c));
    Cache.handleUpload(pathToServiceLog);
    Cache.handleStackUpload();
    execGcce(sdu.serviceGcce, port);
  };

  const handleCors = cors();

  const cb = async (req, res) => {
    const fullurl = `http://${req.headers.host}${req.url}`;
    const { pathname, search, searchParams } = new URL(fullurl);
    const notstatic = req.headers?.notstatic === "true";

    let payload = "";
    req.on("data", (chunk) => {
      payload += chunk;
    });

    req.on("end", () => {
      try {
        if (payload) payload = JSON.parse(payload);
        const method = req.method;
        const dataunit = {
          ...sdu,
          method,
          paths: pathname,
          query: search,
          searchParams,
          payload: method !== "GET" && method !== "HEAD" ? payload : null,
        };
        delete dataunit.serviceGcce;
        if (notstatic && pathname.startsWith("/coreapi")) {
          serviceApi(req, res, dataunit);
        } else if (notstatic && pathname.startsWith("/coreutils")) {
          serviceUtil(res, dataunit);
        } else {
          let cbParams = sdu.serviceGcce;
          cbParams["serviceId"] = sdu.serviceId;
          cbParams["url"] = pathname;
          webServer(res, cbParams, pathname);
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(code_1(error.message)));
      }
    });
  };

  const server = createServer((req, res) => {
    handleCors(req, res, () => cb(req, res));
  });

  server.listen(sdu.servicePort, onServerStart);
}
