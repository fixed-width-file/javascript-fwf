import { PositiveIntegerColumn } from './PositiveIntegerColumn.js';

/**
 * Positive decimal column formatted with fixed decimal places and leading zeros.
 * Represents fixed-point numbers without explicit decimal points (e.g. 125050 with 2 decimals = 1250.50).
 *
 * @extends PositiveIntegerColumn
 * @example
 * const col = new PositiveDecimalColumn('amount', 9, 2, 'Total Amount');
 * col.toValue('000125050'); // 1250.5
 * col.toStr(1250.50); // '000125050'
 */
export class PositiveDecimalColumn extends PositiveIntegerColumn {
  /**
   * Creates an instance of PositiveDecimalColumn.
   *
   * @param {string} name - Column identifier name.
   * @param {number} size - Total column size width, must be > decimals.
   * @param {number} [decimals=2] - Number of implicit decimal places, must be > 0.
   * @param {string|null} [description=null] - Column description.
   * @throws {Error} If decimals is <= 0 or size is <= decimals.
   */
  constructor(name, size, decimals = 2, description = null) {
    super(name, size, description);
    if (typeof decimals !== 'number' || decimals <= 0) {
      throw new Error('Os decimais devem ser maior que 0');
    }
    if (size <= decimals) {
      throw new Error('Os decimais devem ser menores que o size');
    }

    /**
     * Implicit decimal places.
     * @type {number}
     */
    this.decimals = decimals;
  }

  /**
   * Converts raw string slice from file to a float number.
   *
   * @param {string} slice - Raw fixed-width digit string slice.
   * @returns {number} Parsed decimal float value.
   * @throws {Error} If slice cannot be converted to a positive decimal.
   */
  toValue(slice) {
    try {
      const intVal = super.toValue(slice);
      return intVal / Math.pow(10, this.decimals);
    } catch (err) {
      throw new Error(`Informe uma string para converter corretamente, '${slice}' não é um 'positive decimal'`);
    }
  }

  /**
   * Serializes a decimal float number into a zero-padded fixed-width string.
   *
   * @param {number|null} value - Decimal float number. Null/undefined serializes to zeros.
   * @returns {string} Zero-padded fixed-width string representation.
   * @throws {Error} If value is not a non-negative number.
   */
  toStr(value) {
    if (value === null || value === undefined) {
      return '0'.repeat(this.size);
    }
    if (typeof value !== 'number' || value < 0) {
      throw new Error(`O campo '${this.name}' só aceita 'positive decimal' ou 'None'`);
    }
    const intVal = Math.round(value * Math.pow(10, this.decimals));
    const formatted = String(intVal).padStart(this.size, '0');
    return this.validateToStrSize(formatted);
  }
}
