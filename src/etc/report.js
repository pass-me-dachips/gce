
export function report(message, type) {
  const fs  =  `\x1b[92m${message}\x1b[0m\t[${new Date().toTimeString()}]\n`;
  const spkg =  `\x1b[96m${message}\x1b[0m\t[${new Date().toTimeString()}]\n`;
  if (type === "spkg") process.stdout.write(spkg);
  else process.stdout.write(fs);
  return void 0;
}