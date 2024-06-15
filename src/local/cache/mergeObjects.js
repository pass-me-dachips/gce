"use strict";

/**
 * merge two objects together where object values must be integers.
 * @author david, super-user-d0
 * @param {object} objectA
 * @param {object} objectB
 * @returns {object} the merged object
 */

export default function mergeObjects(objectA, objectB) {
  const keys = (obj) => Object.keys(obj);
  let master = {};
  let mid = {};
  if (keys(objectA).length >= keys(objectB).length) {
    master["keys"] = keys(objectA);
    master["cont"] = objectA;
    mid["keys"] = keys(objectB);
    mid["cont"] = objectB;
  } else {
    master["keys"] = keys(objectB);
    master["cont"] = objectB;
    mid["keys"] = keys(objectA);
    mid["cont"] = objectA;
  }

  const merged = {};

  for (let i = 0; i < master.keys.length; i++) {
    const elem = master.keys[i];
    if (elem in mid.cont) {
      merged[elem] = master.cont[elem] + mid.cont[elem];
    } else {
      merged[elem] = master.cont[elem];
    }
  }

  for (let i = 0; i < mid.keys.length; i++) {
    const elem = mid.keys[i];
    if (elem in master.cont === false) {
      merged[elem] = mid.cont[elem];
    }
  }

  return merged;
}
