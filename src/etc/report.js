
export function report(message, type) {
  const date = new Date().toUTCString();
  const fs  = `\x1b[92m${message}\x1b[0m\t[${date}]\n`;
  const spkg = `\x1b[96m${message}\x1b[0m\t[${date}]\n`;
  const dang = `\x1b[94m${message}\x1b[0m\t[${date}]\n`;
  if (type === "spkg") process.stdout.write(spkg);
  if (type === "danger") process.stdout.write(dang);
  else process.stdout.write(fs);
  return void 0;
}