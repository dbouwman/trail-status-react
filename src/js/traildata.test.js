import {
  mergeFeatures
} from './traildata'

describe('mergeFeatures', () => {

  test('merges feature responses', () => {
    let resp1 = {features:[{id:"one"},{id:"two"}]};
    let resp2 = {features:[{id:"three"}]};
    const chk = mergeFeatures([resp1, resp2]);
    expect(chk).toHaveLength(3);
    expect(chk[0]).toEqual(resp1.features[0]);
    expect(chk[1]).toBe(resp1.features[1]);
    expect(chk[2]).toBe(resp2.features[0]);
  });

})
