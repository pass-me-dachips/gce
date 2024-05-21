
"use strict";

/*
   build file structure:
       ./  
        shared/
        start/  
           android/
             ./gce
           darwin/
             ./gce
           linux/
             ./gce
           win32/
             ./gce.exe
           install.node
*/

// run the install in node ./start/install.mjs

import { copyFileSync, cpSync } from "node:fs";
import { platform } from "node:os";

const shared_dest = {
   android: "/data/data/com.termux/files/app/gce/shared",
   darwin: "~/gce/shared",
   linux: "~/gce/shared",
   win32: "%USERPROFILE%\\gce\\shared"
}
const shared_source = "../shared";

const exec_dest = {
  android: "/data/data/com.termux/files/usr/bin",
  darwin: "/usr/local/bin",
  linux: "/usr/local/bin",
  win32: "C:\\Windows\\System32"
}
const exec_source = "../shared";


cpSync(shared_dest[platform()], shared_source);
// copy the shared content

