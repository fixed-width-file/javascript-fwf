/**
 * Base abstract class for fixed-width file columns.
 */
export class AbstractColumn {
  /**
   * @param {string} name
   * @param {number} size
   * @param {string} [description]
   */
  constructor(name, size, description = null) {
    if (typeof name !== 'string') {
      throw new TypeError('O campo name deve ser uma string');
    }
    if (!name || !name.trim()) {
      throw new Error('O campo column_name deve ser uma string válida e não branca');
    }
    if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
      throw new Error('O campo size deve ser maior que 0');
    }

    this.name = name;
    this.size = size;
    this.description = description === null || description === undefined ? name : description;
    this.start = null;
  }

  get end() {
    if (this.start === null || this.start === undefined) {
      throw new TypeError('O campo start deve ser um inteiro');
    }
    if (this.start <= 0) {
      throw new Error('O campo start deve ser maior que 0');
    }
    return this.start + this.size - 1;
  }

  /**
   * Converts raw string slice from file to column typed value.
   * @param {string} slice
   * @returns {any}
   */
  toValue(slice) {
    if (typeof slice !== 'string') {
      throw new Error('Informe uma string para converter corretamente');
    }
    if (slice.length !== this.size) {
      throw new Error(`A string deve ter exatamente o tamanho do campo '${this.name}' (${this.size})`);
    }
    return slice;
  }

  /**
   * Validates that formatted string matches column size.
   * @param {string} value
   * @returns {string}
   */
  validateToStrSize(value) {
    if (value.length !== this.size) {
      throw new Error(`O valor a ser serializado para o campo '${this.name}' não pode ser diferente de ${this.size} `);
    }
    return value;
  }

  /**
   * Serializes value to string representation.
   * @param {any} value
   * @returns {string}
   */
  toStr(value) {
    throw new Error('toStr method must be implemented');
  }
}
