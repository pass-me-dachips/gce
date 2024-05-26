"use strict";

// import {
//   adminRemoveFs,
//   copyDir,
//   copyF,
//   createDir,
//   createFile,
//   fileWrite,
//   moveDir,
//   moveFile,
//   renameFs,
//   restore,
//   toTrash
// } from "../opera/write.js";
// import { basename, join } from "node:path";
// import { code_0 } from "../codes.js";
// import { defopera } from "./default.js";
// import { dirRead, fileRead, getStatistics } from "../opera/read.js";
// import { ERRORCODES } from "../../../var/system.js";
// import { report } from "../../../etc/report.js";

// export function errorResponseHelper(error, oid) {
//   if (error.code  === ERRORCODES.notFound) {
//       return JSON.stringify(code_0(false, "ENOENTRY", oid, null));
//   } else if (error.code === ERRORCODES.notdirectory ||
//       error.code === ERRORCODES.notFile || error.code === "ERR_FS_CP_NON_DIR_TO_DIR"
//     ) {
//       return JSON.stringify(code_0(false, "OSFORBIDEN", oid, null));
//   } else if (error.code === ERRORCODES.exists) {
//       return JSON.stringify(code_0(false, "DUPKEY", oid, null));
//   } else if (error.code === ERRORCODES.online) {
//       return JSON.stringify(code_0(false, "ONLINE", oid, null));
//   } else return JSON.stringify(code_0(false, "STDERR", oid, error.message));
// }

// async function READDIR(relativePath, oid, sdu) {
//   try {
//     // the readdir expects the payload to be the relative path to the file in
//     // which the user wants to read.
//     const { servicePath } = sdu;
//     const pathToDir = join(servicePath, relativePath);
//     const entries = await dirRead(pathToDir);
//     return JSON.stringify(code_0(true, "ACK/HASPAYLOAD", oid, entries));
//   } catch(error) {
//     return errorResponseHelper(error, oid);
//   }
// }

// async function STATICS(relativePath, oid, sdu) {
//   try {
//     // the readdir expects the payload to be the relative path to the file in
//     // which the user wants to read.
//     const { servicePath } = sdu;
//     const path = join(servicePath ,relativePath);
//     const statistics = await getStatistics(path);
//     return JSON.stringify(code_0(true, "ACK/HASPAYLOAD", oid, statistics));
//   } catch (error) {
//     return errorResponseHelper(error, oid);
//   }
// }

// async function READFILE(payload, oid, sdu) {
//   try {
//     const { path, useDefault, window, lineHeight, page, startLine} = payload;
//     if (path && typeof useDefault === "boolean") {
//       const filePath = join(sdu.servicePath, path);
//       const content = await fileRead(
//         filePath, useDefault, window, lineHeight, page, startLine
//       );
//       return JSON.stringify(code_0(true, "ACK/HASPAYLOAD", oid, content));
//     } else throw {
//       message : "READFILE requires the path and useDefualt fields."
//     };
//   } catch (error) {
//     return errorResponseHelper(error, oid);
//   }
// }

// async function WRITEFILE(payload, oid, sdu) {
//   try {
//     const { path, content } = payload;
//     if (path && content) {
//       const filePath = join(sdu.servicePath, path);
//       const { bytesWritten } = await fileWrite(filePath, content);
//       report(`wrote ${bytesWritten}B to ${path}`, oid);
//       return JSON.stringify(code_0(true, "ACK/HASPAYLOAD", oid, bytesWritten));
//     } else throw {
//       message : "WRITEFILE requires the path and content fields."
//     };
//   } catch (error) {
//     return errorResponseHelper(error, oid);
//   }
// }

// async function MAKEDIR(relativePath, oid, sdu) {
//   try {
//     const { servicePath } = sdu;
//     const pathToDir = join(servicePath, relativePath);
//     await createDir(pathToDir);
//     report(
//       `made directory ${relativePath.endsWith("/")?relativePath:relativePath+'/'}`,
//       oid
//     );
//     return JSON.stringify(code_0(true, "ACK", oid, null));
//   } catch(error) {
//     return errorResponseHelper(error, oid);
//   }
// }

// async function MAKEFILE(relativePath, oid, sdu) {
//   try {
//     const { servicePath } = sdu; const pathToDir = join(servicePath, relativePath);
//     await createFile(pathToDir); report( `wrote 0B (make) to ${relativePath}`, oid);
//     return JSON.stringify(code_0(true, "ACK", oid, null));
//   } catch(error) { return errorResponseHelper(error, oid); }
// }

// async function RENAME(payload, oid, sdu) {
//   try {
//     const { servicePath } = sdu;
//     const { path, new_basename } = payload;
//     if (path && new_basename) {
//       const pathToFs = join(servicePath, path);
//       await renameFs(pathToFs, new_basename);
//       report( `rn ${path} -> ${new_basename}`, oid);
//       return JSON.stringify(code_0(true, "ACK", oid, null));
//     } else throw {
//       message : "RENAME requires the path and new_basename fields."
//     };
//   } catch(error) { return errorResponseHelper(error, oid); }
// }

