import { platform } from "node:os";
import { exec } from "node:child_process";

export default function execBrowser(url) {
  let supportedPlatforms = ["darwin", "freebsd", "linux", "win32", "openbsd"];
  if (supportedPlatforms.includes(platform())) {
    const LFO = "xdg-open" //linux,freebsd,openbsd
    const startProcess = {
      darwin: "open",
      freebsd: LFO,
      linux: LFO,
      win32: "start",
      openbsd: LFO,
    };
  //   exec(`${startProcess[platform()]} ${url}`);
  } 
  return true;
}
// use case => execBrowser("https://github.com")
