import { join } from "node:path";
import { code_0 } from "../codes.js";
import { defopera } from "./default.js";
import { dirRead, fileRead, getStatistics } from "../opera/read.js";
import { ERRORCODES } from "../../../var/system.js";
import { createDir, createFile, fileWrite, renameFs } from "../opera/write.js";
import { report } from "../../../etc/report.js";

export function errorResponseHelper(error, oid) {
  if (error.code  === ERRORCODES.notFound) {
      return JSON.stringify(code_0(false, "ENOENTRY", oid, null)); 
  } else if (error.code === ERRORCODES.notdirectory || 
      error.code === ERRORCODES.notFile 
    ) {
      return JSON.stringify(code_0(false, "OSFORBIDEN", oid, null));
  } else if (error.code === ERRORCODES.exists) {
      return JSON.stringify(code_0(false, "DUPKEY", oid, null));
  } else if (error.code === ERRORCODES.online) {
      return JSON.stringify(code_0(false, "ONLINE", oid, null));
  } else return JSON.stringify(code_0(false, "STDERR", oid, error.message)); 
}

async function READDIR(relativePath, oid, sdu) {
  try {
    // the readdir expects the payload to be the relative path to the file in 
    // which the user wants to read.
    const { servicePath } = sdu;
    const pathToDir = join(servicePath, relativePath);
    const entries = await dirRead(pathToDir);
    return JSON.stringify(code_0(true, "ACK/HASPAYLOAD", oid, entries)); 
  } catch(error) {
    return errorResponseHelper(error, oid);
  }
}

async function STATICS(relativePath, oid, sdu) {
  try {
    // the readdir expects the payload to be the relative path to the file in 
    // which the user wants to read.
    const { servicePath } = sdu;
    const path = join(servicePath ,relativePath);
    const statistics = await getStatistics(path);
    return JSON.stringify(code_0(true, "ACK/HASPAYLOAD", oid, statistics)); 
  } catch (error) {
    return errorResponseHelper(error, oid);
  }
}

async function READFILE(payload, oid, sdu) {
  try {
    const { path, useDefault, window, lineHeight, page, startLine} = payload;
    if (path && typeof useDefault === "boolean") {
      const filePath = join(sdu.servicePath, path);
      const content = await fileRead( 
        filePath, useDefault, window, lineHeight, page, startLine 
      );
      return JSON.stringify(code_0(true, "ACK/HASPAYLOAD", oid, content)); 
    } else throw {  
      message : "READFILE requires the path and useDefualt fields."
    };
  } catch (error) { 
    return errorResponseHelper(error, oid);
  } 
}

async function WRITEFILE(payload, oid, sdu) {
  try {
    const { path, content } = payload;
    if (path && content) {
      const filePath = join(sdu.servicePath, path);
      const { bytesWritten } = await fileWrite(filePath, content);
      report(`wrote ${bytesWritten}B to ${path}`);
      return JSON.stringify(code_0(true, "ACK/HASPAYLOAD", oid, bytesWritten)); 
    } else throw { 
      message : "WRITEFILE requires the path and content fields." 
    };
  } catch (error) {
    return errorResponseHelper(error, oid);
  }
}    

async function MAKEDIR(relativePath, oid, sdu) {
  try {
    const { servicePath } = sdu;
    const pathToDir = join(servicePath, relativePath);
    await createDir(pathToDir);
    report(
      `made directory ${relativePath.endsWith("/")?relativePath:relativePath+'/'}`
    );
    return JSON.stringify(code_0(true, "ACK", oid, null)); 
  } catch(error) {
    return errorResponseHelper(error, oid); 
  }
}

async function MAKEFILE(relativePath, oid, sdu) {
  try {
    const { servicePath } = sdu; const pathToDir = join(servicePath, relativePath);
    await createFile(pathToDir); report( `wrote 0B (make) to ${relativePath}`);
    return JSON.stringify(code_0(true, "ACK", oid, null)); 
  } catch(error) { return errorResponseHelper(error, oid); }
}

async function RENAME(payload, oid, sdu) {
  try {
    const { servicePath } = sdu;
    const { path, new_basename } = payload;
    if (path && new_basename) {
      const pathToFs = join(servicePath, path);
      await renameFs(pathToFs, new_basename);
      report( `rn ${path} -> ${new_basename}`);
      return JSON.stringify(code_0(true, "ACK", oid, null)); 
    } else throw { 
      message : "RENAME requires the path and new_basename fields." 
    };
  } catch(error) { return errorResponseHelper(error, oid); }
}

// ++++++++ the main fs api ++++++++++++++++++
export default async function fs(request,sdu) {
  let response;
  const { OPERA, PAYLOAD, OID } = request;
  switch (OPERA) {
     case "READDIR" : response = await READDIR(PAYLOAD, OID, sdu); break
     case "STATICS" : response = await STATICS(PAYLOAD, OID, sdu); break
     case "READFILE" : response = await READFILE(PAYLOAD, OID, sdu); break
     case "WRITEFILE" : response = await WRITEFILE(PAYLOAD, OID, sdu); break
     case "MAKEDIR" : response = await MAKEDIR(PAYLOAD, OID, sdu); break
     case "MAKEFILE" : response = await MAKEFILE(PAYLOAD, OID, sdu); break
     case "RENAME" : response = await RENAME(PAYLOAD, OID, sdu); break
     default: response = defopera(OPERA);
  };
  return response;
}
