"use strict";

import { SYSTEM } from "../../var/system.js";
import { code_0, code_1 } from "../sapi/codes.js";

/** a function that handles service api requests
 * @author david, pass-me-dachips
 * @param {object} req
 * @param {object} res
 * @param {object} sdu
 * @returns {void}
 */
export default function serviceApi(req, res, sdu) {
  function finish(status, payload) {
    res.writeHead(status, {
      "Content-Type": "application/json",
      Server: `gce_service_api/v${SYSTEM.version}`,
    });
    res.end(JSON.stringify(payload));
  }

  const urls = req.url.split("/").filter((elem) => elem !== "");

  if (urls.length === 4) {
    //     const path = urls[1];
    //     "OPERA" in request &&
    //       "TYPE" in request &&
    //       "PAYLOAD" in request &&
    //       "OID" in request;
  } else
    finish(400, code_1("gce expected /coreapi/<type>/<variant>/<operation>"));
}
