import { homedir, platform } from "node:os";
import { join } from "node:path";
import { 
   osConfigDir, 
   osDataDir, 
   osHomeDir, 
   osSeperator, 
   osTempDir 
} from "./osPaths.js";

export const GSYSTEM = {
   name: "gce",
   version: "1.0.0",
   releaseDate: "2024-05-05",
   ESTsize: "2MB"
}

export const GOUTFORMAT = {
   tabA: "\t",
   encoding: "ascii"
}

const configDir = join(osHomeDir, ...osConfigDir[platform()], GSYSTEM.name);
const tempDir = join(osHomeDir, ...osTempDir[platform()], GSYSTEM.name);
const dataDir = join(osHomeDir, ...osDataDir[platform()], GSYSTEM.name);
export const GPATHS = {
   configDir,
   tempDir,
   dataDir,
   gcceConfig: join(configDir, "gcce.json"),
   globalConfig: join(configDir, "gce.g.config.json"),
   tServices: join(tempDir, "TSERVICES"),
   serviceLog: join(tempDir, "SERVICELOG"),
   seperator: osSeperator[platform()],
   gcelock: ".gcelock.",
   posixTrash: `${homedir}${osSeperator[platform()]}.local/share/Trash/files`
}

export const ERRORCODES = {
   notFound: "ENOENT",
   notdirectory: "ENOTDIR",
   notFile: "EISDIR",
   online: "ONLINE",
   exists: "DUPKEY"
}