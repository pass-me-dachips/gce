
"use strict";

import { homedir, platform as osplatform  } from "node:os";

export const supportedPlatforms = [
   "android",
   "darwin", //mac
   "linux",
   "win32" //windows
];

export const osHomeDir = () => {
   if (supportedPlatforms.includes(osplatform())) {
     return osplatform() === "android" ? "~/" : homedir();
   } else throw { color_code: 91, message: "PLATFORM UNSUPPORTED" }
}

export const osConfigDir = {
   android: [".config"],
   darwin: ["Library", "Preferences"],
   linux: [".config"],
   win32: ["AppData", "Roaming"],
}

export const osDataDir = {
   android: [".local"],
   darwin: ["Library", "Application Support"],
   linux: [".local", "share"],
   win32: ["AppData", "Local"],
}

export const osTempDir = {
   android: [".cache"],
   darwin: ["Library", "Caches"],
   linux: [".cache"],
   win32: ["AppData", "Local", "Temp"],
}

export const osSeperator = {
   android: "/",
   darwin: "/",
   linux: "/",
   win32: "\\",
}
