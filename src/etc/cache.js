import { cacheTemplate, extensionTable } from "../var/templates.js";
import { readFile, writeFile } from "node:fs/promises";
import { GOUTFORMAT } from "../var/system.js";
import { report } from "./report.js";

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

 static EnvInstance() {
   if (!Env.instance) Env.instance = new Env();
   return Env.instance;
 }
}

const Cache = Env.EnvInstance();

export default Cache;
