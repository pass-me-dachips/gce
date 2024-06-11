"use strict";

/** the program that packages the code to a distrib-ready format
 * @author david, pass-me-dachips
 */

import { copyFileSync, cpSync } from "node:fs";
import { execSync } from "node:child_process";
import { platform as osPlatform } from "node:os";
import { join } from "node:path";


const platform = osPlatform();
const sharedPath = join("distrib", platform , "shared");

console.log("[-] Copying the source code");
cpSync("src", join(sharedPath, "src"), { recursive: true });
cpSync("node_modules", join(sharedPath, "node_modules"), { recursive: true });
cpSync("man", join(sharedPath, "man"), { recursive: true });
copyFileSync("package.json", join(sharedPath, "package.json"));
console.log("\x1b[92m[-] Copied the source code successfully!\n\x1b[0m");
// copies the source code to distrib/shared

console.log("[-] Copying Helper Files ");
const gcePath = join("run", "gce.nim");
const compileCommand = 
  `nim c -d:release --app:console --outDir:${join("distrib", platform)} --opt:speed ${gcePath}`;
execSync(compileCommand);

const installPath = join("run", "install.mjs");
copyFileSync(installPath, join("distrib", platform, "install.mjs"));
console.log("\x1b[92m[-] Copied Helper Files successfully!\n\x1b[0m");
// copies the helper files: gce, install.mjs to distrib

console.log(`\x1b[95m~! Go to /distrib/${platform} to see results.\x1b[0m`);
