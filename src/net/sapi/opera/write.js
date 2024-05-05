/* ** This file contains utility functions for write operations **** */
import { writeFile, rm, mkdir, rename } from "node:fs/promises";
import { GOUTFORMAT,  GPATHS } from "../../../var/system.js";
import { basename } from "node:path";
import { existsAsync } from "../../../etc/existsAsync.js";
import { Buffer } from "node:buffer";

export async function fileWrite(path, content) {
  try {
     const lockFile = GPATHS.gcelock + basename(path);
     const pathBeforeBase = path.split(basename(path));
     pathBeforeBase[pathBeforeBase.length - 1] = lockFile;

     const lockPath = pathBeforeBase.join("");

     if (!await existsAsync(lockPath)) {
        const response = { bytesWritten: Buffer.byteLength(content) };
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

export async function createDir(path) {
  try {
    await mkdir(path, { recursive: true });
    return true;
  } catch(error) {
    throw error;
  }
}

export async function createFile(path) {
  try {
    writeFile(path, "",  GOUTFORMAT.encoding);
    return true;
  } catch(error) {
    throw error;
  }
}

export async function renameFs(path, newbasename) {
  try {
    const pathBeforeBase = path.split(basename(path));
    pathBeforeBase[pathBeforeBase.length - 1] = newbasename;
    const newPath = pathBeforeBase.join("");
    await rename(path, newPath);
    return true;
  } catch(error) {
    throw error;
  }
}

export async function removeFs(path) {
  try {
    await rm(path, { recursive: true, retryDelay: 1000 });
    return true;
  } catch(error) {
    throw error;
  }
}
