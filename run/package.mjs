
"use strict";

/** the file that packages the code to a distrib-ready format
 * @author david, pass-me-dachips
 */

import { copyFileSync, cpSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { homedir, platform } from "node:os";
// import { shared_entry_point } from "./install.mjs";

const _shared_global_path_os_helper = join(homedir(), "gce" , "shared");
const shared_entry_point =  {
  android: "/data/data/com.termux/files/apps/gce/shared",
  darwin: _shared_global_path_os_helper,
  linux: _shared_global_path_os_helper,
  win32: _shared_global_path_os_helper,
}


const shared_path = join("distrib", "shared");

console.log("copying shared code : ")
cpSync("src", join(shared_path,  "src"), { recursive: true });
cpSync("node_modules", join(shared_path, "node_modules"), { recursive: true });
cpSync("man", join(shared_path, "man"), { recursive: true });
copyFileSync("package.json", join(shared_path, "package.json"));
console.log("\x1b[92mcopied shared code successfully!\n\x1b[0m");
console.log("copying helpers: ")
// copies the source code: shared to distrib

const gce_path = join("run", "gce.nim");
let prev_gce_content = readFileSync(gce_path, "ascii");
prev_gce_content = prev_gce_content.split("\n");
const path_index = 6 - 1;
prev_gce_content[path_index] = 
  `  const shared_path: string = \"${join(shared_entry_point[platform()],"src", "gce.js")} \"`;
prev_gce_content = prev_gce_content.join("\n");
writeFileSync(gce_path, prev_gce_content ,"ascii");
console.log("------> re-wrote gce data: path to shared \n");

/**
 * the reason the file is re-written instead of parsing params simply is because
 * the program depends completely on parameters as it only forwards params internally
 * to the gce source program written in node.
 */

const compile_command = 
  `nim c -d:release --app:console --outDir:distrib --opt:speed ${gce_path}`;
execSync(compile_command);
const install_path = join("run", "install.mjs");
copyFileSync(install_path, join("distrib", "install.mjs"));
console.log("\x1b[92mcopied helpers successfully!\n\x1b[0m");
// copies the helpers: gce, install.mjs to distrib

console.log(
  `\x1b[95mcompleted packaging!. go to /distrib to see results.\x1b[0m`
);
