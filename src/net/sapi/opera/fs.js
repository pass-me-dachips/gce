"use strict";

/**
 * in next version, would merge all `
 *  finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${source_raw} -> ${dest_raw}.`
        ),
        res
      );
  ` to a single function, so as to reduce code size.
 */

import {
  adminRemoveFs,
  copyDir,
  copyF,
  createDir,
  createFile,
  fileWrite,
  moveDir,
  moveFile,
  renameFs,
  restore,
  toTrash,
} from "../io/write.js";
import { basename, join } from "node:path";
import { code_0, code_1 } from "../codes.js";
import { dirRead, fileRead, getStatistics } from "../io/read.js";
import { ERRORCODES } from "../../../var/system.js";
import finish from "../finish.js";
import { report } from "../../../etc/report.js";

export function errorResponseHelper(error, oid) {
  if (error.code === ERRORCODES.notFound) {
    return code_0(false, "ENOENTRY", oid, null);
  } else if (
    error.code === ERRORCODES.notdirectory ||
    error.code === ERRORCODES.notFile ||
    error.code === "ERR_FS_CP_NON_DIR_TO_DIR"
  ) {
    return code_0(false, "OSFORBIDEN", oid, null);
  } else if (error.code === ERRORCODES.exists) {
    return code_0(false, "DUPKEY", oid, null);
  } else if (error.code === ERRORCODES.online) {
    return code_0(false, "ONLINE", oid, null);
  } else return code_0(false, "STDERR", oid, error.message);
}

