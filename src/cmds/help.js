import { GSYSTEM } from "../var/system.js";

export default function Help() {
  console.log("Grand Code(GCE) Environment Version %s", GSYSTEM.version);
  console.log("Published at %s", GSYSTEM.releaseDate);
  console.log("Copyright (c) 2024 by David.A,  github:<pass-me-dachips>");
  const content = `
Usage: gce command [--options or no-option]

Special Note:
    The first argument after gce: arg[0] must be the relative path to your file
    or directory in which you want start unless you are running any of the below 
    commands. if your file or dir name matches any of the below command, then the 
    command is executed instead. see options on how to avoid this situation.

Command:
    gcce -         List all installed gcce's.
    globalConfig - Set up a global configuration for all gce services.
    install -      Install A new gcce 
                   (1 option) = <relative_path_to_gcce>
    remove -       Removes An existing gcce
                   (1 option) = <name_of_gcce>
    resetGlobalConfig - resets the gce globalConfig.
    services -     List all gce running services.
Options:
  --FAIAF                   Notify gce to treath the first argument arg[0] as a
                            File or Folder regardless of the value.
  --help                    Show this help.
  --port:<port>             Specify a custom port to run your gce service on.
  --temp                    Marks the service as a temporary service, meaning
                            once the process dies, all data's are wiped out.
`
  console.log(content);
  return void 0;
}
