import { code_1 } from "./codes.js";
// import TSAPI from "./types/SAPI.js"; //asin Type-ServiceAPI
// import FS from "./types/FS.js";

export default function handleSapiRequests(ws, sdu) {
   const error =  "error";
   const operation =  "message";
   const stringify = (payload) => JSON.stringify(payload);

   ws.on(error, ()=> ws.send(stringify(code_1("gce encountered an error."))));

   ws.on(operation, async (data)=> {
      data = data.toString();
      if (data.startsWith("{") && data.endsWith("}")) {
         const request = JSON.parse(data);
         console.log(request)
         if ("OPERA" in request && "TYPE" in request && "PAYLOAD" in request ) {
//         switch (request.TYPE) {
//           case "SAPI" : ws.send(await TSAPI(request, options)); break
//           case "FS" :  ws.send(await FS(request, options)); break
//           default : ws.send(JSON.stringify(code_1(`UNKNOWN TYPE ${request.TYPE}`)));
//         }
        } else ws.send(stringify(code_1("required fields missing")));
      } else ws.send(stringify(code_1("request not of type json")));
  })
}
