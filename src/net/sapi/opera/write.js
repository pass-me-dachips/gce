/* ** This file contains utility functions for write operations **** */
import { writeFile, rm, mkdir, rename, cp, copyFile, readFile } from "node:fs/promises";
import { GOUTFORMAT,  GPATHS } from "../../../var/system.js";
import { basename, join } from "node:path";
import { existsAsync } from "../../../etc/existsAsync.js";
import { Buffer } from "node:buffer";
import { randomBytes } from "node:crypto";

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
     } else throw { code: "ONLINE" };
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
    const doesExists = await existsAsync(path);
    if (!doesExists) await writeFile(path, "",  GOUTFORMAT.encoding);
    else throw { code: "DUPKEY" }
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

export async function adminRemoveFs(path) {
  try {
    await rm(path, { recursive: true, retryDelay: 1000 });
    return true;
  } catch(error) {
    throw error;
  }
}

export async function copyDir(source, destination) {
  try {
    await cp(source, destination, { recursive: true});
    return true;
  } catch(error) {
    throw error;
  }
}

export async function copyF(source, destination) {
  try {
    await copyFile(source, destination);
    return true;
  } catch(error) {
    throw error;
  }
}

export async function moveDir(source, destination) {
  try {
    await copyDir(source, destination);
    await adminRemoveFs(source);
    return true;
  } catch(error) {
    throw error;
  }
}

export async function moveFile(source, destination) {
  try {
    const fileName = basename(source);
    destination = join(destination, fileName);
    await copyFile(source, destination);
    await adminRemoveFs(source);
    return true;
  } catch(error) {
    throw error;
  }
}

export async function toTrash(serviceId, isFile, name, path) {
  try {
    let pointer = "g" + randomBytes(6).toString("hex") + serviceId.split("x")[0];
    const pathToServiceBin = join(GPATHS.trash, serviceId, pointer);
    if (!await existsAsync(pathToServiceBin)) {
      await mkdir(pathToServiceBin, { recursive: true });
    }
    // each item moved to the trash would create a directory (pointer) containing
    // a .TRASHFILE contianing the original name of the file, and the trashed 
    // directory or file, in the service trash folder.
    const trashfile = join(pathToServiceBin, ".TRASHFILE");
    await writeFile(trashfile, `${name}\n${path}`, GOUTFORMAT.encoding);
    if (isFile === true) {
      await writeFile(
        join(pathToServiceBin, "gfile"), 
        GOUTFORMAT.tabA, 
        GOUTFORMAT.encoding
      );
      await moveFile(path, pathToServiceBin);
    }
    else await moveDir(path, pathToServiceBin);
    return pointer;
  } catch(error) {
    throw error;
  } 
}

export async function restore(serviceId, pointer) {
  try {
    const pathToServiceBin = join(GPATHS.trash, serviceId, pointer);
    if (await existsAsync(pathToServiceBin)) {
       const fsStatsPath = join(pathToServiceBin,".TRASHFILE");
       const fsStats = await readFile(fsStatsPath, GOUTFORMAT.encoding);
       //the trashfile is intrpreted as fsStats in this function.
       const isFile = await existsAsync(join(pathToServiceBin, "gfile"));
       let destination = fsStats.split("\n")[1];
       if (isFile) {
         destination = destination.split(basename(destination))[0]
         await moveFile(join(pathToServiceBin, fsStats.split("\n")[0]), destination);
         await adminRemoveFs(pathToServiceBin);
       } else {
         await moveDir(pathToServiceBin, destination);
         await adminRemoveFs(join(destination, ".TRASHFILE"));
       }
       return true;
    } else throw { 
       message: 
        `The provided pointer does not match any item in service ${serviceId}` 
    }
  } catch(error) {
    throw error;
  } 
}

