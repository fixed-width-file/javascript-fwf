/**
 * Base abstract class for all fixed-width file columns.
 * Defines common properties (name, size, description, start/end position) and validation methods.
 *
 * @abstract
 */
export class AbstractColumn {
  /**
   * Creates an instance of AbstractColumn.
   *
   * @param {string} name - Unique identifier/name of the column.
   * @param {number} size - Positional size (character width) of the column, must be > 0.
   * @param {string|null} [description=null] - Description of the column. Defaults to name if omitted.
   * @throws {TypeError} If name is not a string.
   * @throws {Error} If name is blank or size is not an integer > 0.
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

    /**
     * Name of the column.
     * @type {string}
     */
    this.name = name;

    /**
     * Character width of the column.
     * @type {number}
     */
    this.size = size;

    /**
     * Description of the column.
     * @type {string}
     */
    this.description = description === null || description === undefined ? name : description;

    /**
     * 1-indexed start position of the column within a row line.
     * @type {number|null}
     */
    this.start = null;
  }

  /**
   * 1-indexed end position of the column within a row line.
   *
   * @type {number}
   * @throws {TypeError} If start position is not set.
   * @throws {Error} If start position is <= 0.
   */
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
   * Converts a raw string slice extracted from a fixed-width row line into a typed value.
   *
   * @param {string} slice - The exact substring matching the column size.
   * @returns {*} The parsed value.
   * @throws {Error} If slice is not a string or slice length does not match column size.
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
   * Validates that a formatted string representation matches the required column size.
   *
   * @param {string} value - The formatted string to validate.
   * @returns {string} The validated string.
   * @throws {Error} If formatted string length does not equal column size.
   */
  validateToStrSize(value) {
    if (value.length !== this.size) {
      throw new Error(`O valor a ser serializado para o campo '${this.name}' não pode ser diferente de ${this.size} `);
    }
    return value;
  }

  /**
   * Serializes a JavaScript typed value into a fixed-width string representation.
   *
   * @abstract
   * @param {*} value - Value to serialize.
   * @returns {string} Fixed-width formatted string.
   * @throws {Error} If not implemented by concrete column subclass.
   */
  toStr(value) {
    throw new Error('toStr method must be implemented');
  }
}
