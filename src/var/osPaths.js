import { homedir } from "node:os";

export const osHomeDir = homedir();

export const osConfigDir = {
   linux: [".config"],
   win32: ["AppData", "Roaming"],
   darwin: ["Library", "Preferences"]
}
export const osDataDir = {
   linux: [".local", "share"],
   win32: ["AppData", "Local"],
   darwin: ["Library", "Application Support"]
}
export const osTempDir = {
   linux: [".cache"],
   win32: ["AppData", "Local", "Temp"],
   darwin: ["Library", "Caches"]
}
export const osSeperator = {
   linux: "/",
   win32: "\\",
   darwin: "/"
}