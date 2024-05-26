"use strict";

import { SYSTEM } from "../../var/system.js";
import { request } from "node:http";

/**
 * ping a service to test its avaialabilty
 * @author david, pass-me-dachips
 * @param {string} serviceId the service id
 * @param {function(string | null, string)} cb a function that is called when the pinging stops
 * regarless of wether it was successful or not. the cb should expect 2 arguments. the serviceReply and
 * serviceId arguments. if successful the serviceReply argument would be the serviceId, else null
 * @returns {void}
 */
export default function ping(serviceId, cb) {
  let serviceReply;
  try {
    const options = {
      host: "localhost",
      port: serviceId.split("x")[0],
      path: "/coreutils/ping",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": 0,
        notstatic: true,
      },
    };
    const req = request(options, (res) => {
      res.setEncoding(SYSTEM.encoding);
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) serviceReply = data;
        else serviceReply = null;
      });
    });
    req.on("error", () => {
      serviceReply = null;
    });
    req.end();
    req.on("close", () => cb(serviceReply, serviceId));
    return void 0;
  } catch (error) {
    serviceReply = null;
    return serviceReply;
  }
}

// ping(process.argv[2], (sr, si) => {
//   console.log(sr, si);
// });
