import { code_0 } from "../codes.js";
import { defopera } from "./default.js";
import * as spkgUtils from "../../../spkg/v1.0.0.js";
import { errorResponseHelper } from "./fs.js";
import { join } from "node:path";
import { report } from "../../../etc/report.js";

const stdsignal = "ACK/HASPAYLOAD";

function ADDSUBDIVMULTIPLYMODPOW(type, payload, oid) {
  if (payload && typeof payload === "object" && payload.length !== undefined) {
     const value = spkgUtils[type](...payload);
     return JSON.stringify(code_0(true, stdsignal,oid, value));
  } else {
     const response = 
      code_0(true, stdsignal, oid, "expected payload of type array");
     return JSON.stringify(response);
  }
}

function INTEGERSANDBASICBYTES(type, payload, oid) {
  let response = spkgUtils[type](payload);
  return JSON.stringify(code_0(true, stdsignal, oid, response));
}

function HEXDECIBINRGB(type, payload, oid) {
  let response = spkgUtils[type](payload);
  return JSON.stringify(code_0(true, stdsignal, oid, response));
}

async function QUICK(payload, oid, sdu) {
  try {
    let { path, template } = payload;
    if (path && template) {
      path = join(sdu.servicePath, path);
      await spkgUtils.quick(path, template);
      return JSON.stringify(code_0(true, "ACK", oid, null)); 
    } else throw {  
      message : "QUICK requires the path and template fields."
    };
  } catch(error) { return errorResponseHelper(error, oid); }
}

async function END(ws, sdu, oid) {
  try {
    report("service about to stop */*", oid,  "others");
    report("sending danger signal", oid, "others");
    spkgUtils.end(sdu, true, ws);
  } catch(error) { return errorResponseHelper(error, oid); }
}

// ++++++++ the main spkg api ++++++++++++++++++
export default async function spkg(request, ws, sdu) {
  const { OPERA, PAYLOAD, OID } = request;
  switch (OPERA) {
     case "ADD" : ws.send(ADDSUBDIVMULTIPLYMODPOW("add", PAYLOAD, OID)); break
     case "SUB" : ws.send(ADDSUBDIVMULTIPLYMODPOW("sub", PAYLOAD, OID)); break
     case "DIV" : ws.send(ADDSUBDIVMULTIPLYMODPOW("div", PAYLOAD, OID)); break
     case "MULTIPLY" : 
        ws.send(ADDSUBDIVMULTIPLYMODPOW("multiply", PAYLOAD, OID)); break
     case "MOD" : ws.send(ADDSUBDIVMULTIPLYMODPOW("mod", PAYLOAD, OID)); break
     case "POW" : ws.send(ADDSUBDIVMULTIPLYMODPOW("pow", PAYLOAD, OID)); break
     case "UINT" : ws.send(INTEGERSANDBASICBYTES("uint", PAYLOAD, OID)); break
     case "INT" : ws.send(INTEGERSANDBASICBYTES("int", PAYLOAD, OID)); break
     case "BYTES" : ws.send(INTEGERSANDBASICBYTES("bytes", PAYLOAD, OID)); break
     case "FREE" : 
       ws.send(JSON.stringify(code_0(true, stdsignal,OID,spkgUtils.free))); 
       break
     case "DIRSIZE" : 
       ws.send(JSON.stringify(code_0(true, stdsignal,OID,spkgUtils.defDirSize))); 
       break
     case "MARSHAL" : 
       ws.send(JSON.stringify(code_0(
          true, stdsignal,
          OID,
          await spkgUtils.marshal(PAYLOAD)
       ))); 
       break
     case "HMR" : 
       ws.send(JSON.stringify(code_0(true, stdsignal,OID,spkgUtils.hmr(PAYLOAD)))); 
       break
     case "OSPATH" : 
       ws.send(JSON.stringify(code_0(
          true, stdsignal,
          OID,
          await spkgUtils.osPath(PAYLOAD.os, PAYLOAD.path)
       ))); 
       break
     case "ASCII" : 
       ws.send(JSON.stringify(code_0(true, stdsignal,OID,spkgUtils.ascii))); 
       break
     case "ANSI" : 
       ws.send(JSON.stringify(code_0(
          true, stdsignal,
          OID,
          spkgUtils.ansiCodesForColouredOutput
       ))); 
       break
     case "HEX" : ws.send(HEXDECIBINRGB("hex", PAYLOAD, OID)); break
     case "DECI" : ws.send(HEXDECIBINRGB("deci", PAYLOAD, OID)); break
     case "BIN" : ws.send(HEXDECIBINRGB("bin", PAYLOAD, OID)); break
     case "RGB" : ws.send(HEXDECIBINRGB("rgb", PAYLOAD, OID)); break
     case "QUICK" : ws.send(await QUICK(PAYLOAD, OID, sdu)); break
     case "END" : END(ws, sdu, OID); break
     default: ws.send(defopera(OPERA)); //would change.
  };
}
 