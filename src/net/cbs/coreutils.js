"use strict";

/** a function that handles service util requests
 * @author david, pass-me-dachips
 * @param {object} req
 * @param {object} res
 * @param {object} sdu
 * @returns {void}
 */
export default function serviceUtil(req, res, sdu) {
  function finish(status, mimets, message) {
    res.writeHead(status, {
      "Content-Type": mimets,
      Utils: "gce",
    });
    res.end(message);
  }

  const urls = req.url.split("/").filter((elem) => elem !== "");
  if (urls.length === 2) {
    const path = urls[1];
    switch (path) {
      case "ping":
        finish(200, "text/plain", sdu.serviceId);
        break;
      default:
        finish(400, "text/plain", `no util ${path}`);
    }
  } else finish(400, "text/plain", "");
}