async function READDIR(sdu, oid, res) {
  try {
    const path = sdu.searchParams.get("path");
    if (sdu.method === "GET" && path) {
      const { servicePath } = sdu;
      const pathToDir = join(servicePath, path);
      const entries = await dirRead(pathToDir);
      finish(200, code_0(true, "ACK/HASPAYLOAD", oid, entries), res);
    } else
      finish(
        400,
        code_1(`cannot find a handler for request ${sdu.method} -> ${path}`),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function STATICS(sdu, oid, res) {
  try {
    let path = sdu.searchParams.get("path");
    if (sdu.method === "GET" && path) {
      const { servicePath } = sdu;
      path = join(servicePath, path);
      const statistics = await getStatistics(path);
      finish(200, code_0(true, "ACK/HASPAYLOAD", oid, statistics), res);
    } else
      finish(
        400,
        code_1(`cannot find a handler for request ${sdu.method} -> ${path}`),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function READFILE(sdu, oid, res) {
  try {
    const queryGet = (name) => sdu.searchParams.get(name);
    let path = queryGet("path");
    const useDefault = queryGet("useDefault");
    const window = queryGet("window");
    const lineHeight = queryGet("lineHeight");
    const page = queryGet("page");
    const startLine = queryGet("startLine");
    if (
      sdu.method === "GET" &&
      path &&
      (useDefault === "true" || useDefault === "false")
    ) {
      path = join(sdu.servicePath, path);
      const content = await fileRead(
        path,
        useDefault === "true" ? true : false,
        window,
        lineHeight,
        page,
        startLine
      );
      finish(200, code_0(true, "ACK/HASPAYLOAD", oid, content), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${path}. query params does not meet the requirements`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function WRITEFILE(sdu, oid, res) {
  try {
    const path_cache = sdu.searchParams.get("path");
    let path = `${path_cache}`;
    const content = sdu.payload;
    if (sdu.method === "POST" && path && content) {
      path = join(sdu.servicePath, path);
      const { bytesWritten } = await fileWrite(path, content);
      report(`wrote ${bytesWritten}B to ${path_cache}`, oid);
      finish(200, code_0(true, "ACK/HASPAYLOAD", oid, bytesWritten), res);
    } else
      finish(
        400,
        code_1(`cannot find a handler for request ${sdu.method} -> ${path}.`),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function MAKEDIR(sdu, oid, res) {
  try {
    let path_raw = sdu.searchParams.get("path");
    if (sdu.method === "PUT" && path_raw) {
      const path = join(sdu.servicePath, path_raw);
      await createDir(path);
      report(
        `made directory ${path_raw.endsWith("/") ? path_raw : path_raw + "/"}`,
        oid
      );
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${path_raw}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function MAKEFILE(sdu, oid, res) {
  try {
    let path_raw = sdu.searchParams.get("path");
    if (sdu.method === "PUT" && path_raw) {
      const path = join(sdu.servicePath, path_raw);
      await createFile(path);
      report(`wrote 0B (make) to ${path_raw}`, oid);
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${path_raw}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function RENAME(sdu, oid, res) {
  try {
    let path_raw = sdu.searchParams.get("path");
    let new_base = sdu.searchParams.get("new_base");
    if (sdu.method === "PUT" && path_raw && new_base) {
      const path = join(sdu.servicePath, path_raw);
      await renameFs(path, new_base);
      report(`rn ${path_raw} -> ${new_base}`, oid);
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${path_raw}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function ADMINREMOVE(sdu, oid, res) {
  try {
    let path_raw = sdu.searchParams.get("path");
    if (sdu.method === "DELETE" && path_raw) {
      const path = join(sdu.servicePath, path_raw);
      await adminRemoveFs(path);
      report(`dangerously removed ${path_raw}`, "danger", oid);
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${path_raw}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function COPYDIR(sdu, oid, res) {
  try {
    const source_raw = sdu.searchParams.get("source");
    const dest_raw = sdu.searchParams.get("dest");
    if (sdu.method === "PUT" && source_raw && dest_raw) {
      const source = join(sdu.servicePath, source_raw);
      const dest = join(sdu.servicePath, dest_raw);
      await copyDir(source, dest);
      report(`copied dir ${source_raw} -> ${dest_raw}`, oid);
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${source_raw} -> ${dest_raw}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function COPYFILE(sdu, oid, res) {
  try {
    const source_raw = sdu.searchParams.get("source");
    const dest_raw = sdu.searchParams.get("dest");
    if (sdu.method === "PUT" && source_raw && dest_raw) {
      const source = join(sdu.servicePath, source_raw);
      const dest = join(sdu.servicePath, dest_raw);
      await copyF(source, dest);
      report(`copied file ${source_raw} -> ${dest_raw}`, oid);
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${source_raw} -> ${dest_raw}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function MOVEDIR(sdu, oid, res) {
  try {
    const source_raw = sdu.searchParams.get("source");
    const dest_raw = sdu.searchParams.get("dest");
    if (sdu.method === "PUT" && source_raw && dest_raw) {
      const source = join(sdu.servicePath, source_raw);
      const dest = join(sdu.servicePath, dest_raw);
      await moveDir(source, dest);
      report(`moved dir ${source_raw} -> ${dest_raw}`, oid, "danger");
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${source_raw} -> ${dest_raw}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function MOVEFILE(sdu, oid, res) {
  try {
    const source_raw = sdu.searchParams.get("source");
    const dest_raw = sdu.searchParams.get("dest");
    if (sdu.method === "PUT" && source_raw && dest_raw) {
      const source = join(sdu.servicePath, source_raw);
      const dest = join(sdu.servicePath, dest_raw);
      await moveFile(source, dest);
      report(`moved file ${source_raw} -> ${dest_raw}`, oid);
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${source_raw} -> ${dest_raw}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function REMOVE(sdu, oid, res) {
  try {
    const { servicePath, serviceId } = sdu;
    const path_raw = sdu.searchParams.get("path");
    let isFile = sdu.searchParams.get("isfile");
    if (sdu.method === "DELETE" && path_raw && isFile) {
      isFile = isFile === "true" ? true : false;
      const path = join(servicePath, path_raw);
      const pointer = await toTrash(serviceId, isFile, basename(path), path);
      report(`removed (shift) ${path_raw} -> ${pointer}`, oid);
      finish(200, code_0(true, "ACK/HASPAYLOAD", oid, pointer), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${path_raw}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

async function RESTORE(sdu, oid, res) {
  try {
    const pointer = sdu.searchParams.get("pointer");
    const { serviceId } = sdu;
    if (sdu.method === "PUT" && pointer) {
      await restore(serviceId, pointer);
      report(`restored (reverse-shift) ${pointer}`, oid);
      finish(200, code_0(true, "ACK", oid, null), res);
    } else
      finish(
        400,
        code_1(
          `cannot find a handler for request ${sdu.method} -> ${pointer}.`
        ),
        res
      );
  } catch (error) {
    finish(200, errorResponseHelper(error, oid), res);
  }
}

/** a function that handles service api requests and responses for fs operations
 * @author david, pass-me-dachips
 * @param {string} opera the operation
 * @param {string} oid the operation id
 * @param {object} sdu the service data unit which must include the request body
 * @param {object} res the response object
 * @returns {void}
 */

export default async function fs(opera, oid, sdu, res) {
  switch (opera.toUpperCase()) {
    case "READDIR":
      READDIR(sdu, oid, res);
      break;
    case "STATICS":
      STATICS(sdu, oid, res);
      break;
    case "READFILE":
      READFILE(sdu, oid, res);
      break;
    case "WRITEFILE":
      WRITEFILE(sdu, oid, res);
      break;
    case "MAKEDIR":
      MAKEDIR(sdu, oid, res);
      break;
    case "MAKEFILE":
      MAKEFILE(sdu, oid, res);
      break;
    case "RENAME":
      RENAME(sdu, oid, res);
      break;
    case "ADMINREMOVE":
      ADMINREMOVE(sdu, oid, res);
      break;
    case "COPYDIR":
      COPYDIR(sdu, oid, res);
      break;
    case "COPYFILE":
      COPYFILE(sdu, oid, res);
      break;
    case "MOVEDIR":
      MOVEDIR(sdu, oid, res);
      break;
    case "MOVEFILE":
      MOVEFILE(sdu, oid, res);
      break;
    case "REMOVE":
      REMOVE(sdu, oid, res);
      break;
    case "RESTORE":
      RESTORE(sdu, oid, res);
      break;
    default:
      finish(400, code_1(`unknown operation: ${opera}`), res);
  }
}
