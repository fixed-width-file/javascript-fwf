import { AbstractColumn } from '../columns/AbstractColumn.js';

/**
 * Descriptor representing a single row layout structure in a Fixed Width File.
 * Calculates column start/end offsets automatically and extracts typed object records from raw line strings.
 *
 * @example
 * const descriptor = new RowDescriptor([
 *   new CharColumn('name', 20),
 *   new PositiveIntegerColumn('age', 3)
 * ]);
 * console.log(descriptor.lineSize); // 23
 * const row = descriptor.getValues('KELSON MEDEIROS     045');
 * // { name: 'KELSON MEDEIROS', age: 45 }
 */
export class RowDescriptor {
  /**
   * Creates an instance of RowDescriptor.
   *
   * @param {AbstractColumn[]} columns - List of column instances composing the row layout.
   * @throws {TypeError} If columns argument is not an Array or elements are not AbstractColumn instances.
   * @throws {Error} If columns array is empty or column positions overlap/contain gaps.
   */
  constructor(columns) {
    if (!Array.isArray(columns)) {
      throw new TypeError('columns deve ser uma List');
    }
    if (columns.length === 0) {
      throw new Error('columns deve ter ao menos 1 elemento');
    }

    /**
     * List of columns forming this row descriptor.
     * @type {AbstractColumn[]}
     */
    this.columns = columns;

    let last = null;
    for (const column of columns) {
      if (!(column instanceof AbstractColumn)) {
        throw new TypeError('Todos os elementos de columns devem ser instâncias de AbstractColumn');
      }
      column.start = last ? last.end + 1 : 1;
      last = column;
    }

    this.validatePositions();
  }

  /**
   * Total line size width in characters calculated from the last column's end position.
   *
   * @type {number}
   */
  get lineSize() {
    return this.columns[this.columns.length - 1].end;
  }

  /**
   * Validates contiguous column alignment starting from position 1 without gaps or overlaps.
   *
   * @throws {Error} If alignment check fails.
   */
  validatePositions() {
    let prev = null;
    for (const col of this.columns) {
      if (prev === null) {
        if (col.start !== 1) {
          throw new Error(`A coluna ${col.name} deve começar com 1`);
        }
      } else {
        if (prev.end + 1 !== col.start) {
          throw new Error(
            `A coluna ${col.name} (starts in ${col.start}) deve começar imediatamente após a coluna ${prev.name} (ends in ${prev.end})`
          );
        }
      }
      prev = col;
    }
  }

  /**
   * Extracts and parses a raw fixed-width row line string into a key-value object of typed values.
   *
   * @param {string} rowLine - Fixed-width row string matching the line size.
   * @returns {Record<string, *>} Object containing parsed column key-value pairs.
   * @throws {TypeError} If rowLine is not a string.
   */
  getValues(rowLine) {
    if (typeof rowLine !== 'string') {
      throw new TypeError('rowLine deve ser uma string');
    }
    const result = {};
    for (const col of this.columns) {
      const slice = rowLine.substring(col.start - 1, col.end);
      result[col.name] = col.toValue(slice);
    }
    return result;
  }
}
