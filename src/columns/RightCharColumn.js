import { AbstractColumn } from './AbstractColumn.js';

/**
 * Right-aligned, space-padded character column.
 * Trims whitespace when parsing values, and pads with leading spaces when serializing.
 *
 * @extends AbstractColumn
 * @example
 * const col = new RightCharColumn('code', 5, 'Product Code');
 * col.toValue('  A12'); // 'A12'
 * col.toStr('A12'); // '  A12'
 */
export class RightCharColumn extends AbstractColumn {
  /**
   * Converts raw string slice from file to column value (trimmed string).
   *
   * @param {string} slice - Raw fixed-width slice.
   * @returns {string} Trimmed string value.
   */
  toValue(slice) {
    const base = super.toValue(slice);
    return base.trim();
  }

  /**
   * Serializes value into a right-aligned, space-padded fixed-width string.
   *
   * @param {string|null} value - String value to serialize. Null/undefined serializes to spaces.
   * @returns {string} Space-padded fixed-width string.
   * @throws {Error} If value is not a string or exceeds column size.
   */
  toStr(value) {
    if (value === null || value === undefined) {
      return ' '.repeat(this.size);
    }
    if (typeof value !== 'string') {
      throw new Error(`O campo '${this.name}' só aceita 'right_char' ou 'None'`);
    }
    if (value.length > this.size) {
      throw new Error(`O valor a ser serializado para o campo '${this.name}' não pode ser diferente de ${this.size} `);
    }
    const padded = value.padStart(this.size, ' ');
    return this.validateToStrSize(padded);
  }
}
