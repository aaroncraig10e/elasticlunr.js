/*!
 * elasticlunr.utils
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 */

/**
 * A namespace containing utils for the rest of the elasticlunr library
 */
elasticlunr.utils = {};

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
elasticlunr.utils.warn = (function (global) {
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message);
    }
  };
})(this);

/**
 * Convert an object to string.
 *
 * In the case of `null` and `undefined` the function returns
 * an empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {object} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf Utils
 */
elasticlunr.utils.toString = function (obj) {
  if (obj === void 0 || obj === null) {
    return "";
  }

  return obj.toString();
};

/**
 * Return the intersection of two arrays.
 *
 * ie, given [1, 'two', 3] and ['two', 3, 4] returns ['two', 3]
 *
 * @param arrA {Array}
 * @param arrB {Array}
 * @return {Array}
 * @memberOf Utils
 */
elasticlunr.utils.intersection = function (arrA, arrB) {
  if (arrA.length + arrB.length === 0) {
    return [];
  }

  var arr = [];

  for (var i = 0; i < arrA.length; i++) {
    for (var x = 0; x < arrB.length; x++) {
      if (arrA[i] === arrB[x]) {
        arr.push(arrA[i]);

        break;
      }
    }
  }

  return arr;
};
