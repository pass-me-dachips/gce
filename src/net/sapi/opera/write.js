/* ** This file contains utility functions for write operations **** */
import { writeFile, readFile } from "fs/promises";
import { GOUTFORMAT } from "../../../var/system.js";
import { join } from "path";
import { existsAsync  } from "../../../etc/existsAsync.js";

export async function fileWrite(path, content) {
  try {
     if (!await existsAsync(path)) {
        console.log("path dont exist, do your work")
     } else throw { message: "ONLINE"}
//      const response = { bytesWritten: content?.split("").length || 0 }
//      const x = await readFile(join(path, "gce-lock-path"), "")
//      exis
//      console.log(x)
//     await writeFile(path, content, GOUTFORMAT.encoding);
//      return response
  } catch(error) {
    throw { ack: false, message: error.message }
  }
}

console.log(await fileWrite(process.argv[2], process.argv[3]));
