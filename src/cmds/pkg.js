"use strict";

import * as readLine from "node:readline";
import {
    existsSync, 
    mkdirSync, 
    readFileSync, 
    rmSync, 
    writeFileSync 
} from "node:fs";
import { GOUTFORMAT, GPATHS, GSYSTEM } from "../var/system.js";
import { join } from "node:path";

const pkgs_lock_path = join(GPATHS.pkgs,".pkgs-lock");
const update = (content) => 
   writeFileSync(pkgs_lock_path, content, GOUTFORMAT.encoding);

function add(relativePath) {
  if (relativePath) {
   const pathToGPKG = join(process.cwd(), relativePath);
   const pathTo_gpkgconfig = join(pathToGPKG, "gpkg.json");
   const gpkg = JSON.parse(readFileSync(pathTo_gpkgconfig, GOUTFORMAT.encoding));
   let { name, version, cmd, fpath, args } = gpkg;
   if (name && version && cmd && fpath) {
      fpath = fpath.split("{PATH}");
      fpath[0] = pathToGPKG;
      fpath = join(...fpath);
      if (cmd === "{BIN}") {
        cmd = cmd.replace("{BIN}", `chmod +x ${fpath} &&`);
      }
      const encaps = {
        name, version, cmd, fpath, args: args ?? [],
        dateAdded: new Date(),
        gceVersion: GSYSTEM.version
      }
      while (!existsSync(GPATHS.pkgs)) {mkdirSync(GPATHS.pkgs,{recursive: true});}

      if (existsSync(pkgs_lock_path)) {
        const previousContents = 
          JSON.parse(readFileSync(pkgs_lock_path, GOUTFORMAT.encoding));
        if (name in previousContents) {
          console.log(`Alert: ${name} already added to the extended packages.`);
          console.log(`Gce would upgrade or update the previous entry with this.`);
          let contentToWrite = {...previousContents};
          contentToWrite[name] = encaps;
          contentToWrite = JSON.stringify(contentToWrite, "", 4);
          update(contentToWrite);
        } else {
          let contentToWrite = {...previousContents, [name]:{...encaps}}
          contentToWrite = JSON.stringify(contentToWrite, "", 4);
          update(contentToWrite);
        }
      } else {
        const contentToWrite = JSON.stringify({[name]: {...encaps}},"", 4);
        update(contentToWrite);
      }
   } else throw { message: `package does not meet gce's requirements.\nname, version, cmd and fpath must be present in ${pathTo_gpkgconfig}`}
  } else throw { message: "cannot add a package without its relative path to the source code.\nHint: make sure you run \x1b[92m\`gce pkg add <relative_path_to_package>\`\x1b[0m next time!"}
}

/**
 *@{}
 */
function man() {
  console.log("man")
}

function remove(pkg) {
  if (existsSync(pkgs_lock_path)) {
    const packages = JSON.parse(readFileSync(pkgs_lock_path, GOUTFORMAT.encoding));
    if (pkg) {
      console.log("removing package %s .......", pkg);
      if (pkg in packages) {
        delete packages[pkg];
        update(JSON.stringify(packages, "", 4));
        console.log("removed 1 package");
      } else throw { message: `package ${pkg} does not exists` }
    } else {
      console.log("\x1b[92myou are about to remove all existing packages\x1b[0m");
      const cb = answer => {
         rl.close();
         if (answer === "ACK") {
          rmSync(pkgs_lock_path);
          console.log(`removed ${Object.keys(packages).length} packages`);
         }
         else throw { message: "request not acknowledge" } 
       }
      const rl = readLine.createInterface({
        input: process.stdin, output: process.stdout
      });
      rl.question("Enter `ACK` to acknowledge request ", cb);
    }
  } else throw { message: "no packages found" }
}

function show(pkg) {
  if (existsSync(pkgs_lock_path)) {
    const packages = JSON.parse(readFileSync(pkgs_lock_path, GOUTFORMAT.encoding));
    if (!pkg) {
      const packagesName = Object.keys(packages);
      console.log(`listing all packages........ ${packagesName.length} found`);
      packagesName.forEach(elem => {
        console.log(`\x1b[92m${elem}\x1b[0m  ${packages[elem].version}  ${packages[elem].fpath}`);
      })
    } else {
      console.log("retrieving info about package %s ......", pkg);
      const packageInfo = packages[pkg];
      if (packageInfo) {
        console.log(`  \x1b[92mname\x1b[0m  ${packageInfo.name}`);
        console.log(`  \x1b[92mversion\x1b[0m  ${packageInfo.version}`);
        console.log(`  \x1b[92mlocation\x1b[0m  ${packageInfo.fpath}`);
        console.log(`  \x1b[92madded\x1b[0m  ${packageInfo.dateAdded}`);
        console.log(`  \x1b[92mgce_v\x1b[0m  ${packageInfo.gceVersion}`);
        console.log("want to upgrade/update this package? \x1b[92mrun gce pkg add %s\x1b[0m", pkg);
        console.log("want to remove this package? \x1b[92mrun gce pkg remove %s \x1b[0m\n", pkg);
      } else throw { message: `could not retreive info about package ${pkg}. \x1b[93mare you sure it exists?\x1b[0m`}
    }
  } else throw { message: "no packages found" }
}


export default function Pkg(args) {
  args = args.slice(1);
  if (args[0]) {
    const option = args[0]; const identifier = args[1];
    switch(option) {
      case "add": add(identifier); break;
      case "man": man(); break;
      case "show": show(identifier); break;
      case "remove": remove(identifier); break;
      default: throw { message: `ABORTED: invalid option ${option}`}
    }
  } else {
    const message = `ABORTED: cmd expects at least 1 option, got ${args.length}`;
    throw { message}
  }
}
