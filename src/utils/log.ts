"use strict";

/* Level
 * 0 disabled
 * 1 Fatal
 * 2 Error
 * 3 Warn
 * 4 Info
 * 5 Debug
 */

const defaultLevel = 5;

type Message = string | number | boolean | string[] | number[] | boolean[] | object;

class Log {
  name: string;
  level: number;
  grouped: boolean;

  constructor(name: string, level: number) {
    this.name = ("" + name).trim();
    this.level = level || defaultLevel;
    this.grouped = false;
  }

  fatal(...msg: Message[]) {
    if (this.level > 0) console.log("[Fatal]", `(${this.name})`, ...msg);
  }

  error(...msg: Message[]) {
    if (this.level > 1) console.log("[Error]", `(${this.name})`, ...msg);
  }

  warn(...msg: Message[]) {
    if (this.level > 2) console.log("[Warn]", `(${this.name})`, ...msg);
  }

  info(...msg: Message[]) {
    if (this.level > 3) console.log("[Info]", `(${this.name})`, ...msg);
  }

  debug(...msg: Message[]) {
    if (this.level > 4) console.log("[Debug]", `(${this.name})`, ...msg);
  }

  group(label?: string) {
    this.grouped ? console.groupEnd() : console.groupCollapsed(label || this.name);
    this.grouped = !this.grouped
  }
}

export function createLog(moduleName = "main") {
  return new Log(moduleName, defaultLevel);
}
