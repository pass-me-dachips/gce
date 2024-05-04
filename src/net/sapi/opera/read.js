/* **** This file contains utility operations for reading files and folders. **** */
import { readFile, stat } from "node:fs/promises";
import { GOUTFORMAT } from "../../../var/system.js";

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
     throw { ack: false, mesage: error.message }
  }
}
