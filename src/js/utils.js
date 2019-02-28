

/**
 * Simple deep-clone
 * Hosted from `@esri/hub-common`
 */
export function cloneObject(obj = {}) {
  let clone = {};
  // first check array
  if (Array.isArray(obj)) {
    clone = obj.map(cloneObject);
  } else if (typeof obj === "object") {
    for (const i in obj) {
      if (obj[i] != null && typeof obj[i] === "object") {
        clone[i] = cloneObject(obj[i]);
      } else {
        clone[i] = obj[i];
      }
    }
  } else {
    clone = obj;
  }
  return clone;
}

/**
 * Get a property from an object, using a deep path.
 * If any segment of the path does not exist, this simply
 * returns the default value vs throwing an error
 *
 * This is a more functional variant of getProp in `@esri/hub-common`
 */
export function getProp(path, obj, def = undefined) {
  return path.split(".").reduce(function(prev, curr) {
    return prev ? prev[curr] : def;
  }, obj);
}

//
// // Ever written code like this?
// function doThings (obj) {
//   let theVal = 'red'
//   if (obj.roadLayer && obj.roadLayer.color) {
//     theVal = obj.roadLayer.color
//   }
//   // do things...
// }
//
// // getProp can handle the deep-dotting
// function doThings (myObject) {
//
//   const theVal = getProp('roadLayer.color', myObject) || 'red';
//   // do things...
//
// }
//
// function doThings (obj) {
//
//   const theVal = getProp('roadLayer.color',  obj, 'red');
//   // do things...
//
// }


/**
 * Extract prop from one object and attach to
 * a new object using a new name
 * FieldMap: {
 *   "OLDPROP": "NewPropName"
 * }
 */
export function extractProps (fieldMap, obj) {
  return Object.keys(fieldMap).reduce((acc, oldPropName) => {
    return maybeAdd(fieldMap[oldPropName], getProp(oldPropName, obj), acc);
  }, {});
}

/**
 * Add a property to an object,
 * only if the passed value is not null
 */
export function maybeAdd(key, val, target) {
  if (val !== null && val !== undefined) {
    target = cloneObject(target);
    // attach using the key
    target[key] = cloneObject(val);
  }
  return target;
}

/**
 * Add an entry to an array
 * only if the passed value is not null
 */
export function maybePush(val, target) {
  if (val !== null && val !== undefined) {
    // create a clone because mutation makes us sad...
    target = cloneObject(target);
    target.push(cloneObject(val));
  }
  return target;
}

/**
 * Find entry in array by prop val
 */
export function findBy (arr, prop, val) {
  return arr.reduce((acc, entry) => {
    if (getProp(prop, entry) === val) {
      acc = entry;
    }
    return acc;
  }, null);
}

/**
 * Sort an array by a property name
 */
export function sortBy (propName, arry) {
  return arry.sort((a,b) => {
    if (a[propName] > b[propName]) return 1;
    if (a[propName] < b[propName]) return -1;
    return 0;
  });
}


/**
 * Simple Partial Application
 * Only works for fn's with arity-2
 * Many times it's easier to just use
 * an anon function inline
 */
export function partial (fn, arg1) {
  return (arg2) => {
    return fn(arg1, arg2);
  }
}

export function curry(fn, ...args) {
    return (..._arg) => {
        return fn(...args, ..._arg);
    }
}

/**
 * Simple Auto-Curry
 */
export function autocurry ( f, arr=[]) {
  return function (...args) {
    return function (a) {
      (a => a.length === f.length ?
        f(...a) :
        autocurry(f, a))([...arr, ...args])
    }
  }
}

/**
 * Simple Pipe
 * From Eric Elliot
 */
export function pipe (...fns) {
  // returns a function...
  return function (data) {
    // that reduces over the Functions
    // using the passed in data as the starting
    // value for reduce
    return fns.reduce((result, fn) => fn(result), data);
  }
}

/**
 * Group array entries by a prop name
 * This uses a tracker array. If you are
 * working with very large arrays, this
 * will be a little more performant
 */
export function groupByTracker (propName, rows) {
  let tracker = [];
  return rows.reduce((acc, row) => {
    const groupName = row[propName];
    // do we have this in the tracker?
    if (tracker.includes(groupName)) {
      // it's in the acc, so get it and push entry
      let group = acc.find((e) =>  (e.group === groupName));
      group.entries.push(row);
    } else {
      // add to tracker...
      tracker.push(groupName);
      // create entry in output
      acc.push({group: groupName, entries: [row]});
    }
    return acc;
  }, []);
}

/**
 * Group entries in an array by a property
 * Input: [{prop: val, prop2: val}]
 * Returns: [{group: <name>, entries:[...]}]
 */
export function groupBy (prop, rows) {
  debugger;
  return rows.reduce((acc, row) => {
    const nameMatches = (e) => e.group === row[prop];
    let grp = acc.find(nameMatches)
    if (!grp) {
      acc.push({group: row[prop], entries: [row]});
    } else {
      grp.entries.push(row);
    }
    return acc;
  }, []);
}


/**
 * Use the value of a property to retur
 * an array of entries that are unique
 *
 * Terser version using maybePush and a ternary
 * and no nasty ifs
 */
export function uniqueBy (prop, entries) {
  return entries.reduce((acc, entry) => {
    const nameMatches = (e) => e[prop] === entry[prop];
    return maybePush(acc.find(nameMatches) ? null : entry, acc);
  }, [])
}

/**
 * While this works, it has an if block, and we
 * hates the nasty ifs
 */
export function uniqueByVerbose (prop, entries) {
  return entries.reduce((acc, entry) => {
    const nameMatches = (e) => e[prop] === entry[prop];
    if (!acc.find(nameMatches)) {
      acc.push(entry);
    }
    return acc;
  }, [])
}
