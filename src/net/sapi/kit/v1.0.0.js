
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
