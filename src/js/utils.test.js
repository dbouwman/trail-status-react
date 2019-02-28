import {
  getProp,
  cloneObject,
  extractProps,
  maybeAdd,
  partial
} from './utils';
import { curry } from './curry.js'


describe('getProp:', () => {
  let data;
  beforeEach(() => {
    data = {
      a: {
        b: {
          c: {
            color: 'red'
          }
        }
      }
    };
  });
  test('returns deep value', () => {
    let chk = getProp('a.b.c.color', data);
    expect(chk).toBe('red');
  });

  test('returns undefined for non-existant path', () => {
    let chk = getProp('a.b.c.name', data);
    expect(chk).toBeUndefined();
  });

  test('returns undefined if obj is null', () => {
    let chk = getProp('a.b.c.name', null);
    expect(chk).toBeUndefined();
  });
});

describe('maybeAdd', () => {

  test('adds non-null to object', () => {
    const t = {
      name: 'Dave'
    };
    let chk = maybeAdd('color', 'blue', t);
    expect(chk.color).toEqual('blue');
  });

  test('adds clone of object to object', () => {
    const t = {
      name: 'Dave'
    };
    const c = {r: 255, g: 203, b: 100};
    let chk = maybeAdd('color', c , t);
    expect(chk.color).not.toBe(c);
    expect(chk.color).toEqual(c);
    expect(chk).not.toBe(t);
  });

  test('does not add null to object', () => {
    const t = {
      name: 'Dave'
    };
    let chk = maybeAdd('color', null, t);
    expect(chk.color).toBeUndefined();
    expect(chk).toBe(t);
  })


})

describe('extractProps: ', ()=> {

  test('returns new object with new props', () => {
    let data = {
      PERSON_NAME: 'Dave Bouwman',
      PHONE: '303 433 0201', FAV_COLOR: 'blue'
    };
    const fieldMap = {
      PERSON_NAME: 'name', PHONE: 'phone',
      FAV_COLOR: 'color', NOT_PROP: 'other'
    };
    let chk = extractProps(fieldMap, data);
    expect(chk).not.toBe(data);
    expect(chk).toEqual({
      name: 'Dave Bouwman',
      phone: '303 433 0201',
      color: 'blue'
    });
  })
})

// describe('')

// describe('curry and partial', () => {
//   // test('curry accepts 1-N args', () => {
//   //   const add3 = function(a,b,c) {
//   //     return a+b+c;
//   //   };
//   //   expect(add3(1,2,3)).toEqual(6);
//   //   let cadd3 = curry(add3);
//   //   let chk = cadd3(1)(2)(3);
//   //   expect(chk).toEqual(6);
//   //   expect(cadd3(1,2)(3)).toEqual(6);
//   //   expect(cadd3(1,2,3)).toEqual(6);
//   // })
// })
