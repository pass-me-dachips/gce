
from "std/osproc" import execCmd
from "std/cmdline" import commandLineParams

when declared(commandLineParams) :
  const shared_path: string = ""
  let raw_params: seq[string] = commandLineParams()
  var arguments: string
  for i in raw_params :
    arguments = arguments &  " " & i
  discard execCmd("node " & shared_path & arguments)
else :
  echo "cannot launch gce!"
  echo "are you running from a dynamic link library?"
  # terminate: as the proc is not available.
  