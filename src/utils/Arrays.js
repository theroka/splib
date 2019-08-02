'use strict'

const defaultChunkSize = 100

/**
 * Chunk array into parts of passed chunksize.
 * @see: https://stackoverflow.com/a/37826698/3608062
 * @memberof module:Utils
 * @alias module:Utils.chunkArray
 *
 * @param {Array} input - Array to chunk into parts
 * @param {Number} chunksize - Size of chunks. Default: 100
 * @return {Object[]} - Returns array of chunks from passed array.
 */
export function chunkArray (input, chunksize = defaultChunkSize) {
  return input.reduce((chunkedArray, item, index) => {
    const chunkIndex = Math.floor(index/chunksize)
    if(!chunkedArray[chunkIndex]) {
      chunkedArray[chunkIndex] = [] // start a new chunk
    }
    chunkedArray[chunkIndex].push(item)
    return chunkedArray
  }, [])
}
