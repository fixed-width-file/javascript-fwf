import { DetailRowDescriptor } from './RowDescriptors.js';

/**
 * Descriptor representing the overall layout structure of a Fixed Width File (FWF).
 * Contains row descriptors for details, optional header, and optional footer.
 *
 * @example
 * const detail = new DetailRowDescriptor([new CharColumn('name', 20)]);
 * const fileDesc = new FileDescriptor([detail]);
 */
export class FileDescriptor {
  /**
   * Creates an instance of FileDescriptor.
   *
   * @param {DetailRowDescriptor[]} details - Array of detail row descriptors.
   * @param {HeaderRowDescriptor|null} [header=null] - Optional header row descriptor.
   * @param {FooterRowDescriptor|null} [footer=null] - Optional footer row descriptor.
   * @throws {TypeError} If details is not an Array or elements are not DetailRowDescriptor.
   * @throws {Error} If details array is empty or row line sizes do not match.
   */
  constructor(details, header = null, footer = null) {
    if (!Array.isArray(details)) {
      throw new TypeError('details deve ser uma List');
    }
    if (details.length === 0) {
      throw new Error('details deve ter ao menos 1 elemento');
    }

    for (const d of details) {
      if (!(d instanceof DetailRowDescriptor)) {
        throw new TypeError('Todos os elementos de details devem ser instâncias de DetailRowDescriptor');
      }
    }

    /**
     * Array of detail row descriptors.
     * @type {DetailRowDescriptor[]}
     */
    this.details = details;

    /**
     * Optional header row descriptor.
     * @type {HeaderRowDescriptor|null}
     */
    this.header = header;

    /**
     * Optional footer row descriptor.
     * @type {FooterRowDescriptor|null}
     */
    this.footer = footer;

    this.validateLineSizes();
  }

  /**
   * Expected total line size width in characters across all row descriptors.
   *
   * @type {number}
   */
  get lineSize() {
    return this.details[0].lineSize;
  }

  /**
   * Validates that all row descriptors (details, header, and footer) have matching line sizes.
   *
   * @throws {Error} If line sizes differ across row descriptors.
   */
  validateLineSizes() {
    const expectedSize = this.details[0].lineSize;

    for (const detail of this.details) {
      if (detail.lineSize !== expectedSize) {
        throw new Error('Todos os DetailRowDescriptor devem ter o mesmo lineSize');
      }
    }

    if (this.header && this.header.lineSize !== expectedSize) {
      throw new Error(
        `O lineSize do HeaderRowDescriptor (${this.header.lineSize}) é diferente do lineSize dos DetailRowDescriptor (${expectedSize})`
      );
    }

    if (this.footer && this.footer.lineSize !== expectedSize) {
      throw new Error(
        `O lineSize do FooterRowDescriptor (${this.footer.lineSize}) é diferente do lineSize dos DetailRowDescriptor (${expectedSize})`
      );
    }
  }
}
