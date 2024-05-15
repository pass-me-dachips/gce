import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { GPATHS, GOUTFORMAT } from "../var/system.js";
import { join } from "node:path";

function successLog(config) {
  console.log("COMMAND=install options <One-Option>=standard");
  const array = [
      `should install ${config.name}`,
      `as version ${config.version}`,
      `absolute path ${config.abs}`
  ];
  array.forEach(elem => {
     console.log(`${GOUTFORMAT.tabA}${elem}`)
  })
  return void 0;
} 

export default function Install(args) {
  if (args.length === 2) {
    const gccePath = args[1];
    const configPath =  join(process.cwd(), gccePath, "gconfig.json"); 
    if (existsSync(configPath)) {
       const cContent = JSON.parse(readFileSync(configPath, GOUTFORMAT.encoding));
       // cContent as in configContent
       const configEncapsulated = {
          name: cContent.name, 
          version: cContent.version,
          entry: cContent.entry ?? "index.html",
          notFound: cContent.notFound ?? "404.html",
          forbiden: cContent.forbiden ?? "forbiden.html",
          abs: join(process.cwd(), gccePath)
       }
      while (!existsSync(GPATHS.configDir)) mkdirSync(GPATHS.configDir);
      // creates the os configdir if not existing
      
      if (existsSync(GPATHS.gcceConfig) && 
         JSON.parse(readFileSync(GPATHS.gcceConfig)).length > 0) {
        const gccegConfigContent = JSON.parse(readFileSync(GPATHS.gcceConfig));
        // gcceg as in global gcce

        let shouldWriteFile;
        const contentToWrite = [];
        contentToWrite.push(configEncapsulated);

        gccegConfigContent.forEach(elem => {
          if (elem.name === configEncapsulated.name &&
           elem.version === configEncapsulated.version) {
             shouldWriteFile = false;
             let message = 
              `${elem.name} with version ${elem.version} already installed.`;
             throw { message }
          } else {  shouldWriteFile = true; contentToWrite.push(elem) }
        })
        if (shouldWriteFile) {
          writeFileSync(GPATHS.gcceConfig, JSON.stringify(contentToWrite));
          successLog(configEncapsulated);
        }
      } else {
        writeFileSync(GPATHS.gcceConfig, JSON.stringify([configEncapsulated]));
        successLog(configEncapsulated);
      }
    } else throw { message: `ABORTED: cannot find ${configPath}`}
  } else {
    const message = "ABORTED: cmd expects only 1 argument: <relative_path_to_gcce>";
    throw { message }
  }
}