// async function ADMINREMOVE(relativePath, oid, sdu) {
//   try {
//     const { servicePath } = sdu;
//     const pathToFs = join(servicePath, relativePath);
//     await adminRemoveFs(pathToFs);
//     report(`dangerously removed ${relativePath}`, "danger", oid);
//     return JSON.stringify(code_0(true, "ACK", oid, null));
//   } catch (error) { return errorResponseHelper(error, oid); }
// }

// async function COPYDIR(payload, oid, sdu) {
//   try {
//     const { servicePath } = sdu;
//     let { source, dest } = payload;
//     if ( source && dest ) {
//       source = join(servicePath, source);
//       dest = join(servicePath, dest);
//       await copyDir(source, dest);
//       report(`copied dir ${payload.source} -> ${payload.dest}`, oid);
//       return JSON.stringify(code_0(true, "ACK", oid, null));
//     } else throw {
//       message : "COPYDIR requires the source and dest fields."
//     }
//   } catch (error) {
//     return errorResponseHelper(error, oid);
//   }
// }

// async function COPYFILE(payload, oid, sdu) {
//   try {
//     const { servicePath } = sdu;
//     let { source, dest } = payload;
//     if ( source && dest ) {
//       source = join(servicePath, source); dest = join(servicePath, dest);
//       await copyF(source, dest);
//       report(`copied file ${payload.source} -> ${payload.dest}`, oid);
//       return JSON.stringify(code_0(true, "ACK", oid, null));
//     } else throw {
//       message : "COPYFILE requires the source and dest fields."
//     }
//   } catch (error) { return errorResponseHelper(error, oid); }
// }

// async function MOVEDIR(payload, oid, sdu) {
//   try {
//     const { servicePath } = sdu; let { source, dest } = payload;
//     if ( source & dest ) {
//       source = join(servicePath, source); dest = join(servicePath, dest);
//       await moveDir(source, dest);
//       report(`moved dir ${payload.source} -> ${payload.dest}`, oid, "danger");
//       return JSON.stringify(code_0(true, "ACK", oid, null));
//     } else throw {
//       message : "MOVEDIR requires the source and dest fields."
//     }
//   } catch (error) { return errorResponseHelper(error, oid); }
// }

// async function MOVEFILE(payload, oid, sdu) {
//   try {
//     const { servicePath } = sdu; let { source, dest } = payload;
//     if ( source & dest ) {
//       source = join(servicePath, source); dest = join(servicePath, dest);
//       await moveFile(source, dest);
//       report(`moved file ${payload.source} -> ${payload.dest}`, oid);
//       return JSON.stringify(code_0(true, "ACK", oid, null));
//     } else throw {
//       message : "MOVEFILE requires the source and dest fields."
//     }
//   } catch (error) { return errorResponseHelper(error, oid); }
// }

// async function REMOVE(payload, oid, sdu) {
//   try {
//     const { servicePath, serviceId } = sdu;
//     let { isFile, path } = payload;
//     if ("isFile" in payload && path) {
//       path = join(servicePath, path);
//       const pointer = await toTrash(serviceId, isFile, basename(path), path);
//       report(`removed (shift) ${payload.path} -> ${pointer}`, oid);
//       return JSON.stringify(code_0(true, "ACK/HASPAYLOAD", oid, pointer));
//     } else throw {
//       message : "REMOVE requires the isFile and path fields."
//     }
//   } catch (error) { return errorResponseHelper(error, oid); }
// }

// async function RESTORE(pointer, oid, sdu) {
//   try {
//     const { serviceId } = sdu;
//     await restore(serviceId, pointer);
//     report(`restored (reverse-shift) ${pointer}`, oid);
//     return JSON.stringify(code_0(true, "ACK", oid, null));
//   } catch (error) { return errorResponseHelper(error, oid); }
// }

/** a function that handles service api requests and responses for fs operations
 * @author david, pass-me-dachips
 * @param {string} opera the operation
 * @param {string} oid the operation id
 * @param {object} sdu the service data unit which must include the request body
 * @param {object} res the response object
 * @returns {void}
 */

export default async function fs(opera, oid, sdu, res) {
  console.log(sdu, opera, oid);
  switch (opera) {
    case "READDIR":
      break;
    case "STATICS":
      break;
    case "READFILE":
      break;
    case "WRITEFILE":
      break;
    case "MAKEDIR":
      break;
    case "MAKEFILE":
      break;
    case "RENAME":
      break;
    case "ADMINREMOVE":
      break;
    case "COPYDIR":
      break;
    case "COPYFILE":
      break;
    case "MOVEDIR":
      break;
    case "MOVEFILE":
      break;
    case "REMOVE":
      break;
    case "RESTORE":
      break;
    default:
    // response = res;
  }
}
