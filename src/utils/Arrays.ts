"use strict";

/**
 * Chunk array into parts of passed chunksize.
 * @see: https://stackoverflow.com/a/37826698/3608062
 * @param {Array} input - Array to chunk into parts
 * @param {Number} chunksize - Size of chunks. Default: 100
 * @return {Object[]} - Returns array of chunks from passed array.
 */
export function chunkArray(input: Array<any>, chunksize: number = 150) {
  return input.reduce((chunkedArray, item, index) => {
    const chunkIndex = Math.floor(index / chunksize);
    if (!chunkedArray[chunkIndex]) {
      chunkedArray[chunkIndex] = []; // start a new chunk
    }
    chunkedArray[chunkIndex].push(item);
    return chunkedArray;
  }, []);
}
