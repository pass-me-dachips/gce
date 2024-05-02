import { GSYSTEM } from "../var/system.js";
import { platform } from "node:os";

export default function Core() {
console.log(`\x1b[1m
            \x1b[93m :-=======--:.                  Grand Code(GCE) Environment
          :=+**************+-.              Published at ${GSYSTEM.releaseDate}
        -+*****+=-----=+******+:.           Copyright (c) 2024 by David.A    
      :+****+-.     .-+***********=:.       Github:<pass-me-dachips>
     :*****-       =***+-:.  ..:=+*=        Repo: <pass-me-dachips/gce>
    \x1b[96m.*****:      .+**+:             
    -*****+++++++*****+++++++++++++++       
    =*******************************+       Version: ${GSYSTEM.version}
    -*****+++++++****+++++*****++++++       Authur: David.A 
    .*****:      -***-   .****+             Commands: 6(cmds)
     -*****-      =***=. .****+  :-         Options: 4(options)
      \x1b[97m:+****+-     :+***+=****+=+**+.       
       .=******+=--::=**********+=:        
         .-+****************+-.             Platform: ${platform()}   
            .--==++++==-:.                  Est.size: ${GSYSTEM.ESTsize}
\x1b[0m`)
}