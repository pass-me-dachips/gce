import { join } from "node:path";
import { code_0, code_1 } from "../codes.js";
import { defopera } from "./default.js";



export default async function fs(request,sdu) {
  let response;
  const { OPERA, PAYLOAD } = request;
  switch (OPERA) {
//     case "RD" : response = await READDIR(PAYLOAD, options); break
     default: response = defopera(OPERA);
  };
  return response;
}

