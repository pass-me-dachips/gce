"use strict";

import { access, constants } from "fs/promises";

/**
 * Asynchronoulsy checks if the file exists. returns true if the path exists,
 * false otherwise.
 * @author david, super-user-d0
 * @param {string} path
 * @returns {bool}
 */
export async function existsAsync(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}
