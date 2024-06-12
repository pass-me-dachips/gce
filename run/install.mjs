"use strict";

/** the program that installs :
 *  moves the gce source code and start script to the appropriate location.
 * @author david, pass-me-dachips
 */

import { copyFileSync, cpSync } from "node:fs";
import { execSync, exec } from "node:child_process";
import { homedir, platform } from "node:os";
import { join } from "node:path";

const supportedPlatforms = ["android", "linux", "win32", "darwin"];

const osplatform = platform();
const oshomedir = homedir();
const cwd = process.cwd();

if (supportedPlatforms.includes) {
  console.log("[-] Installing gce version 1.0.0");

  const shared = join(oshomedir, "gce", "shared");
  const sharedPath = {
    android: "/data/data/com.termux/files/home/gce/shared",
    darwin: shared,
    linux: shared,
    win32: shared,
  };

  const localSharedPath = join(cwd, "shared");
  cpSync(localSharedPath, sharedPath[osplatform], { recursive: true });
  console.log(
    "[-] Copied the source code to %s \x1b[92m(Done)\x1b[0m",
    sharedPath[osplatform]
  ); // copies the source code to the appropriate location: [home]/gce/shared.

  let localBin = join(cwd, "gce");
  if (osplatform === "win32") localBin = localBin + ".exe";

  const osUsrBinPath = {
    android: "/data/data/com.termux/files/usr/bin/gce",
    darwin: "/usr/local/bin/gce",
    linux: "/usr/local/bin/gce",
    win32: "C:\\Program Files\\gce",
  };

  console.log(
    "[-] Copying the start script (gce) to %s",
    osUsrBinPath[osplatform]
  );

  const logAfterCopying = `[-] Copied the start script to ${osUsrBinPath[osplatform]} \x1b[92m(Done)\x1b[0m`;
  const logBeforeAddingPerm = "[-] Adding execution permission";
  const logAfterAddingPerm =
    "[-] Added execution permission \x1b[92m(Done)\x1b[0m";

  if (osplatform === "linux" || osplatform === "darwin") {
    const copy = `sudo cp ${localBin} ${osUsrBinPath[osplatform]}`;
    execSync(copy);
    // on posix, due to permission restrictions, instead of copying the file
    // using node, the installer runs the command with `superuser` priviledges to
    // copy the file instead: you might be promted to input your password.
    console.log(logAfterCopying);
    console.log(logBeforeAddingPerm);

    const setExecPermission = `sudo chmod +x ${osUsrBinPath[osplatform]}`;
    execSync(setExecPermission);
    console.log(logAfterAddingPerm);
  } else if (osplatform === "win32") {
    copyFileSync(localBin, osUsrBinPath[osplatform]);
    console.log(logAfterCopying);
    console.log(
      `What's next? Add \`${osUsrBinPath[osplatform]}\` to the environment variable to ensure gce runs globally on your machine.`
    );
  } else {
    // assuming platform === android
    copyFileSync(localBin, osUsrBinPath[osplatform]);
    console.log(logAfterCopying);
    console.log(logBeforeAddingPerm);

    const setExecPermission = `chmod +x ${osUsrBinPath[osplatform]}`;
    execSync(setExecPermission);
    console.log(logAfterAddingPerm);
  } // copies the gce start script to the appropriate location.

  console.log("[-] Copying gcce kivana");
  const gcces = join(oshomedir, "gce", "gcces");
  const gccesPath = {
    android: "/data/data/com.termux/files/home/gce/gcces",
    darwin: gcces,
    linux: gcces,
    win32: gcces,
  };
  const kivanaPath = join(gccesPath[osplatform], "kivana");
  cpSync(join(cwd, "kivana"), kivanaPath, { recursive: true });
  console.log("[-] Copied kivana to %s \x1b[92m(Done)\x1b[0m", kivanaPath);
  // copies kivana to the appropriate location: [home]/gce/gcces/kivana.

  console.log("[-] Installing kivana 1.0.0 \n");

  process.chdir(gccesPath[osplatform]);
  const install_kivana = "gce install kivana";
  exec(install_kivana, (error, stdout) => {
    if (!error && stdout.includes("gcce successfully installed!")) {
      console.log(stdout);
      console.log(`
          ██████╗  ██████╗███████╗
         ██╔════╝ ██╔════╝██╔════╝
         ██║  ███╗██║     █████╗
         ██║   ██║██║     ██╔══╝
         ╚██████╔╝╚██████╗███████╗
          ╚═════╝  ╚═════╝╚══════╝
          `);
      console.log("Installation completed! Run `gce` for confirmation.");
      console.log("Need quick help? Run `gce --help`.");
      console.log("Want to start a service? Run `gce <relative/path/to/fs>`");
      //..
    } else {
      console.log(stdout);
      console.log(
        `Cannot install kivana. Try installing it manually using \`gce install kivana\` in the directory: ${gccesPath[osplatform]}. \n\n`
      );
      console.log(
        `Are you sure gce was successfully installed? If you are on windows, gce recommends adding the PATH to the system environment variable before running \`gce install kivana\` in the directory: ${gccesPath[osplatform]}. \n\n`
      );
      console.log(
        "If you are on mac or linux, gce recommends checking the path : `/usr/local/bin` to crosscheck if the gce executable is present.\n\n"
      );
      console.log(
        "If These issues still persists, please reach out to our community at https://t.me/grand_code_environmen/5"
      );
    }
  });
  // install kivana
} else console.log("unsupported platform %s", osplatform);
