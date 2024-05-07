import mime from "./mimetypes.js";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { ERRORCODES, GOUTFORMAT , GSYSTEM } from "../../var/system.js";

export default async function handleRequests(req, res, sdu) {
  function finish(status = 200, mimets, message) {
     res.writeHead(status, {
       "Content-Type": mimets,
       "X-Powered-By": GSYSTEM.name,
       "Server": `${GSYSTEM.name}/${GSYSTEM.version}`
      })
     res.end(message);
  }
  try {
    if (req.url === "/") req.url = sdu.entry ?? "index.html";
    if (req.url === "/gconfig.json") req.url = sdu.forbiden ?? "403.html";
    //++++++++++++ handle path rewrites.

    const filePath = join(sdu.abs, req.url);
    const payload = await readFile(filePath, GOUTFORMAT.encoding);
    finish(200, mime(req.url), payload);

  } catch (err) {
    const unknownResponse = (message, code) => {
      finish(500, "application/json", JSON.stringify({ message, code }));
    }
    if (err.code === ERRORCODES.notFound) {
      try {
        const _404filePath = join(sdu.abs, sdu.notFound ?? "404.html");
        const page = await readFile(_404filePath, GOUTFORMAT.encoding);
        finish(404, "text/html", page);
      } catch(err) { unknownResponse(err.message, err.code) }
    } else unknownResponse(err.message, err.code);
  }
}
