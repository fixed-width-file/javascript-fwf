import { AbstractColumn } from './AbstractColumn.js';

/**
 * Positive integer column with leading zeros.
 */
export class PositiveIntegerColumn extends AbstractColumn {
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
