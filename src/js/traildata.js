/**
 * Functions for fetching trail data
 */
import {
  getProp,
  cloneObject,
  extractProps,
  groupBy,
  sortBy,
  uniqueBy,
  curry,
  partial,
  pipe
} from './utils';

/**
 * Main function that orchestrates all the work
 */
export function getDataChain(filters) {
  return fetchData(filters)
    .then(mergeFeatures)
    .then(extractAttributes)
    .then(remapFields)
    .then(dedupeSegments)
    .then(cleanRows)
    .then(groupToAreas)
    .then(sortData)
    .catch((err) => {
      console.error(err);
      throw (err);
    })
}

export function getDataNaive(filters) {
  return Promise.all(
    [
      getFortCollinsData(filters.status),
      getLarimerData(filters.status)
    ])
    .then((results) => {
      // do lots of work here...
      // downside is that this is
      // difficult to test, and has
      // zero reuse
    })
}

export function getDataNaive2(filters) {
  // extract out the initial fetch work...
  return fetchData(filters)
    .then((results) => {
      // call function to do all the work...
      return processData(results);
    })
}
export function fetchData(filters) {
  return Promise.all([
    getFortCollinsData(filters.status),
    getLarimerData(filters.status)
  ]);
}

/**
 * Same output, using pipe
 */
export function getData(filters) {
  const processData = pipe(
    mergeFeatures,
    extractAttributes,
    remapFields,
    dedupeSegments,
    cleanRows,
    groupToAreas,
    sortData
  );
  return fetchData(filters)
    .then(processData);
}


/**
 * Given to feature service query responses, merge the features into
 * a single array
 */
export function mergeFeatures (queryResponses) {
  return queryResponses.reduce((acc, queryResponse) => {
    return acc.concat(queryResponse.features);
  }, []);
}

/**
 * ArcGIS Returns the data as "features", which have a structure like
 * `{attributes: {KEY:val...}, geometry:{...}}` but all we want is the
 * attributes hash
 */
export function extractAttributes (features) {
  debugger;
  // we want to map over the features array and apply a function to each entry
  // Array.map accepts a function, that will be passws 3 args: entry, index, array

  // the simplest thing to do is a map, returning
  // the attributes property
  // return features.map((entry) => {
  //   // guards so this does not blow up
  //   if (entry && entry.attributes) {
  //     return entry.attributes;
  //   }
  // })
  //
  // // To program defensively we want to use getProp,
  // // and we could code that like this:
  // return features.map((entry) => {
  //   return getProp('attributes', entry);
  // })
  //
  // // A more functional approach would be to pass a
  // // function to .map. We want to use getProp, but
  // // that takes two arguments one of which we want
  // // to pre-supply - 'attributes'.
  // // We can do that right inline like this
  // const getAttrs = (obj) => getProp('attributes', obj);
  // return features.map(getAttrs);
  //
  //
  // // This is called partial-application, and like
  // // many things we can abstract this into a utility,
  // // which we will call partial()
  const getAttrs = partial(getProp, 'attributes');
  return features.map(getAttrs);


  // Currying is similar partial application,
  // but offers more flexibility. At a high-level,
  // currying allows you to do partial application,
  // of multiple parameters, incrementally.
  // const curriedGetProp = autocurry(getProp);
  // const getAttrs = curriedGetProp('attributes');
  // // for our example here, it looks the same as using
  // // partial. However, if the function we wanted to use
  // // on our map took 7 arguments, we could
  // // send in the first 6 on the curry call
  // return features.map(getAttrs);


}

/**
 * We want to normalize the data, so we remap
 * the current attributes returned from the
 * service, into a standard set.
 */
export function remapFields (features) {
  debugger;
  // create a map of the current fields to the new fields
  const extractMap = {
    FNAME: 'name', PROPNAME: 'area', NATNAME: 'area',
    LOCATION: 'area', STATUS: 'status', MANAGER: 'manager'
  }
  // partially apply the extractMap into extractProps
  // to create a single argument fn for .map
  const swapPropsFn = partial(extractProps, extractMap);
  return features.map(swapPropsFn);
}

/**
 * Apply any attribute manipulation / standardization
 */
export function cleanRows (rows) {
  return rows.map((row) => {
    // convert status === null to "Closed"
    if(!row.status) {
      row.status = 'Closed';
    }
    return row;
  })
}


/**
* Since this is coming from geospatial data, we may
* have multiple records per trail. However, we don't
* want that. This function will remove the duplicate
* entries so we have one record per trail
*/
export function dedupeSegments (rows) {
  debugger;
  return uniqueBy('name', rows);
}

/**
 * This will group records into a nested
 * structure so we can show trails by Area
 * { areas: [{name: "area name", trails:[{name, status}, ...]}, ...]}
 */
export function groupToAreas (rows) {
  return {
    areas: groupBy('area', rows)
  };
}

/**
 * Sort the Areas, and the trails in the areas
 */
export function sortData (data) {
  debugger;
  // sort the areas...
  data.areas = sortBy('group', data.areas);
  // and the trails in them...
  data.areas = data.areas.map((a) => {
    a.entries = sortBy('name', a.entries);
    return a;
  });
  return data;
}

/**
 * Function that knows how to communicate with the City data
 */
function getFortCollinsData (status) {
  let serviceUrl = 'https://gisweb.fcgov.com/ArcGIS/rest/services/TrailStatus/MapServer/0/query';
  // let fields = '*';
  let fields = 'FNAME,STATUS,NATNAME,MANAGER,EDIT_BY,EDIT_DATE';
  // fields = '*';
  // let where = `(BIKEUSE = 'Yes') AND (STATUS = '${status}')`;
  let where = `FNAME NOT LIKE 'NONE%'`;
  // Remap status value into service value
  switch (status) {
    case 'open':
      where = `${where} AND STATUS = 'Open'`;
      break;
    case 'closed':
      where = `${where} AND STATUS = 'Closed'`;
    break;
  }
  return getAGSData(serviceUrl, fields, where);
}

/**
 * Function that knows how to communicate with the County data
 */
function getLarimerData (status) {
  let serviceUrl = 'https://gisweb.fcgov.com/ArcGIS/rest/services/TrailStatus/MapServer/1/query';
  let fields = 'FNAME,STATUS,LOCATION,MANAGER,EDIT_BY,EDIT_DATE';
  // fields = '*';
  let where = `FNAME NOT LIKE 'NONE%'`;
  switch (status) {
    case 'open':
      where = `${where} AND STATUS = '${status}'`;
      break;
    case 'closed':
      where = `${where} AND STATUS IS NULL`;
      break;
  }
  console.info(`Larimer data with ${where} for status: ${status}`);
  return getAGSData(serviceUrl, fields,  where);
}

/**
 * Generlized function that knows how to execute an ArcGIS Server request
 */
function getAGSData(serviceUrl, fields, where) {
  let params = {
    outFields: fields,
    returnGeometry: false,
    where: where
  };
  // urlify this...
  let url = `${serviceUrl}?f=json&${encodeForm(params)}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((err) => {
      console.error(`Error fetching ${err}`);
      throw err;
    })
}

/**
 * Encode an object into a query string
 */
function encodeForm (form = {}) {
   if (typeof form === 'string') { return form; }

   return Object.keys(form).reduce((acc, key) => {
     acc.push([key, form[key]].map(encodeURIComponent).join('='));
     return acc;
   }, []).join('&');
}
