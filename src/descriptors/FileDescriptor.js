import { DetailRowDescriptor } from './RowDescriptors.js';

/**
 * Descriptor representing the layout structure of a Fixed Width File.
 */
export class FileDescriptor {
  /**
   * @param {DetailRowDescriptor[]} details
   * @param {HeaderRowDescriptor} [header=null]
   * @param {FooterRowDescriptor} [footer=null]
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

    this.details = details;
    this.header = header;
    this.footer = footer;

    this.validateLineSizes();
  }

  get lineSize() {
    return this.details[0].lineSize;
  }

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
