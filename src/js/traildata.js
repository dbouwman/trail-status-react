/**
 * Functions for fetching trail data
 */
import {
  getProp,
  cloneObject,
  extractProps,
  groupBy,
  sortBy,
  uniqueBy
} from './utils';

/**
 * Main function that orchestrates all the work
 */
export function getData(filters) {
  return Promise.all([getFortCollinsData(filters.status), getLarimerData(filters.status)])
    .then(mergeFeatures)
    .then(extractAttributes)
    .then(remapFields)
    .then(dedupeSegments)
    .then(cleanRows)
    .then(groupToAreas)
    .then(sortData)
    .catch((err) => {
      throw (err);
    })
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
  // create a new unary function that wraps getProp and assigns
  // attributes to the prop name
  const getAttrs = (obj) => getProp('attributes', obj);
  // we need to do this because getProp on it's own takes multiple properties,
  // and map passes multiple properties. Also we want to pre-load the function
  // with 'attributes' and only pass in the row during the map

  // now map over the features applying the function
  return features.map(getAttrs);
}

/**
 * We want to normalize the data, so we remap the current attributes
 * returned from the service, into a standard set.
 */
export function remapFields (features) {
  // create a map of the current fields to the new fields
  const extractMap = {
    FNAME: 'name',
    PROPNAME: 'area',
    NATNAME: 'area',
    LOCATION: 'area',
    STATUS: 'status',
    MANAGER: 'manager'
  }
  // Partially Apply the extractMap to extractProps
  const swapPropsFn = (obj) => extractProps(extractMap, obj);
  // use the new function in our map call
  return features.map(swapPropsFn);
}

/**
 * Apply any attribute manipulation / standardization
 */
export function cleanRows (rows) {
  return rows.reduce((acc, row) => {
    // County Data will have status === null if it's not explicitly "Open"
    if(!row.status) {
      row.status = 'Closed';
    }
    acc.push(row);
    return acc;
  }, [])
}


/**
* Since this is coming from geospatial data, we may have multiple records
* per trail. However, we don't want that.
* This function will remove the duplicate entries so we have one record per trail
*/
export function dedupeSegments (rows) {
  return uniqueBy('name', rows);
}

/**
 * This will group records into a nested structure so we can show trails
 * by the Area
 * {areas: [{name: "area name", trails:[{name, status}, ...]}, ...]}
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
  fields = '*';
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
