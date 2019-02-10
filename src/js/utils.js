

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
 * Get a property from an object, using a deep path. If any segment of the path
 * does not exist, this simply returns undefined vs throwing an error
 *
 * This is a more functional variant of getProp in `@esri/hub-common`
 */
export function getProp(path, obj) {
  return path.split(".").reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined;
  }, obj);
}

/**
 * Extract from one object and attach to a new object using a new name
 */
export function extractProps (fieldMap, obj) {
  return Object.keys(fieldMap).reduce((acc, oldPropName) => {
    return maybeAdd(fieldMap[oldPropName], getProp(oldPropName, obj), acc);
  }, {});
}

/**
 * Add a property to an object, but only if the passed value is not null
 * Hoisted from `@esri/hub-common`
 */
export function maybeAdd(key, val, target) {
  // see if we got something...
  if (val !== null && val !== undefined) {
    target = cloneObject(target);
    // attach using the key
    target[key] = cloneObject(val);
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
 * Group array entries by a prop name
 */
export function groupBy (propName, rows) {
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

export function uniqueBy (prop, entries) {
  const tracker = [];
  return entries.reduce((acc, entry) => {
    // if the tracker does not have the entry yet... we add it...
    if (!tracker.includes(entry[prop])) {
      tracker.push(entry[prop]);
      acc.push(entry);
    }
    return acc;
  }, [])
}
