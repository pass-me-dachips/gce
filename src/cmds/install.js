
"use strict";

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { PATHS, SYSTEM } from "../var/system.js";

/**
 * a function that logs a success message upon gcce installation
 * @returns {void}
 */
function successLog() {
  console.log("gcce successfully installed! ")
  return void 0;
} 

/**
 * handler for the install command.
 * @author david, pass-me-dachips
 * @param {string} args 
 * @returns {void}
 */
export default function Install(args) {
  if (args.length === 2) {
    const gccePath = args[1];
    const gconfigPath =  join(process.cwd(), gccePath, "gconfig.json"); 
    if (existsSync(gconfigPath)) {
       const gconfigContent =
         JSON.parse(readFileSync(gconfigPath, SYSTEM.encoding));
       const {start, author, name, repo, version, entry, notFound, forbiden} = 
         gconfigContent;

       if (
          start && 
          author && 
          name && 
          repo && 
          version && 
          entry && 
          notFound && 
          forbiden
         ) {
         gconfigContent["path"] = join(process.cwd(), gccePath);
         while (!existsSync(PATHS.configDir)) mkdirSync(PATHS.configDir, {
           recursive: true
         });
         // creates the os configdir if not existing
         
         console.log(`installing ${name}, v${version}........`);
         if (existsSync(PATHS.gcceConfig) && 
           JSON.parse(readFileSync(PATHS.gcceConfig)).length > 0) {
          const gcceRegistry = JSON.parse(readFileSync(PATHS.gcceConfig));
          let shouldWriteFile;
          const contentToWrite = [];
          contentToWrite.push(gconfigContent);

          gcceRegistry.forEach(elem => {
            if (elem.name === gconfigContent.name &&
              elem.version === gconfigContent.version) {
               shouldWriteFile = false;
               let message = 
                `${elem.name} with version ${elem.version} already installed.`;
               throw { message }
            } else {  shouldWriteFile = true; contentToWrite.push(elem) }
          })
          if (shouldWriteFile) {
            writeFileSync(PATHS.gcceConfig, JSON.stringify(contentToWrite));
            successLog();
          }
         } else {
            writeFileSync(PATHS.gcceConfig, JSON.stringify([gconfigContent]));
            successLog(gconfigContent);
         }
       } else {
         const message =
           "gcce requirements not met.\nare you sure the gcces's gconfig.json has the following fields? \x1b[92mstart, author, name, repo, version, entry, notFound, forbiden\x1b[0m";
         throw { message }
       }
    } else throw { message: `cannot find ${gconfigPath}`}
  } else {
    const message
      = "install expects only 1 argument which is the relative path to the gcce";
    throw { message }
  }
}
