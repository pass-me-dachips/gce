import Clean from "./cmds/clean.js";
import Core from "./cmds/core.js";
import Gcce from "./cmds/gcce.js";
import GlobalC from "./cmds/globalC.js";
import Help from "./cmds/help.js";
import Install from "./cmds/install.js";
import Kill from "./cmds/kill.js";
import Main from "./cmds/main.js";
import Remove from "./cmds/remove.js";
import ResetGlobalC from "./cmds/resetGlobalC.js";
import Rkill from "./cmds/rkill.js";
import Services from "./cmds/services.js";

process.on("uncaughtException", ( error )=> console.log(error.message));

const args = process.argv.slice(2);
if (args.length > 0) {
  if (args.includes("--FAIAF")) await Main(args) 
  else {  
    switch(args[0]) {
      case "--help" : { Help(); break }
      case "clean" : { Clean(args); break }
      case "gcce" : { Gcce(); break }
      case "globalConfig" : { GlobalC(); break }
      case "install" : { Install(args); break }
      case "kill" : { Kill(args); break }
      case "remove" : { Remove(args); break }
      case "resetGlobalConfig" : { ResetGlobalC(); break }
      case "rkill" : { Rkill(); break }
      case "services" : { Services(args); break }
      default : await Main(args) 
    }
  }
} else Core();
