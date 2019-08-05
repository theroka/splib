'use strict'

export function _toXslString (str: string) {
  if (typeof str !== 'string') throw Error("Error 'toXSLString': '" + str + "' is not a string....")
  // if the first char is a number, then FullEscape it
  var FullEscape = function (strg: string) {
    var hexVals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    var rstr = ''
    for (var i = 0; i < strg.length; i++) {
      var c = strg.charAt(i)
      var num = c.charCodeAt(0)
      var temp = 0
      var hexString = ''
      while (num >= 16) {
        temp = num % 16
        num = Math.floor(num / 16)
        hexString += hexVals[temp]
      }
      hexString += hexVals[num]
      var tmpStr = ''
      for (var k = hexString.length - 1; k >= 0; k--) tmpStr += hexString.charAt(k)
      rstr += '%' + tmpStr
    }
    return rstr
  }
  var aSpaces = str.split(' ')
  var ret = ''
  // check if there is a number and work length is smaller than 5 letters
  if (/^[0-9]/.test(aSpaces[0]) && aSpaces[0].length < 5) {
    // change the first letter
    ret = FullEscape(str.charAt(0))
    str = str.substring(1)
  }
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i)
    if (/[0-9A-Za-z_]/.test(c) === false) ret += FullEscape(c).toLowerCase()
    else ret += c
  }
  return ret.replace(/%([a-zA-Z0-9][a-zA-Z0-9])/g, '_x00$1_').substring(0, 32)
}
