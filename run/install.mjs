"use strict";

/** the program that installs :
 *  moves the gce source code and binary to the appropriate location, and install
 *  the default gcce if supported.
 * @author david, pass-me-dachips
 */

import { copyFileSync, cpSync } from "node:fs";
import { execSync } from "node:child_process";
import { homedir, platform } from "node:os";
import { join } from "node:path";

const supportedPlatforms = ["android", "linux", "win32", "darwin"];

const osplatform = platform();
const oshomedir = homedir();
const cwd = process.cwd();

if (supportedPlatforms.includes) {
  const shared = join(oshomedir, "gce", "shared");
  const sharedPath = {
    android: "/data/data/com.termux/files/home/gce/shared",
    darwin: shared,
    linux: shared,
    win32: shared,
  };

  const localSharedPath = join(cwd, "shared");
  cpSync(localSharedPath, sharedPath[osplatform], { recursive: true });
  // copies the source code to the appropriate destination: [home]/gce/shared.

  let localBin = join(cwd, "gce");
  if (osplatform === "win32") localBin = localBin + ".exe";

  const osUsrBinPath = {
    android: "/data/data/com.termux/files/usr/bin/gce",
    darwin: "/usr/local/bin/gce",
    linux: "/usr/local/bin/gce",
    win32: "C:\\System32\\gce",
  };
  // if (osplatform === "linux" || osplatform === "darwin") {
  //   const command = `sudo cp ${local_exec_path} ${_os_exec_path[osplatform]}`;
  //   execSync(command);
  //   // on posix, due to permission resitrictions, instead of copying the file
  //   // using node, the installer runs the command that allows the `superuser` to copy
  //   // the file instead: you might be promted to input your password
  // } else {
  //   copyFileSync(local_exec_path, _os_exec_path[osplatform]);
  // }
  // // copies the gce executable to the appropriate destination.

  // console.log(`
  //   ██████╗  ██████╗███████╗
  //  ██╔════╝ ██╔════╝██╔════╝
  //  ██║  ███╗██║     █████╗
  //  ██║   ██║██║     ██╔══╝
  //  ╚██████╔╝╚██████╗███████╗
  //   ╚═════╝  ╚═════╝╚══════╝
  // `);
  // console.log("grand code environment v1.0.0");
  // console.log(
  //   "\x1b[92mcompleted installation! run `gce` for confirmation.\x1b[0m"
  // );
  // console.log(
  //   "need quick help? run `\x1b[92mgce --help\x1b[0m` for more information."
  // );
  // console.log(
  //   "want to start a service? run `\x1b[92mgce <relative/path/to/file/or/dir>\x1b[0m`"
  // );
} else console.log("unsupported platform %s", osplatform);
