"use strict";

export function toXLString(str: string) {
  // if the first char is a number, then FullEscape it
  let FullEscape = function (str: string) {
    const hexVals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    let rstr = "";
    for (let i = 0; i < str.length; i++) {
      let c = str.charAt(i);
      let num = c.charCodeAt(0);
      let temp = 0;
      let hexString = "";
      while (num >= 16) {
        temp = num % 16;
        num = Math.floor(num / 16);
        hexString += hexVals[temp];
      }
      hexString += hexVals[num];
      let tmpStr = "";
      for (let k = hexString.length - 1; k >= 0; k--)
        tmpStr += hexString.charAt(k);
      rstr += "%" + tmpStr;
    }
    return rstr;
  };
  let aSpaces = str.split(" ");
  let ret = "";
  // check if there is a number and work length is smaller than 5 letters
  if (/^[0-9]/.test(aSpaces[0]) && aSpaces[0].length < 5) {
    // change the first letter
    ret = FullEscape(str.charAt(0));
    str = str.substring(1);
  }
  for (let i = 0; i < str.length; i++) {
    let c = str.charAt(i);
    if (!/[0-9A-Za-z_]/.test(c)) ret += FullEscape(c).toLowerCase();
    else ret += c;
  }
  return ret.replace(/%([a-zA-Z0-9][a-zA-Z0-9])/g, "_x00$1_").substring(0, 32);
}
