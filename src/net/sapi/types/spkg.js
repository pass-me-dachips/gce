import { code_0 } from "../codes.js";
import { defopera } from "./default.js";
import * as spkgUtils from "../../../spkg/v1.0.0.js";

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
     default: ws.send(defopera(OPERA)); //would change.
  };
}
 