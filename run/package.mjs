"use strict";

/** the program that packages the code to a distrib-ready format
 * @author david, super-user-d0
 */

import { copyFileSync, cpSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { platform as osPlatform } from "node:os";
import { join } from "node:path";

const platform = osPlatform();
const destinationName = `gce-v1.0.0-${platform}`;
const sharedPath = join("distrib", destinationName, "shared");

console.log("[-] Copying the source code");
cpSync("src", join(sharedPath, "src"), { recursive: true });
cpSync("node_modules", join(sharedPath, "node_modules"), { recursive: true });
cpSync("man", join(sharedPath, "man"), { recursive: true });
copyFileSync("package.json", join(sharedPath, "package.json"));
console.log("\x1b[92m[-] Copied the source code successfully!\n\x1b[0m");
// copies the source code to distrib/shared

console.log("[-] Copying Helper Files ");
const gcePath = join("run", "gce.nim");
const compileCommand = `nim c -d:release --app:console --outDir:${join(
  "distrib",
  destinationName
)} --opt:speed ${gcePath}`;
execSync(compileCommand);

const installPath = join("run", "install.mjs");
copyFileSync(installPath, join("distrib", destinationName, "install.mjs"));
console.log("\x1b[92m[-] Copied Helper Files successfully!\n\x1b[0m");
// copies the helper files: gce, install.mjs to distrib

console.log("[-] Copying Kivana ");
cpSync(join("run", "kivana"), join("distrib", destinationName, "kivana"), {
  recursive: true,
});
console.log("\x1b[92m[-] Copied Kivana successfully!\n\x1b[0m");

if (platform === "linux" || platform === "darwin" || platform === "android") {
  process.chdir("distrib");
  const command = `zip -r ${destinationName}.zip ${destinationName}`;
  execSync(command);
  rmSync(destinationName, { recursive: true });
}

console.log("\x1b[95m~! Go to /distrib to see results.\x1b[0m");
