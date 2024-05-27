"use strict";

/** the program that packages the code to a distrib-ready format
 * @author david, pass-me-dachips
 */

import { copyFileSync, cpSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const shared_path = join("distrib", "shared");

console.log("copying shared code: ");
cpSync("src", join(shared_path, "src"), { recursive: true });
cpSync("node_modules", join(shared_path, "node_modules"), { recursive: true });
cpSync("man", join(shared_path, "man"), { recursive: true });
copyFileSync("package.json", join(shared_path, "package.json"));
console.log("\x1b[92mcopied shared code successfully!\n\x1b[0m");
console.log("copying helpers: ");
// copies the source code to distrib/shared

const gce_path = join("run", "gce.nim");
const compile_command = `nim c -d:release --app:console --outDir:distrib --opt:speed ${gce_path}`;
execSync(compile_command);
const install_path = join("run", "install.mjs");
copyFileSync(install_path, join("distrib", "install.mjs"));
console.log("\x1b[92mcopied helpers successfully!\n\x1b[0m");
// copies the helpers: gce, install.mjs to distrib

console.log(
  `\x1b[95mcompleted packaging!. go to /distrib to see results.\x1b[0m`
);
