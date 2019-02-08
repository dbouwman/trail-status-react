import {getProp, cloneObject, extractProperties, maybeAdd} from './utils';


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

describe('extractProperties: ', ()=> {

  let data;
  beforeEach(()=>{
    data = {
      PERSON_NAME: 'Dave Bouwman',
      PHONE: '303 433 0201',
      FAV_COLOR: 'blue'
    };
  });

  test('returns new object with new props', () => {
    const map = {
      PERSON_NAME: 'name',
      PHONE: 'phone',
      FAV_COLOR: 'color',
      NOT_PROP: 'other'
    };
    let chk = extractProperties(map, cloneObject(data));
    expect(chk).not.toBe(data);
    expect(chk.name).toEqual(data.PERSON_NAME);
    expect(chk.phone).toEqual(data.PHONE);
    expect(chk.color).toEqual(data.FAV_COLOR);
    expect(chk.other).toBeUndefined();
  })

})
