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
    switch (args[0]) {
      case "clean":
        man(manualPath("clean"), 30);
        break;
      case "gcce":
        man(manualPath("gcce"), 12);
        break;
      case "globalConfig":
        man(manualPath("globalConfig"), 30);
        break;
      case "install":
        man(manualPath("install"), 30);
        break;
      case "kill":
        man(manualPath("kill"), 25);
        break;
      case "pkg":
        man(manualPath("pkg"), 30);
        break;
      case "remove":
        man(manualPath("remove"), 30);
        break;
      case "resetGlobalConfig":
        man(manualPath("resetGlobalConfig"), 20);
        break;
      case "rkill":
        man(manualPath("rkill"), 15);
        break;
      case "services":
        man(manualPath("services"), 30);
        break;
      case "start":
        man(manualPath("start"), 30);
        break;
      default:
        throw {
          message: `gce does not have a manual for command ${args[0]}`,
        };
    }
  } else throw { message: "man expects only 1 argument" };
}
