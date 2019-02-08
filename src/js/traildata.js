/**
 * Functions for fetching trail data
 */
import {getProp, cloneObject, extractProperties, groupByProperty} from './utils';

/**
 * Main function that orchestrates all the work
 */
export function getOldData(filters) {
  return Promise.resolve({
    areas: [
      {
        name: "Pineridge Natural Area",
        trails: [
          { name: "RIDGE TRAIL", status: "Open" },
          { name: "RESERVOIR LOOP TRAIL", status: "Open" },
          { name: "SOUTH LOOP TRAIL", status: "Open" },
          { name: "TIMBER TRAIL", status: "Open" },
          { name: "VALLEY TRAIL", status: "Open" }
        ]
      }
    ]
  })
}

export function getData(filters) {
  return Promise.all([getFortCollinsData(filters.state), getLarimerData(filters.state)])
    .then(mergeFeatures)
    .then(extractAttributes)
    .then(remapFields)
    .then(reduceSegments)
    .then(groupToAreas)
    // sortByAreaName
    // reduceAndSortEntries
    .catch((err) => {
      debugger;
    })
}

/**
 * Since this is coming from geospatial data, we may have multiple records
 * per trail. However, we don't want that.
 * This function will remove the duplicate entries so we have one record per trail
 * and we will use the more dominant status
 * i.e. if the trail has 5 segments, and 3 are open, we will declare the trail open
 */
export function reduceSegments (rows) {
  return rows.reduce((acc, row) => {
    if (row.name.indexOf('NONE') === -1) {
      if(!row.status) {
        row.status = 'closed';
      }
      acc.push(row);
    }
    return acc;
  }, [])
}

/**
 * This will group records into a nested structure so we can show trails
 * by the Area
 * {areas: [{name: "area name", trails:[{name, status}, ...]}, ...]}
 */
export function groupToAreas (rows) {
  return {
    areas: groupByProperty('area', rows)
  };
}

/**
 * Given to feature service query responses, merge the features into
 * a single array
 */
export function mergeFeatures (queryResponses) {
  return queryResponses.reduce((acc, queryResponse) => {
    return acc.concat(queryResponse.features);
  }, [])
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


export function remapFields (features) {
  const fieldMap = {
    FNAME: 'name',
    PROPNAME: 'area',
    NATNAME: 'area',
    LOCATION: 'area',
    STATUS: 'status'
  }
  // create a unary function to swap the property names
  const swapProps = (obj) => extractProperties(fieldMap, obj);
  return features.map(swapProps);
}



// Basic Flow
// getFortCollinsData (status)
// -> fetch data from AGS layer appying required filters
// -> normalize rows

// getCountyData (status)
// -> fetch data from AGS layer, applying required filters
// -> normalize rows
//
// -> Concat Rows
// -> Aggregate into Areas
//
//

function getFortCollinsData (state) {
  let serviceUrl = 'https://gisweb.fcgov.com/ArcGIS/rest/services/TrailStatus/MapServer/0/query';
  // let fields = '*';
  let fields = 'FNAME,STATUS,NATNAME,MANAGER,EDIT_BY,EDIT_DATE';
  // return getAGSData(serviceUrl, fields, `(BIKEUSE = 'Yes') AND (STATUS = '${state}')`);
  return getAGSData(serviceUrl, fields, `1=1`);
}

function getLarimerData (state) {
  let serviceUrl = 'https://gisweb.fcgov.com/ArcGIS/rest/services/TrailStatus/MapServer/1/query';
  let fields = 'FNAME,STATUS,LOCATION,MANAGER,EDIT_BY,EDIT_DATE';
  let where = '1=1';
  switch (state) {
    case 'Open':
      where = `STATUS = '${state}'`;
      break;
  }
  return getAGSData(serviceUrl, fields,  where);
}


function getAGSData(serviceUrl, fields, where) {
  let params = {
    outFields: fields,
    returnGeometry: false,
    where: where
  };
  // urlify this...
  let url = `${serviceUrl}?f=json&${encodeForm(params)}`;
  return fetch(url)
  .then((response) => {
    return response.json();
  })
  .catch((err) => {
    console.error(`Error fetching ${err}`);
  })
}

/**
 * Encode an object into a query string
 */
function encodeForm (form = {}) {
   if (typeof form === 'string') { return form; }

   return Object.keys(form).reduce((acc, key) => {
     if ((form[key])) {
       acc.push([key, form[key]].map(encodeURIComponent).join('='));
     }
     return acc;
   }, []).join('&');
}
