
export function report(message) {
  process.stdout.write(
    `\x1b[92m${message}\x1b[0m\t[${new Date().toTimeString()}]\n`
  );
  return void 0;
}