
"use strict";

import { SYSTEM } from "../var/system.js";
 
/** handler for the help option
 * @author david, pass-me-dachips
 * @returns {void}
 */
export default function Help() {
  console.log("Grand Code(GCE) Environment Version %s", SYSTEM.version);
  console.log("Published at %s", SYSTEM.releaseDate);
  console.log("Copyright (c) 2024 by David.A,  github:<pass-me-dachips>");
  const content = `
Usage: gce command [sub-command || sub-command-argument] [--options || -instructions or no-option/instruction ]

Special Note:
    The first argument after gce: arg[0] must be the relative path to your file
    or directory in which you want to launch, unless you are running any of the below 
    commands. if your file or dir name matches any of the below command, then the 
    command is executed instead. 
    run \`gce man start\` to get a detailed guide on starting a service and all
    available options.

Command:
    clean -        Similar to rkill but removes only ghost services.
    gcce -         List all installed gcce's.
    globalConfig - Set up a global configuration for all gce services.
    install -      Install a new gcce
    kill -         Kill a running gce service.
    pkg -          Work with packages.
    remove -       Remove an existing gcce.
    resetGlobalConfig - reset the gce globalConfig.
    rkill -        recursively kill all running gce services.
    services -     List info about services.
    
Run gce man <commandName> to list detailed information about each command,
its sub-commands, sub-command-arguments, instructions and options.

Not to sure about the concept gce or gcce? run \`gce man about\` to learn more.
Need instructions about contributing to gce? run \`gce man contrib\` to learn more.
`;
  console.log(content);
  return void 0;
}
