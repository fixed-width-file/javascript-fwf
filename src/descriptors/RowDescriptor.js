import { AbstractColumn } from '../columns/AbstractColumn.js';

/**
 * Descriptor representing a single row layout in a Fixed Width File.
 */
export class RowDescriptor {
  /**
   * @param {AbstractColumn[]} columns
   */
  constructor(columns) {
    if (!Array.isArray(columns)) {
      throw new TypeError('columns deve ser uma List');
    }
    if (columns.length === 0) {
      throw new Error('columns deve ter ao menos 1 elemento');
    }

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

  get lineSize() {
    return this.columns[this.columns.length - 1].end;
  }

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
   * Slices line string into key-value map.
   * @param {string} rowLine
   * @returns {Record<string, any>}
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
