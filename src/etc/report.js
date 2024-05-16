"use strict";

/**
 * logs reports to the terminal.
 * @param {string} message the report message to log 
 * @param {string} oid the operation id
 * @param {string} type the type of log. values can only be "fs", "others" or "danger".
 * @returns {void}
 */
export function report(message, oid, type) {
  oid = `OID ${oid}`;
  const date = new Date().toUTCString();
  const fs  = `\x1b[92m${message}\x1b[0m\t\x1b[94m[${oid}]\x1b[0m\t[${date}]\n`;
  const others = `\x1b[96m${message}\x1b[0m\t\x1b[94m[${oid}]\x1b[0m\t[${date}]\n`;
  const dang = `\x1b[94m${message}\x1b[0m\t\x1b[94m[${oid}]\x1b[0m\t[${date}]\n`;
  if (type === "others") process.stdout.write(others);
  else if (type === "danger") process.stdout.write(dang);
  else process.stdout.write(fs);
  return void 0;
}
