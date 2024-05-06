import { freemem } from "node:os";

export function add(...operands) {
 return operands.reduce((acum, elem)=> acum + Number(elem),0);
}
export function sub(...operands) {
 return operands.slice(1).
 reduce((acum, elem)=> acum - Number(elem), Number(operands[0]));
}
export function div(x,y) {
 x = Number(x); y = Number(y);
 return x / y;
}
export function multiply(x,y) {
 x = Number(x); y = Number(y);
 return x * y;
}
export function mod(x,y) {
 x = Number(x); y = Number(y);
 return x % y;
}
export function pow(x,y) {
 return Math.pow(x,y);
}
export function uint(bits) {
  bits = Number(bits);
  const size = pow(2, bits) - 1;
  if (bits === 8 || bits === 16 || bits === 32) return `0 - ${size}`;
  else if (bits === 64) return `0 - 18446744073709551615`;
  else return "out of range";
}
export function int(bits) {
  bits = Number(bits);
  let size = pow(2, bits);
  if (bits === 8 ||  bits === 16 || bits === 32)
    return `-${size / 2} - ${(size / 2) - 1}`;
  else if (bits === 64) return `-9223372036854775808 - 9223372036854775807`;
  else return "out of range";
}

export function bytes(bit) {
 bit = Number(bit);
 return Math.floor(div(bit, 8));
}
export const free = freemem();
export const defDirSize = 4096;

export async function marshal(json) {
 try {
   return JSON.stringify(JSON.parse(json), 0, 2);
 } catch(error) {
   throw error;
 }
}

export function hmr(bytes) {
  bytes = Number(bytes);
  const s = 1024; //s as in representing size per kb.
  if (bytes < s) return `${bytes}B`;
  else if (bytes < pow(s, 2)) return `${(bytes / pow(s,1)).toFixed(2)} KB`;
  else if (bytes < pow(s,3)) return `${(bytes / pow(s,2)).toFixed(2)} MB`;
  else if (bytes < pow(s,4)) return `${(bytes / pow(s,3)).toFixed(2)} GB`;
  else if (bytes < pow(s,5)) return `${(bytes / pow(s,4)).toFixed(2)} TB`;
  else return "out of range";
}

