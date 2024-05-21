
"use strict";

import * as readLine from "node:readline";
import { SYSTEM } from "../var/system.js";
import { readFileSync } from "node:fs";
import { stdin, stdout } from "node:process";

/**
 * reads and split a specified file into group of pages. 
 * @author david, pass-me-dachips
 * @param {string} path the path to which the manual resides.
 * @param {string} lenPerPage the total number of lines that forms a single page.
 * @returns {string} pages - an array containing the file contents splited
 * per pages where each page is {lenPerPage}
 */
function getPages(path, lenPerPage) {
  let pageLines = readFileSync(path, SYSTEM.encoding);
  pageLines = pageLines.split("\n");

  let currentPageLen = 0;
  let currentPage = 0;
  let pagesRearranged = [];

  pageLines.forEach(elem => {
    if (currentPageLen === lenPerPage) {
       currentPageLen = 0; currentPage = currentPage + 1;
    } 
    pagesRearranged[currentPage] = 
       pagesRearranged[currentPage] === undefined ?
            elem : pagesRearranged[currentPage] + `\n${elem}`;
    currentPageLen = currentPageLen + 1; 
  });
  return pagesRearranged;
}

/**
 * create a fast and effective interface on the terminal for reading large chunks
 * of texts without experiencing freezes or lags.
 * @author david, pass-me-dachips
 * @param {string} path the path to the file which is returned.
 * @param {string} lenPerPage the number of lines per page.
 * @returns {void}
 */
export default function man(path, lenPerPage) {
  const pages = getPages(path, lenPerPage);
  const rl = readLine.createInterface({
     input: stdin,
     output: stdout,
  });
  let index = 0;
  console.log(pages[index]);
  rl.on("line", ()=> {
    index = index + 1;
    if (pages[index] !== undefined) console.log(pages[index]);
    else rl.close();
  });
  return void 0;
}
