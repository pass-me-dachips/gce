import { cacheTemplate, extensionTable } from "../var/templates.js";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { GOUTFORMAT, GPATHS } from "../var/system.js";
import { report } from "./report.js";
import { existsAsync } from "./existsAsync.js";
import { join } from "node:path";
import mergeObjects from "../local/mergeObjects.js";

class Env {
  constructor() {
    this.table = {...cacheTemplate};
  }
 clear() {
   this.table = {...cacheTemplate};
   return void 0;
 }
 addStack(fileName) {
   let extension;
   if (!fileName.includes(".")) extension = fileName;
   else {
    const portions = fileName.split(".");
    extension = portions[portions.length - 1];
   }
   extension = extensionTable[`E${extension}`] ?? extension;
   this.table.stack[extension] = 
      this.table.stack[extension] !== undefined ? 
        this.table.stack[extension] + 1 : 1;
   this.table.lastUpdate = new Date();
   this.table.stackLastUpdate = String(new Date());
   return void 0;
 }
 getStack() {
   return this.table.stack;
 }
 
 fsupgradeBytes(forDropped, bytes) {
   bytes = Number(bytes);
   const placeholder = forDropped ? "total_bytes_dropped" : "total_bytes_written";
   const total_bytes = this.table.fs[placeholder];
   let bytesToWrite;
   if (total_bytes !== undefined) bytesToWrite = total_bytes + bytes;
   else bytesToWrite = bytes;
   this.table.fs[placeholder] = bytesToWrite;
   this.table.lastUpdate = new Date();
   return void 0;
 }
 fsupgradeDir(forDropped) {
   const placeholder = forDropped ? "total_dirs_dropped" : "total_dirs_written";
   const total_dirs = this.table.fs[placeholder];
   let newTotalDidr;
   if (total_dirs !== undefined) newTotalDidr = total_dirs + 1;
   else newTotalDidr = 1;
   this.table.fs[placeholder] = newTotalDidr;
   this.table.lastUpdate = new Date();
   return void 0;
 }
 getFs() {
   return this.table.fs;
 }

 handleUpload(path) {
   const TBI = 60000 //Time Before Interval: every 1 minute;
   setInterval(async ()=> {
      try {
         const prevUpload = await readFile(path, GOUTFORMAT.encoding);
         const newUpload = {...JSON.parse(prevUpload)};
         newUpload["memUsage"] = process.memoryUsage();
         newUpload["uptime"] = process.uptime();
         newUpload["idleSince"] = this.table.lastUpdate;
         newUpload["fs"] = this.table.fs;
         await writeFile(path, JSON.stringify(newUpload, "", 4), GOUTFORMAT.encoding);
         report("captured analysis", "SYSTEM", "others");
      } catch(error) {
        report(error.message, "SYSTEM", "others");
      } 
   },TBI);
   return void 0;
 }

 handleStackUpload() {
   const TBI = 120000 //Time Before Interval: every 2 minute;
   let prevUpdateTime = null;
   setInterval(async ()=> {
      try {
        if (this.table.stackLastUpdate !== prevUpdateTime) {
          while (!await existsAsync(GPATHS.stack)) {
             await mkdir(GPATHS.stack, { recursive: true });
          }
          const stackLock = join(GPATHS.stack, ".stacklock");
          const trials = {
            tries: 0,
            qouta: 7
          };
          const write = async () => {
            if (!await existsAsync(stackLock)) {
               const stackpath = join(GPATHS.stack, ".gcestack");
               let prevStackContents;
               if (await existsAsync(stackpath)) {
                 const contents = JSON.parse(
                  await readFile(stackpath, GOUTFORMAT.encoding)
                 );
                 prevStackContents = contents;
               } else prevStackContents = {}
               // Terminated until next loop if prevContents not of type object
               const newStackContents =
                 mergeObjects(prevStackContents, this.table.stack);

               await writeFile(stackLock, "", GOUTFORMAT.encoding); 
               // lock the file so no any other running service can write to it.
               await writeFile(stackpath, JSON.stringify(newStackContents), GOUTFORMAT.encoding);
               await rm(stackLock); //unlock the file.
               prevUpdateTime = this.table.stackLastUpdate;
            }
          }
          while (await existsAsync(stackLock)) {
            trials.tries = trials.tries + 1;
            if (trials.tries === trials.qouta) break;
            else await write();
          }
          await write();
        } 
        // only handle writes if there are new updates on the service 
        // programming stack.
      } catch { return void 0;} 
   },TBI);
   return void 0;
 } 

 static EnvInstance() {
   if (!Env.instance) Env.instance = new Env();
   return Env.instance;
 }
}

const Cache = Env.EnvInstance();

export default Cache;
