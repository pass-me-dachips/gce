
import { copyFileSync, cpSync } from "node:fs";
import { join } from "node:path";

const shared_path = join("distrib", "shared");


cpSync("src", join(shared_path,  "src"), { recursive: true });
cpSync("node_modules", join(shared_path, "node_modules"), { recursive: true });
cpSync("man", join(shared_path, "man"), { recursive: true });
copyFileSync("package.json", join(shared_path, "package.json"));

console.log(`packaging completed!. go to ${shared_path} to see results.`);
