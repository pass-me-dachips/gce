/* ** This file contains utility functions for write operations **** */
import { writeFile, rm } from "fs/promises";
import { GOUTFORMAT,  GPATHS } from "../../../var/system.js";
import { basename } from "path";
import { existsAsync } from "../../../etc/existsAsync.js";

export async function fileWrite(path, content) {
  try {
     const lockFile = GPATHS.gcelock + basename(path);
     const pathBeforeBase = path.split(basename(path));
     pathBeforeBase[pathBeforeBase.length - 1] = lockFile;

     const lockPath = pathBeforeBase.join("");

     if (!await existsAsync(lockPath)) {
        const response = { bytesWritten: content?.split("").length || 0 };
        await writeFile(lockPath, GOUTFORMAT.tabA, GOUTFORMAT.encoding);
        /* write the lock file so no other gce service can work on the cwf */
        await writeFile(path, content, GOUTFORMAT.encoding);
        await rm(lockPath, { maxRetries: 2 });
        return response;
     } else throw { message: "ONLINE" };
      /**
       * an error with message ONLINE is thrown if the .gcelock.file.ext already
       * exists. it means another gce service or same is already working on that 
       * file.
       */
  } catch(error) {
    throw error;
  }
}
