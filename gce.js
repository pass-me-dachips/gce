import Core from "./src/cmds/core.js";
import Gcce from "./src/cmds/gcce.js";
import GlobalC from "./src/cmds/globalC.js";
import Help from "./src/cmds/help.js";
import Install from "./src/cmds/install.js";
import Kill from "./src/cmds/kill.js";
import Main from "./src/cmds/main.js";
import Remove from "./src/cmds/remove.js";
import ResetGlobalC from "./src/cmds/resetGlobalC.js";
import Services from "./src/cmds/services.js";

process.on("uncaughtException", ( error )=> console.log(error.message));

const args = process.argv.slice(2);
if (args.length > 0) {
  if (args.includes("--FAIAF")) await Main(args) 
  else {  
    switch(args[0]) {
      case "--help" : { Help(); break }
      case "gcce" : { Gcce(); break }
      case "globalConfig" : { GlobalC(); break }
      case "install" : { Install(args); break }
      case "kill" : { Kill(args); break }
      case "remove" : { Remove(args); break }
      case "resetGlobalConfig" : { ResetGlobalC(); break }
      case "services" : { Services(args); break }
      default : await Main(args) 
    }
  }
} else Core();
