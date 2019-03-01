import {
  cloneObject,
  extractProps,
  filterBy,
  getProp,
  maybeAdd,
  maybePush,
  partial,
  partial2,
  pipe,
  uniqueBy
} from './utils';



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

describe('maybePush', () => {
  test('adds non-null to array', () => {
    const t = [];
    let chk = maybePush('blue', t);
    expect(chk.length).toEqual(1);
    expect(chk[0]).toEqual('blue');
  });

  test('adds clone of object to array', () => {
    const t = [{name: "Dave"}];
    const v = {name: "Mike"};
    let chk = maybePush(v , t);
    expect(chk.length).toEqual(2);
    expect(chk[1]).toEqual(v);
    expect(chk[1]).not.toBe(v);
  });

  test('does not add null to array', () => {
    const t = [{name: "Dave"}];
    let chk = maybePush(null, t);
    expect(chk.length).toEqual(1);
  })
})

describe('filterBy', () => {
  test('finds entries by prop value', () => {
    const d = [{color: 'red'}, {color:'blue'}];
    const chk = filterBy('color','red', d);
    expect(chk).toBeDefined();
    expect(chk.length).toEqual(1);
    expect(chk[0].color).toEqual('red');
  });
  test('returns empty array if not found', () => {
    const d = [{color: 'red'}, {color:'blue'}];
    const chk = filterBy('color','orange', d);
    expect(chk).toBeDefined();
    expect(chk.length).toEqual(0);
  });
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
});

describe('partial2', () => {
  test('returns a function with first arg applied', () => {
    const add = (a,b) => a + b;
    const add5 = partial2(add, 5);
    expect(typeof add5).toEqual('function');
    const chk = add5(10);
    expect(chk).toEqual(15);
  })
})

describe('partial', () => {
  test('returns a function with args applied', () => {
    const add = (a,b,c) => a + b + c;
    const add15 = partial(add, 5, 10);
    expect(typeof add15).toEqual('function');
    const chk = add15(10);
    expect(chk).toEqual(25);
  })
  test('allows multiple args at execution time', () => {
    const add = (a,b,c,d) => a + b + c + d;
    const add15 = partial(add, 5, 10);
    expect(typeof add15).toEqual('function');
    const chk = add15(10, 23);
    expect(chk).toEqual(48);
  })
});

describe('pipe', () => {
  test('calls functions in order', () => {
    const addfive = (n) => 5 + n;
    const double = (n) => n * 2;
    const p = pipe(addfive, double);
    const chk = p(4);
    expect(chk).toEqual(18);
  })
});

describe('uniqueBy', () => {
  test('returns unique entries by a property', () => {
    const data =  [
      {color: 'red', size: 1}, {color:'blue', size: 4},
      {color: 'red', size: 10}, {color:'orange', size: 40}
    ];
    const chk = uniqueBy('color', data);
    expect(chk.length).toEqual(3);
  })
})
