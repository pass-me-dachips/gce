import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GOUTFORMAT, GPATHS, GSYSTEM } from "../var/system.js";

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
      const pkgs_lock_path = join(GPATHS.pkgs,".pkgs-lock");
      const update = (content) => 
         writeFileSync(pkgs_lock_path, content, GOUTFORMAT.encoding);

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

function man() {
  console.log("man")
}

function remove() {
  console.log("remove")
}

function show() {
  console.log("show")
}


export default function Pkg(args) {
  args = args.slice(1);
  if (args[0]) {
    const option = args[0]; const identifier = args[1];
    switch(option) {
      case "add": add(identifier); break;
      case "man": man(); break;
      case "show": show(); break;
      case "remove": remove(); break;
      default: throw { message: `ABORTED: invalid option ${option}`}
    }
  } else {
    const message = `ABORTED: cmd expects at least 1 option, got ${args.length}`;
    throw { message}
  }
}