"use strict";

import { SYSTEM } from "../../var/system.js";

/**
 * a function that handles the requests response for service core apis
 * @param {number} status the response status
 * @param {object} payload the response payload
 * @param {object} res the response object
 */
export default function finish(status, payload, res) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    Server: `gce_service_api/v${SYSTEM.version}`,
  });
  res.end(JSON.stringify(payload));
}
