import { AbstractColumn } from './AbstractColumn.js';

/**
 * Positive integer column formatted with leading zeros.
 * Parses strings of digits into integer numbers, and serializes positive integers padded with leading zeros.
 *
 * @extends AbstractColumn
 * @example
 * const col = new PositiveIntegerColumn('age', 3, 'Age in years');
 * col.toValue('045'); // 45
 * col.toStr(45); // '045'
 */
export class PositiveIntegerColumn extends AbstractColumn {
  /**
   * Converts raw string slice from file into a positive integer.
   *
   * @param {string} slice - Raw fixed-width slice consisting of digits.
   * @returns {number} Parsed integer value.
   * @throws {Error} If slice contains non-digit characters or parses to negative integer.
   */
  toValue(slice) {
    super.toValue(slice);
    const trimmed = slice.trim();
    if (!/^\d+$/.test(trimmed)) {
      throw new Error(`Informe uma string para converter corretamente, '${slice}' não é um 'positive int'`);
    }
    const val = parseInt(trimmed, 10);
    if (val < 0) {
      throw new Error(`Informe uma string para converter corretamente, '${slice}' não é um 'positive int'`);
    }
    return val;
  }

  /**
   * Serializes a non-negative integer into a zero-padded fixed-width string.
   *
   * @param {number|null} value - Positive integer value to serialize. Null/undefined serializes to zeros.
   * @returns {string} Zero-padded fixed-width string.
   * @throws {Error} If value is not a non-negative integer or exceeds size formatted length.
   */
  toStr(value) {
    if (value === null || value === undefined) {
      return '0'.repeat(this.size);
    }
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
      throw new Error(`O campo '${this.name}' só aceita 'positive int' ou 'None'`);
    }
    const formatted = String(value).padStart(this.size, '0');
    return this.validateToStrSize(formatted);
  }
}
