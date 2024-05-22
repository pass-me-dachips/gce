
from "std/appdirs" import getHomeDir
from "std/cmdline" import commandLineParams
from "std/dirs" import setCurrentDir
from "std/paths" import Path, `/`
from "std/os" import getCurrentDir
from "std/osproc" import execCmd
  
when declared(commandLineParams) :
  let workingDir = getCurrentDir() # the cwd gce where called

  const shared_relative_path: Path = `/`(Path("gce"), Path("shared"))
  # the shared directory relative path
  const shared_path: Path = `/`(getHomeDir(), shared_relative_path)
  # the shared directory absolute path

  const shared_entry_point: Path = `/`(Path("src"), Path("gce.js"))
  # the entry point 

  let raw_params: seq[string] = commandLineParams()
  var arguments: string = workingDir
  for i in raw_params :
    arguments = arguments &  " " & i
  setCurrentDir(shared_path) 
  discard execCmd("node " & string(shared_entry_point) & arguments)
else :
  echo "cannot launch gce!"
  echo "are you running from a dynamic link library?"
  # terminate: as the proc is not available.
  