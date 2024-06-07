"use strict";

import { ERRORCODES, SYSTEM } from "../../var/system.js";
import { join } from "node:path";
import mime from "../www/mimetypes.js";
import { readFile } from "node:fs/promises";

/** a function that handles the web server requests
 * @author david, pass-me-dachips
 * @param {object} res
 * @param {object} sdu
 * @returns {void}
 */
export default async function webServer(res, sdu, url) {
  function finish(status = 200, mimets, message) {
    res.writeHead(status, {
      "Content-Type": mimets,
      "X-Powered-By": SYSTEM.name,
      Server: `${SYSTEM.name}/${SYSTEM.version}`,
    });
    // console.log(message.slice(0, 100), sdu.url, mimets, "\n\n\n\n");
    res.end(message.toString("utf-8"));
  }
  try {
    if (url === "/") url = sdu.entry;
    if (url === "/gconfig.json") url = sdu.forbiden;
    url = url.replaceAll("%20", " ");
    //map %20 endcoding back to whitespaces
    // handle path rewrites.

    const filePath = join(sdu.path, url);
    const payload = await readFile(filePath, SYSTEM.encoding);
    finish(200, mime(url), payload);
  } catch (err) {
    const unknownResponse = (message, code) => {
      finish(500, "application/json", JSON.stringify({ message, code }));
    };
    if (err.code === ERRORCODES.notFound) {
      try {
        const _404filePath = join(sdu.path, sdu.notFound ?? "404.html");
        const page = await readFile(_404filePath, SYSTEM.encoding);
        finish(404, "text/html", page);
      } catch (err) {
        unknownResponse(err.message, err.code);
      }
    } else unknownResponse(err.message, err.code);
  }
}
