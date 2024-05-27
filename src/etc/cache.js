"use strict";

import { cacheTemplate, extensionTable } from "../var/templates.js";
import { existsAsync } from "./existsAsync.js";
import { join } from "node:path";
import mergeObjects from "../local/cache/mergeObjects.js";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { report } from "./report.js";
import { SYSTEM, PATHS } from "../var/system.js";

class Env {
  constructor() {
    this.table = { ...cacheTemplate };
  }

  /** clears the cache
   * @author david, pass-me-dachips
   * @returns {void}
   */
  clear() {
    this.table = { ...cacheTemplate };
    return void 0;
  }

  /** adds fileName(extension) to the tech stack
   * @author david, pass-me-dachips
   * @returns {void}
   */
  addStack(fileName) {
    let extension;
    if (!fileName.includes(".")) extension = fileName;
    else {
      const portions = fileName.split(".");
      extension = portions[portions.length - 1];
    }
    extension = extensionTable[`E${extension}`] ?? extension;
    this.table.stack[extension] =
      this.table.stack[extension] !== undefined
        ? this.table.stack[extension] + 1
        : 1;
    this.table.lastUpdate = new Date();
    this.table.stackLastUpdate = String(new Date());
    return void 0;
  }

  /** returns the cached stack
   * @author david, pass-me-dachips
   * @returns {void}
   */
  getStack() {
    return this.table.stack;
  }

  /**
   * updates the total number of bytes written/dropped to files from the gce
   * throughout the entire service life-span
   * @author david, pass-me-dachips
   * @param {boolean} forDropped specifies if the update is for bytes dropped
   * @param {string} bytes the number of bytes
   * @returns {void}
   */
  fsupgradeBytes(forDropped, bytes) {
    bytes = Number(bytes);
    const placeholder = forDropped
      ? "total_bytes_dropped"
      : "total_bytes_written";
    const total_bytes = this.table.fs[placeholder];
    let bytesToWrite;
    if (total_bytes !== undefined) bytesToWrite = total_bytes + bytes;
    else bytesToWrite = bytes;
    this.table.fs[placeholder] = bytesToWrite;
    this.table.lastUpdate = new Date();
    return void 0;
  }

  /**
   * increaments the total numbers of directoies written/dropped throughout the
   * entire service life-span
   * @author david, pass-me-dachips
   * @param {boolean} forDropped specifies if the update is for dirs dropped
   * @returns {void}
   */
  fsupgradeDir(forDropped) {
    const placeholder = forDropped
      ? "total_dirs_dropped"
      : "total_dirs_written";
    const total_dirs = this.table.fs[placeholder];
    let newTotalDidr;
    if (total_dirs !== undefined) newTotalDidr = total_dirs + 1;
    else newTotalDidr = 1;
    this.table.fs[placeholder] = newTotalDidr;
    this.table.lastUpdate = new Date();
    return void 0;
  }

  /** returns the cached fs analytics
   * @author david, pass-me-dachips
   * @returns {void}
   */
  getFs() {
    return this.table.fs;
  }

  /** uploads cache/service meta data to service log after every minute
   * @author david, pass-me-dachips
   * @param {string} path path to service log
   * @returns {void}
   */
  handleUpload(path) {
    const TBI = 60000; //Time Before Interval: every 1 minute
    setInterval(async () => {
      try {
        const prevUpload = await readFile(path, SYSTEM.encoding);
        const newUpload = { ...JSON.parse(prevUpload) };
        newUpload["memUsage"] = process.memoryUsage();
        newUpload["uptime"] = process.uptime();
        newUpload["idleSince"] = this.table.lastUpdate;
        newUpload["fs"] = this.table.fs;
        await writeFile(
          path,
          JSON.stringify(newUpload, null, 4),
          SYSTEM.encoding
        );
        report("captured analytics", "SYSTEM", "others");
      } catch (error) {
        report(error.message, "SYSTEM", "others");
      }
    }, TBI);
    return void 0;
  }

  /** updates the global tech stack with cached
   * @author david, pass-me-dachips
   * @returns {void}
   */
  handleStackUpload() {
    //  const TBI = 120000; //Time Before Interval: every 2 minute
    const TBI = 4000; //Time Before Interval: every 2 minute
    let prevUpdateTime = null;
    setInterval(async () => {
      try {
        if (this.table.stackLastUpdate !== prevUpdateTime) {
          while (!(await existsAsync(PATHS.stack))) {
            await mkdir(PATHS.stack, { recursive: true });
          }
          const stackLock = join(PATHS.stack, ".stacklock");
          const trials = {
            tries: 0,
            qouta: 7,
          };
          const write = async () => {
            if (!(await existsAsync(stackLock))) {
              const stackpath = join(PATHS.stack, ".gcestack");
              let prevStackContents;
              if (await existsAsync(stackpath)) {
                const contents = JSON.parse(
                  await readFile(stackpath, SYSTEM.encoding)
                );
                prevStackContents = contents;
              } else prevStackContents = {};

              const newStackContents = mergeObjects(
                prevStackContents,
                this.table.stack
              );

              await writeFile(stackLock, "", SYSTEM.encoding);
              // lock the file so no any other running service can write to it.
              await writeFile(
                stackpath,
                JSON.stringify(newStackContents),
                SYSTEM.encoding
              );
              await rm(stackLock); //unlock the file.
              prevUpdateTime = this.table.stackLastUpdate;
            }
          };
          while (await existsAsync(stackLock)) {
            trials.tries = trials.tries + 1;
            if (trials.tries === trials.qouta) break;
            else await write();
          }
          await write();
        }
        // only handle writes if there are new updates on the service
        // programming stack.
      } catch {
        return void 0;
      }
    }, TBI);
    return void 0;
  }

  static EnvInstance() {
    if (!Env.instance) Env.instance = new Env();
    return Env.instance;
  }
}

/**
 * the gce's cache for handling stack updates, analytics, packages etc.
 * @author david, pass-me-dachips
 * @returns {void}
 */
const Cache = Env.EnvInstance();

export default Cache;
