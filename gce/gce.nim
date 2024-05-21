from "std/cmdline" import commandLineParams;
from "std/osproc" import execCmd

when declared(commandLineParams) :
  const path: string = "./src/gce.js";
  # platform specific paths to where the gce codebase recides.   
  
  var raw_parameters: seq[string] = commandLineParams();
  var gce_params: string;
 
  for i in raw_parameters :
    gce_params = gce_params & " " & i;
  # concatenate the raw arguments to form a single string suitable for parsing 
  # to the gce.js file   

  let command: string = "node " & path & gce_params;
  discard execCmd(command);
else :
   echo "gce cannot be called from a dynamic link libary";
   echo "no support for dlls";
   # since nim does not support calling a program from a dll.