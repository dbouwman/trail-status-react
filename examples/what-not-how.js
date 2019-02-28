

// array of values
let d = [1,2,3,4];
// for loop...
let doubles = [];
for(i = 0; i < d.length; i++) {
   doubles.push(d[i] * 2)
}
console.log(doubles) // [2,4,6,8]

// array of values
let d = [1,2,3,4];
// forEach... let the array iterate
doubles = [];
d.forEach(n => {
  doubles.push(n * 2 )
})
console.log(doubles) // [2,4,6,8]

// array.map applies a function
// to each element and returns
// a new array
doubles = d.map(n => n *2)
console.log(doubles) // [2,4,6,8]

// Sparse arrays...
let sparse = [1,2, null, 4];

let sqrs = sparse.map(n => n * n);
console.log(sqrs) // [1,4,0,16]

let sparse = [1,2, null, 4];
// Array.reduce applies a function
// to each element, and *may* accumulate
// the output value
sqrs = sparse.reduce((acc, n) => {
  if (n) {
    acc.push(n * n);
  }
  return acc;
}, []);
console.log(sqrs) //[1,4,16]

// we can build other fn's from reduce...
let data = [{color: 'orange'}, {color:'red'}, {color:'blue'}];
// filter entries with color === 'red'
let reds = data.reduce((acc, entry) => {
  if (entry.color === 'red') {
    acc.push(entry);
  }
  return acc;
}, []);
console.log(reds); // [{color:'red'}]

// Generalized...
function filterBy(prop, value, arr) {
  return arr.reduce((acc, entry) => {
    if (entry[prop] === value) {
      acc.push(entry);
    }
    return acc;
  }, [])
}
blues = filterBy('color', 'blue', data);
console.log(blues); // [{color:blue}]
