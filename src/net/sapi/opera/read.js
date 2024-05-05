/* ** This file contains utility functions for read operations **** */
import { readFile, stat, readdir } from "node:fs/promises";
import { GOUTFORMAT } from "../../../var/system.js";
import { join } from "node:path";

export async function fileRead(
   path, 
   useDefault, 
   window = 800, 
   lineHeight = 17, 
   page = 1,
   startLine = 0,
) {
  try {
     window = Number(window);
     lineHeight = Number(lineHeight);
     page = Number(page);
     startLine = Number(startLine);
     //convert strings to integers 
     const { size, mtime } = await stat(path);
     const data = await readFile(path, GOUTFORMAT.encoding);
     const response = { size, lmodified: mtime }
     if (useDefault) response["data"] = data;
     else {
      if (size >= (Math.pow(1024, 2) * 1)) {
        const lines = data.split("\n");
        const linesPerPage = Math.round(window / lineHeight);
        //+++++++ the number of lines that can be visible without scrolling.
        const linesRendering = linesPerPage * page;
        response["data"]  = 
         lines.slice(startLine,(linesRendering + startLine)).join("\n");
      } else response["data"] = data; 
        //+++++ if the size is less than 1mb, useDefault
     }
     return response;
  } catch (error) {
     throw error;
  }
}

/* the dirRead does not provide any optimization technique for reducing file load
 times and eleminating freezing on large file systems for now.
 for this reason, the dir read only supports batch reading and not recursively
 which means you can only read diret children of a directory */
export async function dirRead(path) {
 try {
     const fsNames = await readdir(path, GOUTFORMAT.encoding);
     const fsLists = [];
     for (let i = 0; i < fsNames.length; i++) {
        const fs = fsNames[i];
        const stats = await stat(join(path, fs));
        fsLists.push({
          name: fs,
          type: stats.isDirectory() ? "DIR" : "FILE",
          size: stats.isDirectory() ? 0 : stats.size
        })
     }
     return fsLists;
 } catch(error) {
     throw error;
 }
}

export async function getStatistics(path) {
 try {
     const stats = await stat(path);
     return {
        path: path,
        size: stats.isDirectory() ?  0 : stats.size,
        created: stats.ctime,
        lmodified: stats.mtime,
        isDir: stats.isDirectory(),
     };
 } catch(error) {
     throw error;
 }
}
