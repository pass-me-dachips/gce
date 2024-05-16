import { code_0, code_1 } from "../codes.js";

export function deftype(type) {
 return JSON.stringify(code_1(`UNKNOWN TYPE : ${type}`));
}

export function defopera(opera) {
 return JSON.stringify(code_1(`INVALID OPERA : ${opera}`));
}
