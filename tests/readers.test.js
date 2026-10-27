import { describe, it, expect } from 'vitest';
import { CharColumn, PositiveIntegerColumn, DetailRowDescriptor, FileDescriptor, Reader } from '../src/index.js';

describe('Reader', () => {
  it('reads string content line by line', () => {
    expect(() => new Reader('content', null)).toThrow(TypeError);
    expect(() => new Reader(123, new FileDescriptor([new DetailRowDescriptor([new CharColumn('c', 5)])]))).toThrow(TypeError);

    const c1 = new CharColumn('name', 10);
    const c2 = new PositiveIntegerColumn('age', 3);
    const fd = new FileDescriptor([new DetailRowDescriptor([c1, c2])]);

    const content = 'KELSON    045\r\nMARIA     030\r\n';
    const reader = new Reader(content, fd);

    expect(reader.linesCount).toBe(2);
    const rows = Array.from(reader);

    expect(rows).toEqual([
      { name: 'KELSON', age: 45 },
      { name: 'MARIA', age: 30 },
    ]);
    expect(reader.lineNum).toBe(2);

    const arrayReader = new Reader(['KELSON    045\n', 'MARIA     030'], fd);
    expect(Array.from(arrayReader)).toEqual([
      { name: 'KELSON', age: 45 },
      { name: 'MARIA', age: 30 },
    ]);

    const setReader = new Reader(new Set(['KELSON    045\n', 'MARIA     030']), fd);
    expect(Array.from(setReader)).toEqual([
      { name: 'KELSON', age: 45 },
      { name: 'MARIA', age: 30 },
    ]);
  });

  it('validates line length during initialization', () => {
    const c1 = new CharColumn('name', 5);
    const fd = new FileDescriptor([new DetailRowDescriptor([c1])]);

    expect(() => new Reader('SHORT\nTOO LONG LINE\n', fd)).toThrow(Error);
  });

  it('strips only trailing line breaks from array and iterable input', () => {
    const fd = new FileDescriptor([new DetailRowDescriptor([new CharColumn('c', 3)])]);
    const reader = new Reader(['AB \r\n\r\n', 'CD \n', 'EF \r', 'GH '], fd);
    expect(reader.extractLines(['AB \r\n\r\n', 'CD \n', 'EF \r', 'GH '])).toEqual(['AB ', 'CD ', 'EF ', 'GH ']);
    expect(reader.extractLines(new Set(['IJ \n\n', 'KL ']))).toEqual(['IJ ', 'KL ']);
    const long = 'X'.repeat(20) + '\n'.repeat(50000);
    expect(reader.extractLines([long])).toEqual(['X'.repeat(20)]);
  });
});
