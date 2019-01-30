

/**
 * Simple deep-clone
 * Hosted from https://github.com/Esri/hub.js/blob/8f739daf7406247098789a3639039a1536f93bfd/packages/common/src/util.ts#L14
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


export function getProp(path, obj) {
  return path.split(".").reduce(function(prev, curr) {
    /* istanbul ignore next no need to test undefined scenario */
    return prev ? prev[curr] : undefined;
  }, obj);
}


/**
 * This mutates the data as the intent is literally to change it
 */
export function renameProperties (fieldMap, obj) {
  Object.keys(fieldMap).forEach((oldPropName) => {
    if(obj.hasOwnProperty(oldPropName)) {
      obj[fieldMap[oldPropName]] = obj[oldPropName];
      delete obj[oldPropName];
    }
  });
  return obj;
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
function sortBy (propName, arry) {
  return arry.sort((a,b) => {
    if (a[propName] > b[propName]) return 1;
    if (a[propName] < b[propName]) return -1;
    return 0;
  });
}

/**
 * Group array entries by a prop name
 */
function groupByProperty (propName, items) {
  let tracker = [];
  return items.reduce((acc, entry) => {
    // do we have this in the tracker?
    if (tracker.indexOf(entry[propName]) === -1) {
      // add to tracker...
      tracker.push(entry[propName]);
      // create entry in output
      acc.push({group: entry[propName], entries: [entry]});
    } else {
      // it's in the acc, so get it and push the
      let group = findBy(acc, 'group', entry[propName]);
      group.entries.push(entry);
    }
    return acc;
  }, []);
}
