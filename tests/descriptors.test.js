import { describe, it, expect } from 'vitest';
import {
  CharColumn,
  PositiveIntegerColumn,
  RowDescriptor,
  HeaderRowDescriptor,
  DetailRowDescriptor,
  FooterRowDescriptor,
  FileDescriptor,
} from '../src/index.js';

describe('RowDescriptor & FileDescriptor Validations', () => {
  it('handles RowDescriptor validations', () => {
    expect(() => new RowDescriptor(null)).toThrow(TypeError);
    expect(() => new RowDescriptor([])).toThrow(Error);
    expect(() => new RowDescriptor([123])).toThrow(TypeError);

    const c1 = new CharColumn('c1', 5);
    const c2 = new PositiveIntegerColumn('c2', 3);
    const rd = new RowDescriptor([c1, c2]);

    expect(c1.start).toBe(1);
    expect(c1.end).toBe(5);
    expect(c2.start).toBe(6);
    expect(c2.end).toBe(8);
    expect(rd.lineSize).toBe(8);

    expect(rd.getValues('HELLO045')).toEqual({ c1: 'HELLO', c2: 45 });
    expect(() => rd.getValues(123)).toThrow(TypeError);

    const badCol = new CharColumn('bad', 5);
    badCol.start = 2;
    const badStartRow = Object.create(RowDescriptor.prototype);
    badStartRow.columns = [badCol];
    expect(() => badStartRow.validatePositions()).toThrow(Error);

    const c3 = new CharColumn('c3', 5);
    const c4 = new CharColumn('c4', 5);
    c3.start = 1;
    c4.start = 10;
    const badRow = Object.create(RowDescriptor.prototype);
    badRow.columns = [c3, c4];
    expect(() => badRow.validatePositions()).toThrow(Error);
  });

  it('validates FileDescriptor detail and header/footer line sizes', () => {
    expect(() => new FileDescriptor(null)).toThrow(TypeError);
    expect(() => new FileDescriptor([])).toThrow(Error);
    expect(() => new FileDescriptor(['not detail'])).toThrow(TypeError);

    const c1 = new CharColumn('c1', 5);
    const d1 = new DetailRowDescriptor([c1]);
    const d2 = new DetailRowDescriptor([new CharColumn('c2', 6)]);

    expect(() => new FileDescriptor([d1, d2])).toThrow(Error);

    const h = new HeaderRowDescriptor([new CharColumn('h', 6)]);
    expect(() => new FileDescriptor([d1], h)).toThrow(Error);

    const f = new FooterRowDescriptor([new CharColumn('f', 6)]);
    expect(() => new FileDescriptor([d1], null, f)).toThrow(Error);

    const fd = new FileDescriptor([d1]);
    expect(fd.lineSize).toBe(5);
  });
});
