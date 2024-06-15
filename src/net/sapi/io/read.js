"use strict";

/* ** This file contains utility functions for read operations **** */
import { join } from "node:path";
import { readFile, stat, readdir } from "node:fs/promises";
import { SYSTEM } from "../../../var/system.js";

/**
 * reads a file in a more efficient way
 * @author david, super-user-d0
 * @param {string} path the path to the file
 * @param {bool} useDefault a bool indicating wether to use the default read
 * operation or with optimization (pagination)
 * @param {number} window the size of the window, if useDefault is set to false
 * @param {number} lineHeight the height of each line(px) in your interface.
 * only useful if useDefault is set to false.
 * @param {number} page the number of page to return. only useful if useDefault is set to false.
 * @param {number} startLine  the line to start reading from. only useful if useDefault is set to false.
 * @returns {object}
 */
export async function fileRead(
  path,
  useDefault,
  window = 800,
  lineHeight = 17,
  page = 1,
  startLine = 0
) {
  try {
    window = Number(window);
    lineHeight = Number(lineHeight);
    page = Number(page);
    startLine = Number(startLine);
    //convert strings to integers
    const { size, mtime } = await stat(path);
    const data = await readFile(path, SYSTEM.encoding);
    const response = { size, lmodified: mtime };
    if (useDefault) (response["data"] = data), (response["usedDefault"] = true);
    else {
      if (size >= Math.pow(1024, 2) * 1) {
        const lines = data.split("\n");
        const linesPerPage = Math.round(window / lineHeight);
        //+++++++ the number of lines that can be visible without scrolling.
        const linesRendering = linesPerPage * page;
        response["data"] = lines
          .slice(startLine, linesRendering + startLine)
          .join("\n");
        response["usedDefault"] = false;
      } else (response["data"] = data), (response["usedDefault"] = true);
      //+++++ if the size is less than 1mb, useDefault
    }
    return response;
  } catch (error) {
    throw error;
  }
}

/* the dirRead does not provide any optimization technique for reducing file load
 times and eleminating freezing on large file systems for now.
 for this reason, the dir read only supports batch reading and not iteratively
 which means you can only read diret children of a directory */
export async function dirRead(path) {
  try {
    const fsNames = await readdir(path, SYSTEM.encoding);
    const fsLists = [];
    for (let i = 0; i < fsNames.length; i++) {
      const fs = fsNames[i];
      const stats = await stat(join(path, fs));
      fsLists.push({
        name: fs,
        type: stats.isDirectory() ? "DIR" : "FILE",
        size: stats.isDirectory() ? 0 : stats.size,
      });
    }
    return fsLists;
  } catch (error) {
    throw error;
  }
}

export async function getStatistics(path) {
  try {
    const stats = await stat(path);
    return {
      path: path,
      size: stats.isDirectory() ? 0 : stats.size,
      created: stats.ctime,
      lmodified: stats.mtime,
      isDir: stats.isDirectory(),
    };
  } catch (error) {
    throw error;
  }
}
