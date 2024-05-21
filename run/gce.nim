
from "std/osproc" import execCmd
from "std/cmdline" import commandLineParams

when declared(commandLineParams) :
  const shared_path: string = "/home/david/gce/shared/src/gce.js "
  let raw_params: seq[string] = commandLineParams()
  var arguments: string
  for i in raw_params :
    arguments = arguments &  " " & i
  echo "node " & shared_path & arguments
  # discard execCmd("node " & shared_path & arguments)
else :
  echo "cannot launch gce!"
  echo "are you running from a dynamic link library?"
  # terminate: as the proc is not available.