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

const shared_helper = join(oshomedir, "gce", "shared");
const _shared_path = {
  android: "/data/data/com.termux/files/home/gce/shared",
  darwin: shared_helper,
  linux: shared_helper,
  win32: shared_helper,
};

const local_shared_path = join(process.cwd(), "shared");
cpSync(local_shared_path, _shared_path[osplatform], { recursive: true });
// copies the source code to the appropriate destination: home/gce/shared.

const local_exec_path = join(process.cwd(), "gce");
if (osplatform === "win32") local_exec_path = local_exec_path + ".exe";

const _os_exec_path = {
  android: "/data/data/com.termux/files/usr/bin/gce",
  darwin: "/usr/local/bin/gce",
  linux: "/usr/local/bin/gce",
  win32: "C:\\System32\\gce",
};
if (osplatform === "linux" || osplatform === "darwin") {
  const command = `sudo cp ${local_exec_path} ${_os_exec_path[osplatform]}`;
  execSync(command);
  // on posix, due to permission resitrictions, instead of copying the file
  // using node, the installer runs the command that allows the `superuser` to copy
  // the file instead: you might be promted to input your password
} else {
  copyFileSync(local_exec_path, _os_exec_path[osplatform]);
}
// copies the gce executable to the appropriate destination.

console.log(`
  ██████╗  ██████╗███████╗
 ██╔════╝ ██╔════╝██╔════╝
 ██║  ███╗██║     █████╗  
 ██║   ██║██║     ██╔══╝  
 ╚██████╔╝╚██████╗███████╗
  ╚═════╝  ╚═════╝╚══════╝
`);
console.log("grand code environment v1.0.0");
console.log(
  "\x1b[92mcompleted installation! run `gce` for confirmation.\x1b[0m"
);
console.log(
  "need quick help? run `\x1b[92mgce --help\x1b[0m` for more information."
);
console.log(
  "want to start a service? run `\x1b[92mgce <relative/path/to/file/or/dir>\x1b[0m`"
);
