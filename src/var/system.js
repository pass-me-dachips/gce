"use strict";

import { platform } from "node:os";
import { join } from "node:path";
import {
  osConfigDir,
  osDataDir,
  osHomeDir,
  osSeperator,
  osTempDir,
} from "./osPaths.js";

export const ERRORCODES = {
  exists: "DUPKEY",
  notFound: "ENOENT",
  notdirectory: "ENOTDIR",
  notFile: "EISDIR",
  online: "ONLINE",
};

export const SYSTEM = {
  buildAPackage: "https://tgcep-7d565.web.app/packages",
  homeRepo: "https://github.com/super-user-d0/gce.git",
  homePage: "https://tgcep-7d565.web.app",
  encoding: "utf-8",
  ESTsize: "600kB",
  ESTcommands: 13,
  Estoptions: 1,
  Estspkg: 24,
  name: "gce",
  releaseDate: "12-06-2024",
  tabA: "\t",
  version: "1.0.0",
};

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
};
