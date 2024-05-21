
"use strict";

/** the program that installs the gce source code to the appropriate location.
 * @author david, pass-me-dachips
 */

import { copyFileSync, cpSync } from "node:fs";
import { join } from "node:path";
import { homedir, platform } from "node:os";
import { execSync } from "node:child_process";

const osplatform = platform();
const oshomedir = homedir();

const _shared_global_path_os_helper = join(oshomedir, "gce" , "shared");
const _shared_global_path =  {
  android: "/data/data/com.termux/files/apps/gce/shared",
  darwin: _shared_global_path_os_helper,
  linux: _shared_global_path_os_helper,
  win32: _shared_global_path_os_helper,
}

const shared_global_path_entry_
     = join(_shared_global_path[osplatform], "src", "gce.js");
export const shared_entry_point = {
  android: shared_global_path_entry_,
  darwin: shared_global_path_entry_, 
  linux: shared_global_path_entry_, 
  win32: shared_global_path_entry_
}

const _shared_downloads_abspath = join(process.cwd(), "shared");
cpSync(
   _shared_downloads_abspath, _shared_global_path[osplatform], { recursive: true }
);
// copies the source code to the appropriate destination.


const _exec_abspath = join(process.cwd(), "gce");
if ( osplatform === "win32" ) _exec_abspath = _exec_abspath + ".exe";

const _os_exec_path =  {
  android: "/data/data/com.termux/files/usr/bin/gce",
  darwin: "/usr/local/bin/gce",
  linux: "/usr/local/bin/gce",
  win32: "C:\\System32\\gce"
}
if (osplatform === "linux") {
  const command = `sudo cp ${_exec_abspath} ${_os_exec_path[osplatform]}`;
  execSync(command);
} else {
  copyFileSync(_exec_abspath, _os_exec_path[osplatform]);
}
// copies the gce executable to the appropriate destination.

console.log("installation completed!. run `gce --help` to confirm installation");
