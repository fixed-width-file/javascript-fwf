import { AbstractColumn } from './AbstractColumn.js';

/**
 * Right-aligned, space-padded character column.
 */
export class RightCharColumn extends AbstractColumn {
  toValue(slice) {
    const base = super.toValue(slice);
    return base.trim();
  }

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
