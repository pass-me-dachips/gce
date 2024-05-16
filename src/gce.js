
process.on("uncaughtException", ( error )=> {
  const outcolor = error.color_code;
  if (outcolor) console.log(`\x1b[${outcolor}m${error.message}\x1b[0m`)
  else console.log(error.message);
})

