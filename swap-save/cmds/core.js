import { exec } from "node:child_process";
import { existsAsync } from "../etc/existsAsync.js";
import { freemem, platform } from "node:os";
import { getTechStack, hmr } from "../spkg/v1.0.0.js";
import { GOUTFORMAT, GPATHS, GSYSTEM } from "../var/system.js";
import { join } from "node:path";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";

const execAsync = promisify(exec);

export default async function Core() {
const github = "https://github.com/pass-me-dachips/";
const errMessage = "cannot determine";

const gcceInfoFn = async () => {
 let cmdVal = (await execAsync("node src/gce.js gcce")).stdout;
 cmdVal = cmdVal.toString(GOUTFORMAT.encoding)
 if (cmdVal.startsWith("gcce")) {
   let focus = cmdVal.split("\n")[0];
   focus = focus.split(" ");
   focus[3] = focus[3].split(",").join("");
   return [focus[3], focus[5]];
 } else { return [undefined, undefined]; }
}
const gcceInfo = await gcceInfoFn();

const currentDevMem = freemem(); // device current free memory
const calEstServices = () => {
  const estMemUPS = 104857600; 
  /*estimated memory used per service (100MB).
  50MB estimate for the actual service including the node runtime etc (r-mem) 
  in gce services -x
  while the other 50MB is an estimate for the gcce instance assuming its a 
  ligthweigth/ close to ligthweigth gcce (eg kivana).
  */ 
  const recPortion = (40 / 100) * currentDevMem; 
  //the portion gce recommends for consumption (40%).
  return Math.floor(recPortion / estMemUPS);
}

const getPackagesCount = async () => {
  try {
    const logPath = join(GPATHS.pkgs, ".pkgs-lock");
    if (await existsAsync(logPath)) {
      const log = JSON.parse(await readFile(logPath, GOUTFORMAT.encoding));
      const pkgTtal = Object.keys(log);;
      return pkgTtal.length;
    }
    else return 0;
  } catch(error) { 
    console.log("\x1b[93merror retrieving packages. try again\x1b[0m"); 
    return 0; 
  }
}
const totalPkgs = GSYSTEM.Estspkg + await getPackagesCount();

const techstack = await getTechStack(true);
const tsTop3 = techstack.slice(0, 3); //the techstack top 3
const tsOthers = techstack.slice(3).reduce((accum, elem) => accum + elem.percentage ,0);
// the tech stack `others` which thier percentages are summed together.
const tsOrdered = tsTop3.map(elem => `\t${elem.tech} (est) ........  ${elem.percentage}%\n`);
tsOrdered.forEach(elem => tsOrdered + elem);
tsOrdered.push(`\tOthers (est) ........  ${tsOthers}%\n`);
// the new ordered list of the techstack including the top 3 and others.

const coloredPercentage = () => {
  const percentages = [];
  tsTop3.forEach(elem => percentages.push(elem.percentage));
  let out = "";
  const percentageWholeVal = percentages.reduce((accum, index) => index + accum , 0);
  const percentageMap =  (p) => {
    if (p < 5) return "           ";
    if (p < 10) return "           "; 
    if (p < 15) return "            ";
    if (p < 20) return "             ";
    if (p < 25) return "              ";
    if (p < 30) return "               ";
    if (p < 35) return "                ";
    if (p < 40) return "                 ";
    if (p < 45) return "                  ";
    if (p < 50) return "                   ";
    if (p < 55) return "                    ";
    if (p < 60) return "                     ";
    if (p < 65) return "                      ";
    if (p < 70) return "                       ";
    if (p < 75) return "                        ";
    if (p < 80) return "                         ";
    if (p < 85) return "                          ";
    if (p < 90) return "                           ";
    if (p < 95) return "                            ";
    if (p < 100) return "                            ";
    else return "";
  }
  percentages.map((elem, index) => { 
    const percentage = Math.round((elem/percentageWholeVal) * 100);
    out += `${index === 0 ? "\x1b[93;103" : index=== 1 ? "\x1b[94;104" : "\x1b[91;101"}m${percentageMap(percentage)}\x1b[0m`;
  })
  return out;
}

process.stdout.write(`Grand Code(GCE) Environment Version ${GSYSTEM.version}
Published at ${GSYSTEM.releaseDate}, Copyright (c) 2024 by David.A
Github ${github}
Repo ${github}gce
Run \`gce --help\` for more information about available commands and options.

Official docs@ ${github}pages/gce-env
        total commands  ${GSYSTEM.ESTcommands}, total options  ${GSYSTEM.Estoptions}  
        platform  ${platform() ?? errMessage}, est program size  ${GSYSTEM.ESTsize}
        installed gcces  ${gcceInfo[0] ?? errMessage}, default  ${gcceInfo[1] ?? errMessage }
        total packages  ${totalPkgs}, spkgs  ${GSYSTEM.Estspkg}, external  ${totalPkgs - GSYSTEM.Estspkg}
        freemem  ${hmr(currentDevMem) ?? errMessage}, rec services in parallel  ${calEstServices() ?? errMessage}

Tech stack (mcc):${tsTop3.map(elem => ' '+elem.tech)}
${tsOrdered.join("")}
\x1b[90;47m col-representation \x1b[0m ${coloredPercentage()}
\n`);
return void 0;
}
