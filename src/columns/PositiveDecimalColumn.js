import { PositiveIntegerColumn } from './PositiveIntegerColumn.js';

/**
 * Positive decimal column with fixed decimal places and leading zeros.
 */
export class PositiveDecimalColumn extends PositiveIntegerColumn {
  /**
   * @param {string} name
   * @param {number} size
   * @param {number} [decimals=2]
   * @param {string} [description]
   */
  constructor(name, size, decimals = 2, description = null) {
    super(name, size, description);
    if (typeof decimals !== 'number' || decimals <= 0) {
      throw new Error('Os decimais devem ser maior que 0');
    }
    if (size <= decimals) {
      throw new Error('Os decimais devem ser menores que o size');
    }
    this.decimals = decimals;
  }

  toValue(slice) {
    try {
      const intVal = super.toValue(slice);
      return intVal / Math.pow(10, this.decimals);
    } catch (err) {
      throw new Error(`Informe uma string para converter corretamente, '${slice}' não é um 'positive decimal'`);
    }
  }

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
