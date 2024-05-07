import { code_1 } from "./codes.js";
import { deftype } from "./types/default.js";
import fs from "./types/fs.js";

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
            switch (request.TYPE) {
              case "FS" : ws.send(await fs(request, options)); break
              default : ws.send(deftype(request.TYPE));
            };
        } else ws.send(stringify(code_1("required fields missing")));
      } else ws.send(stringify(code_1("request not of type json")));
  })
}
