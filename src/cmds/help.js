// import { GSYSTEM } from "../var/system.js";

export default function Help() {
//   console.log("Grand Code(GCE) Environment Version %s", GSYSTEM.version);
//   console.log("Published at %s", GSYSTEM.releaseDate);
//   console.log("Copyright (c) 2024 by David.A,  github:<pass-me-dachips>");
//   const content = `
// Usage: gce command [sub-command || sub-command-argument] [--options || -instructions or no-option/instruction ]

// Special Note:
//     The first argument after gce: arg[0] must be the relative path to your file
//     or directory in which you want start unless you are running any of the below 
//     commands. if your file or dir name matches any of the below command, then the 
//     command is executed instead. see options on how to avoid this situation.

// Command:
//     clean -        Similar to rkill but removes only ghost services.
//     gcce -         List all installed gcce's.
//     globalConfig - Set up a global configuration for all gce services.
//     install -      Install a new gcce.
//                    (1 sub-command-arg) = <relative_path_to_gcce>
//     kill -         Kill a running gce service.
//                    (1 sub-command-arg) = <serviceId> | <no_arg>
//     pkg -          Work with packages (4 options)
//                    add - adds a new packages.
//                     (1 sub-command-arg) = <relative_path_to_package>
//                    man - returns the manual of the package.
//                    show - list all added packages.
//                     (1 sub-command-arg) - <name_of_package || exclude arg>
//                    remove - remove an existing package.
//                     (1 sub-command-arg) - <name_of_package>
//     remove -       Remove an existing gcce.
//                    (1 sub-command-arg) = <name_of_gcce>
//     resetGlobalConfig - reset the gce globalConfig.
//     rkill -        recursively kill all running gce services.
//     services -     List the ids of all running gce services.
// Options:
//   --FAIAF                   Notify gce to treath the first argument arg[0] as a
//                             File or Folder regardless of the value.
//   --help                    Show this help.
//   --port:<port>             Specify a custom port to run your gce service on.
//   --nosleep                 Only available on the \`gce clean\` command:
//                             Notify gce to keep the process running and recur-
//                             sively remove ghost services after a certain interv-
//                             al.                 
//   --temp                    Marks the service \`temporary\`, which means
//                             once the service dies, all data's are wiped out.
// Instructions:
//   -s <serviceId>            Only avaialable on the \`gce services\` command:
//                             List more extensive information about a specific 
//                             service <serviceId>.  
//   -x                        Only avaialable on the \`gce services\` command:
//                             List all running gce services and additional info
//                             about each. 

// Run gce man <commandName> to list detailed information about each command,
// its sub-commands, sub-command-arguments, and options.
// Want to know everything bout gce? Run gce man.
// `
//   console.log(content);
console.log("help")
  return void 0;
}
