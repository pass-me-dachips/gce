/**
 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   This file determines the mime type for HTTP responses based on the 
   requested file extension sent from the client.
   it only contains major types that are likely needed throughout this ent-
   ire project.
 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

/** determines the mime type for a response based on the specified file extention
 * @author gce
 * @param {string} trail file name
 * @returns {string}
 */
export default function mime(trail) {
  let type_subtype;
  const extention = (n) => trail.endsWith(n);
  if (extention(".7z")) type_subtype = "application/x-7z-compressed";
  else if (extention(".js") || extention(".mjs") || extention(".cjs"))
    type_subtype = "application/javascript";
  else if (extention(".jpg") || extention(".jpeg")) type_subtype = "image/jpeg";
  else if (extention(".ico")) type_subtype = "image/x-icon";
  else if (extention(".html") || extention(".htm")) type_subtype = "text/html";
  else if (extention(".css")) type_subtype = "text/css";
  else if (extention(".json")) type_subtype = "application/json";
  else if (extention(".otf")) type_subtype = "font/otf";
  else if (extention(".ttf")) type_subtype = "font/ttf";
  else if (extention(".csv")) type_subtype = "text/csv";
  else if (extention(".svg")) type_subtype = "image/svg+xml";
  else if (extention(".mpeg") || extention(".mpg")) type_subtype = "video/mpeg";
  else if (extention(".mp2") || extention(".mp3") || extention(".mpga"))
    type_subtype = "audio/mpeg";
  else if (extention(".mp4")) type_subtype = "video/mp4";
  else if (extention(".zip")) type_subtype = "application/zip";
  else if (extention(".yml") || extention(".yaml"))
    type_subtype = "application/x-yaml";
  else if (extention(".xml")) type_subtype = "application/xml";
  else if (extention(".webp")) type_subtype = "image/webp";
  else if (extention(".webm")) type_subtype = "video/webm";
  else if (extention(".wav")) type_subtype = "audio/wav";
  else if (extention(".viv") || extention(".vivo"))
    type_subtype = "video/vnd.vivo";
  else if (extention(".tar")) type_subtype = "application/x-tar";
  else if (extention(".svr")) type_subtype = "application/x-world";
  else if (extention(".sprite")) type_subtype = "application/x-sprite";
  else if (extention(".s")) type_subtype = "text/x-asm";
  else if (extention(".rtx")) type_subtype = "text/richtext";
  else if (extention(".rgb")) type_subtype = "image/x-rgb";
  else if (extention(".png")) type_subtype = "image/png";
  else if (extention(".pic") || extention(".pict")) type_subtype = "image/pict";
  else if (extention(".gz") || extention(".gzip"))
    type_subtype = "application/gzip";
  else if (extention(".gif")) type_subtype = "image/gif";
  else if (extention(".env")) type_subtype = "application/envoy";
  else if (extention(".pdf")) type_subtype = "application/pdf";
  else if (extention(".doc")) type_subtype = "application/msword";
  else if (extention(".docx"))
    type_subtype =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  else if (extention(".xls")) type_subtype = "application/vnd.ms-excel";
  else if (extention(".xlsx"))
    type_subtype =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  else if (extention(".ppt")) type_subtype = "application/vnd.ms-powerpoint";
  else if (extention(".pptx"))
    type_subtype =
      "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  else if (extention(".odt"))
    type_subtype = "application/vnd.oasis.opendocument.text";
  else if (extention(".ods"))
    type_subtype = "application/vnd.oasis.opendocument.spreadsheet";
  else if (extention(".epub")) type_subtype = "application/epub+zip";
  else if (extention(".midi") || extention(".mid")) type_subtype = "audio/midi";
  else if (extention(".bmp")) type_subtype = "image/bmp";
  else type_subtype = "text/plain";
  return type_subtype;
}
