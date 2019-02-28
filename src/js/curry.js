/**
 * Simple Auto-Curry
 */
export function curry ( f, arr=[]) {
  return function (...args) {
    return function (a) {
      (a => a.length === f.length ?
        f(...a) :
        curry(f, a))([...arr, ...args])
    }
  }
}
