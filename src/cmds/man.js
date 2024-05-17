
"use strict";

import man from "../etc/man.js";

const manualPath = (basename) => `./man/${basename}`;

/**
 * handler for the man command.
 * @author david, pass-me-dachips
 * @param {Array} args 
 * @returns {void}
 */
export default function Man(args) {
 args = args.slice(1);
 if (args.length === 1) {
   switch(args[0]) {
      case "about":  ""; break;
      case "contrib":  ""; break;
      case "upcoming":  ""; break;
      case "clean":  ""; break;
      case "gcce":  man(manualPath("gcce"), 12); break;
      case "globalConfig":  man(manualPath("globalConfig"), 30); break;
      case "install":  man(manualPath("install"), 30); break;
      case "kill":  ""; break;
      case "pkg":  ""; break;
      case "remove":  man(manualPath("remove"), 30); break;
      case "resetGlobalConfig":  man(manualPath("resetGlobalConfig"), 20); break;
      case "rkill":  ""; break;
      case "services":  ""; break;
      case "start":  ""; break;
      default: throw { 
         message: `gce does not have a manual for command ${args[0]}` 
      }
   }
 } else throw { message: "man expects only 1 argument" }
}
