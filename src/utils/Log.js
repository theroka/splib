'use strict'

/* Level
 * 0 disabled
 * 1 Fatal
 * 2 Error
 * 3 Warn
 * 4 Info
 * 5 Debug
 */

const defaultLevel = 5

class Log {
  constructor (name, level) {
    this.name = ('' + name).trim()
    this.level = parseInt(level) || defaultLevel
  }

  fatal (...msg) {
    if (this.level > 0) console.log('[Fatal]', `(${this.name})`, ...msg)
  }

  error (...msg) {
    if (this.level > 1) console.log('[Error]', `(${this.name})`, ...msg)
  }

  warn (...msg) {
    if (this.level > 2) console.log('[Warn]', `(${this.name})`, ...msg)
  }

  info (...msg) {
    if (this.level > 3) console.log('[Info]', `(${this.name})`, ...msg)
  }

  debug (...msg) {
    if (this.level > 4) console.log('[Debug]', `(${this.name})`, ...msg)
  }
}

export function createLog (moduleName = 'main') {
  return new Log(moduleName, defaultLevel)
}
