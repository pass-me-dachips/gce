"use strict";

import * as spkgUtils from "../../../spkg/v1.0.0.js";
import { code_0, code_1 } from "../codes.js";
import { errorResponseHelper } from "./fs.js";
import finish from "../finish.js";
import { join } from "node:path";
import { report } from "../../../etc/report.js";

const stdsignal = "ACK/HASPAYLOAD";

const methodpost = "expected payload of type array and method post";
function ADDSUBDIVMULTIPLYMODPOW(type, sdu, oid, res) {
  if (
    sdu.method === "POST" &&
    sdu.payload !== null &&
    Array.isArray(sdu.payload)
  ) {
    const value = spkgUtils[type](...sdu.payload);
    finish(200, code_0(true, stdsignal, oid, value), res);
  } else finish(200, code_0(true, stdsignal, oid, methodpost), res);
}

function INTEGERSANDBASICBYTES(type, sdu, oid, res) {
  if (
    sdu.method === "POST" &&
    sdu.payload !== null &&
    Array.isArray(sdu.payload)
  ) {
    const response = spkgUtils[type](sdu.payload[0]);
    finish(200, code_0(true, stdsignal, oid, response), res);
  } else finish(200, code_0(true, stdsignal, oid, methodpost), res);
}

async function MARSHAL(sdu, oid, res) {
  if (
    sdu.method === "POST" &&
    sdu.payload !== null &&
    Array.isArray(sdu.payload)
  ) {
    const response = await spkgUtils.marshal(sdu.payload);
    finish(200, code_0(true, stdsignal, oid, response), res);
  } else finish(200, code_0(true, stdsignal, oid, methodpost), res);
}

function HEXDECIBINRGB(type, sdu, oid, res) {
  if (
    sdu.method === "POST" &&
    sdu.payload !== null &&
    Array.isArray(sdu.payload)
  ) {
    let response = spkgUtils[type](sdu.payload[0]);
    finish(200, code_0(true, stdsignal, oid, response), res);
  } else finish(200, code_0(true, stdsignal, oid, methodpost), res);
}

async function QUICK(oid, sdu, res) {
  try {
    if (
      sdu.method === "POST" &&
      sdu.payload !== null &&
      Array.isArray(sdu.payload) &&
      sdu.payload.length === 2
    ) {
      const path = join(sdu.servicePath, sdu.payload[0]);
      await spkgUtils.quick(path, sdu.payload[1]);
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      throw {
        message:
          "quick expected method post, with payload [string: path, string: template]",
      };
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

function END(sdu, oid, res) {
  report("service about to stop */*", oid, "others");
  report("sending danger signal", oid, "others");
  spkgUtils.end(sdu, false);
  finish(200, code_0(true, "ACK", oid, null), res);
}

/** a function that handles service api requests and responses for service packages
 * @author david, super-user-d0
 * @param {string} opera the operation
 * @param {string} oid the operation id
 * @param {object} sdu the service data unit which must include the request body
 * @param {object} res the response object
 * @returns {void}
 */
export default async function spkg(opera, oid, sdu, res) {
  switch (opera.toUpperCase()) {
    case "ADD":
      ADDSUBDIVMULTIPLYMODPOW("add", sdu, oid, res);
      break;
    case "SUB":
      ADDSUBDIVMULTIPLYMODPOW("sub", sdu, oid, res);
      break;
    case "DIV":
      ADDSUBDIVMULTIPLYMODPOW("div", sdu, oid, res);
      break;
    case "MULTIPLY":
      ADDSUBDIVMULTIPLYMODPOW("multiply", sdu, oid, res);
      break;
    case "MOD":
      ADDSUBDIVMULTIPLYMODPOW("mod", sdu, oid, res);
      break;
    case "POW":
      ADDSUBDIVMULTIPLYMODPOW("pow", sdu, oid, res);
      break;
    case "UINT":
      INTEGERSANDBASICBYTES("uint", sdu, oid, res);
      break;
    case "INT":
      INTEGERSANDBASICBYTES("int", sdu, oid, res);
      break;
    case "BYTES":
      INTEGERSANDBASICBYTES("bytes", sdu, oid, res);
      break;
    case "FREE":
      finish(200, code_0(true, stdsignal, oid, spkgUtils.free), res);
      break;
    case "DIRSIZE":
      finish(200, code_0(true, stdsignal, oid, spkgUtils.defDirSize), res);
      break;
    case "MARSHAL":
      MARSHAL(sdu, oid, res);
      break;
    case "HMR":
      finish(
        200,
        code_0(
          true,
          stdsignal,
          oid,
          spkgUtils.hmr(Array.isArray(sdu.payload) ? sdu.payload[0] : 0)
        ),
        res
      );
      break;
    case "OSPATH":
      Array.isArray(sdu.payload) &&
      sdu.payload.length === 2 &&
      sdu.method === "POST" &&
      sdu.payload[0] !== null &&
      sdu.payload[1] !== null
        ? finish(
            200,
            code_0(
              true,
              stdsignal,
              oid,
              await spkgUtils.osPath(sdu.payload[0], sdu.payload[1])
            ),
            res
          )
        : finish(
            200,
            code_0(
              true,
              stdsignal,
              oid,
              "expected payload of type array[2] and method post"
            ),
            res
          );
      break;
    case "ASCII":
      finish(200, code_0(true, stdsignal, oid, spkgUtils.ascii), res);
      break;
    case "ANSI":
      finish(
        200,
        code_0(true, stdsignal, oid, spkgUtils.ansiCodesForColouredOutput),
        res
      );
      break;
    case "HEX":
      HEXDECIBINRGB("hex", sdu, oid, res);
      break;
    case "DECI":
      HEXDECIBINRGB("deci", sdu, oid, res);
      break;
    case "BIN":
      HEXDECIBINRGB("bin", sdu, oid, res);
      break;
    case "RGB":
      HEXDECIBINRGB("rgb", sdu, oid, res);
      break;
    case "QUICK":
      await QUICK(oid, sdu, res);
      break;
    case "END":
      END(sdu, oid, res);
      break;
    case "TECHSTACK":
      finish(
        200,
        code_0(true, stdsignal, oid, await spkgUtils.getTechStack(true)),
        res
      );
      break;
    case "SERVICEINFO":
      finish(200, code_0(true, stdsignal, oid, sdu), res);
      break;
    default:
      finish(400, code_1(`unknown operation: ${opera}`), res);
  }
}
