"use strict";

import { code_1 } from "../sapi/codes.js";
import fs from "../sapi/opera/fs.js";
import spkg from "../sapi/opera/spkg.js";
import { SYSTEM } from "../../var/system.js";

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
    const requestType = urls[1];
    const requestOpera = urls[2];
    const requestOid = urls[3];
    const requestPayload = { ...sdu, payload: req.body };
    const api_version = Number(req.headers?.version) ?? 1;

    if (api_version === 1) {
      switch (requestType) {
        case "fs":
          fs(requestOpera, requestOid, requestPayload, res);
          break;
        case "spkg":
          spkg(requestOpera, requestOid, requestPayload, res);
          break;
        default:
          finish(400, code_1(`unknown type: ${requestType}`));
      }
    } else finish(400, code_1("invalid api version"));
  } else finish(400, code_1("gce expected /coreapi/<type>/<operation>/<oid>"));
}
