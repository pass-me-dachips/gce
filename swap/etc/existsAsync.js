
import { access, constants } from "fs/promises";

export async function existsAsync(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch(error) {
    return false;
  }
}