import { describe, it, expect } from 'vitest';
import {
  AbstractColumn,
  CharColumn,
  RightCharColumn,
  PositiveIntegerColumn,
  PositiveDecimalColumn,
  DateTimeColumn,
  DateColumn,
  TimeColumn,
} from '../src/index.js';

describe('AbstractColumn & Validations', () => {
  it('validates name, size, start, end', () => {
    expect(() => new CharColumn(null, 10)).toThrow(TypeError);
    expect(() => new CharColumn('', 10)).toThrow(Error);
    expect(() => new CharColumn('  ', 10)).toThrow(Error);
    expect(() => new CharColumn('name', 0)).toThrow(Error);
    expect(() => new CharColumn('name', -5)).toThrow(Error);

    const col = new CharColumn('name', 10, 'desc');
    expect(col.name).toBe('name');
    expect(col.size).toBe(10);
    expect(col.description).toBe('desc');
    expect(col.start).toBeNull();
    expect(() => col.end).toThrow(TypeError);

    col.start = 1;
    expect(col.end).toBe(10);

    col.start = 0;
    expect(() => col.end).toThrow(Error);

    expect(() => col.toValue(123)).toThrow(Error);
    expect(() => col.toValue('short')).toThrow(Error);
    expect(() => col.validateToStrSize('short')).toThrow(Error);

    class DummyColumn extends AbstractColumn {}
    const dummy = new DummyColumn('d', 5);
    expect(() => dummy.toStr('val')).toThrow('toStr method must be implemented');
  });
});

describe('CharColumn & RightCharColumn', () => {
  it('handles CharColumn toValue and toStr', () => {
    const cd = new CharColumn('name', 4, 'desc');
    expect(cd.description).toBe('desc');
    expect(new CharColumn('name', 4).description).toBe('name');

    expect(cd.toValue('asdf')).toBe('asdf');
    expect(cd.toValue('a   ')).toBe('a');
    expect(cd.toValue('    ')).toBe('');

    expect(() => cd.toStr(123)).toThrow(Error);
    expect(() => cd.toStr(true)).toThrow(Error);
    expect(() => cd.toStr('12345')).toThrow(Error);

    expect(cd.toStr('asdf')).toBe('asdf');
    expect(cd.toStr('a')).toBe('a   ');
    expect(cd.toStr('')).toBe('    ');
    expect(cd.toStr(null)).toBe('    ');
    expect(cd.toStr(undefined)).toBe('    ');
  });

  it('handles RightCharColumn toValue and toStr', () => {
    const cd = new RightCharColumn('name', 4, 'desc');
    expect(cd.toStr('asdf')).toBe('asdf');
    expect(cd.toStr('a')).toBe('   a');
    expect(cd.toStr('')).toBe('    ');
    expect(cd.toStr(null)).toBe('    ');

    expect(() => cd.toStr(123)).toThrow(Error);
    expect(() => cd.toStr('12345')).toThrow(Error);

    expect(cd.toValue('asdf')).toBe('asdf');
    expect(cd.toValue('   a')).toBe('a');
    expect(cd.toValue('    ')).toBe('');
  });
});

describe('PositiveIntegerColumn & PositiveDecimalColumn', () => {
  it('handles PositiveIntegerColumn', () => {
    const cd = new PositiveIntegerColumn('name', 4, 'desc');

    expect(cd.toStr(null)).toBe('0000');
    expect(cd.toStr(0)).toBe('0000');
    expect(cd.toStr(1)).toBe('0001');
    expect(cd.toStr(1234)).toBe('1234');

    expect(() => cd.toStr(-1)).toThrow(Error);
    expect(() => cd.toStr(12345)).toThrow(Error);
    expect(() => cd.toStr('not a number')).toThrow(Error);

    expect(cd.toValue('1234')).toBe(1234);
    expect(cd.toValue('0000')).toBe(0);
    expect(cd.toValue('0001')).toBe(1);
    expect(cd.toValue('   1')).toBe(1);

    expect(() => cd.toValue('abcd')).toThrow(Error);
    expect(() => cd.toValue('-001')).toThrow(Error);
  });

  it('handles PositiveDecimalColumn', () => {
    expect(() => new PositiveDecimalColumn('name', 4, 0)).toThrow(Error);
    expect(() => new PositiveDecimalColumn('name', 4, -1)).toThrow(Error);
    expect(() => new PositiveDecimalColumn('name', 4, 4)).toThrow(Error);
    expect(() => new PositiveDecimalColumn('name', 4, 5)).toThrow(Error);

    const cd = new PositiveDecimalColumn('name', 4, 2, 'desc');
    expect(cd.decimals).toBe(2);

    expect(cd.toStr(null)).toBe('0000');
    expect(cd.toStr(0.0)).toBe('0000');
    expect(cd.toStr(0.01)).toBe('0001');
    expect(cd.toStr(1.0)).toBe('0100');
    expect(cd.toStr(12.34)).toBe('1234');

    expect(() => cd.toStr(-1.0)).toThrow(Error);
    expect(() => cd.toStr(123.45)).toThrow(Error);

    expect(cd.toValue('1234')).toBe(12.34);
    expect(cd.toValue('0000')).toBe(0.0);
    expect(cd.toValue('0001')).toBe(0.01);
    expect(() => cd.toValue('abcd')).toThrow(Error);
  });
});

describe('DateTimeColumn, DateColumn, TimeColumn', () => {
  it('handles DateTimeColumn', () => {
    expect(() => new DateTimeColumn(null)).toThrow(TypeError);
    expect(() => new DateTimeColumn('')).toThrow(Error);
    expect(() => new DateTimeColumn('dt', null)).toThrow(TypeError);
    expect(() => new DateTimeColumn('dt', '')).toThrow(Error);
    expect(() => new DateTimeColumn('dt', '%d%m%Y')).toThrow(Error);

    const cd = new DateTimeColumn('dt', '%d%m%Y%H%M%S', 'desc', 6);
    expect(cd.toStr(null)).toBe('00000000000000');
    expect(cd.toStr(undefined)).toBe('00000000000000');
    expect(() => cd.toStr('invalid')).toThrow(TypeError);
    expect(() => cd.toStr(new Date('invalid'))).toThrow(TypeError);

    const d = new Date(Date.UTC(2001, 11, 31, 23, 59, 59));
    expect(cd.toStr(d)).toBe('31122001235959');

    const parsed = cd.toValue('31122001235959');
    expect(parsed.getUTCFullYear()).toBe(2001);
    expect(parsed.getUTCMonth()).toBe(11);
    expect(parsed.getUTCDate()).toBe(31);

    expect(cd.toValue('00000000000000')).toBeNull();
    expect(() => cd.toValue('99999999999999')).toThrow(Error);
  });

  it('handles DateColumn and TimeColumn', () => {
    const dateCol = new DateColumn('dt', '%d%m%Y');
    expect(dateCol.size).toBe(8);

    const timeCol = new TimeColumn('tm', '%H%M');
    expect(timeCol.size).toBe(4);
  });
});
