import { isDeepEqual } from '../../../store/model/history';

const base = {
  a: [{ b: true }, { b: undefined }, { c: 'foo' }],
  d: {
    e: 1,
    f: 2,
    g: 'bar',
  },
  h: {
    i: null,
    j: '42',
  },
  k: [],
};

// Identical
const equal1 = {
  a: [{ b: true }, { b: undefined }, { c: 'foo' }],
  d: {
    e: 1,
    f: 2,
    g: 'bar',
  },
  h: {
    i: null,
    j: '42',
  },
  k: [],
  l: '',
};

// Undefined/null prop removed, but in array it would have significance.
const equal2 = {
  a: [{ b: true }, { b: undefined }, { c: 'foo' }],
  d: {
    e: 1,
    f: 2,
    g: 'bar',
  },
  h: {
    j: '42',
  },
};

// Prop order changed.
const equal3 = {
  d: {
    e: 1,
    g: 'bar',
    f: 2,
  },
  a: [{ b: true }, { b: undefined }, { c: 'foo' }],
  h: {
    i: null,
    j: '42',
  },
  k: [],
  l: '',
};

// Primitive value inequality 1.
const unequal1 = {
  a: [{ b: true }, { b: undefined }, { c: 'foox' }],
  d: {
    e: 1,
    f: 2,
    g: 'bar',
  },
  h: {
    i: null,
    j: '42',
  },
  k: [],
  l: '',
};

// Primitive value inequality 2.
const unequal2 = {
  a: [{ b: false }, { b: undefined }, { c: 'foo' }],
  d: {
    e: 1,
    f: 3,
    g: 'bar',
  },
  h: {
    i: null,
    j: '42',
  },
  k: [],
  l: '',
};

// Top level prop missing.
const unequal3 = {
  a: [{ b: true }, { b: undefined }, { c: 'foo' }],
  d: {
    e: 1,
    f: 2,
    g: 'bar',
  },
  k: [],
  l: '',
};

// Obvious inequality
const unequal4 = {
  a: [],
  d: {},
  h: {},
  k: [],
  l: '',
};

// Changed array order is breaking equality. Arrays are currently used for
// headers, and in theory header order might have significance.
const unequal5 = {
  a: [{ b: undefined }, { c: 'foo' }, { b: true }],
  d: {
    e: 1,
    f: 2,
    g: 'bar',
  },
  h: {
    i: null,
    j: '42',
  },
  k: [],
  l: '',
};

describe('Form history model', () => {
  test('History entry duplicate detection with deep object comparison', () => {
    expect(isDeepEqual(base, equal1)).toBe(true);
    expect(isDeepEqual(base, equal2)).toBe(true);
    expect(isDeepEqual(base, equal3)).toBe(true);
    expect(isDeepEqual(base, unequal1)).toBe(false);
    expect(isDeepEqual(base, unequal2)).toBe(false);
    expect(isDeepEqual(base, unequal3)).toBe(false);
    expect(isDeepEqual(base, unequal4)).toBe(false);
    expect(isDeepEqual(base, unequal5)).toBe(false);
  });
});
