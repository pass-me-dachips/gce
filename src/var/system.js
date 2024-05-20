
"use strict";

import { platform } from "node:os";
import { join } from "node:path";
import { 
   osConfigDir, 
   osDataDir, 
   osHomeDir, 
   osSeperator, 
   osTempDir 
} from "./osPaths.js";


export const ERRORCODES = {
   exists: "DUPKEY",
   notFound: "ENOENT",
   notdirectory: "ENOTDIR",
   notFile: "EISDIR",
   online: "ONLINE"
}

export const SYSTEM = {
  buildAPackage_repo: "https://github.com/pass-me-dachips/pkg-contrib.github.io",
  encoding: "ascii",
  ESTsize: "1MB",
  ESTcommands: 13,
  Estoptions: 1,
  Estspkg: 23,
  name: "gce",
  releaseDate: "2024-05-21",
  tabA: "\t",
  version: "1.0.0"
}

const configDir = join(osHomeDir(), ...osConfigDir[platform()], SYSTEM.name);
const tempDir = join(osHomeDir(), ...osTempDir[platform()], SYSTEM.name);
const dataDir = join(osHomeDir(), ...osDataDir[platform()], SYSTEM.name);
export const PATHS = {
   configDir,
   tempDir,
   dataDir,
   gcceConfig: join(configDir, "gcce.json"),
   globalConfig: join(configDir, "gce.g.config.json"),
   tServices: join(tempDir, "TSERVICES"),
   serviceLog: join(tempDir, "SERVICELOG"),
   seperator: osSeperator[platform()],
   gcelock: ".gcelock.",
   trash: join(tempDir, "Trash"),
   stack: join(dataDir, "Stack"),
   pkgs: join(dataDir, "usr"),
}
