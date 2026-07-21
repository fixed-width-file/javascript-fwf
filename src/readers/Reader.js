import { FileDescriptor } from '../descriptors/FileDescriptor.js';

/**
 * Sequential reader for Fixed Width Files.
 */
export class Reader {
  /**
   * @param {string | string[] | Iterable<string>} iterable
   * @param {FileDescriptor} fileDescriptor
   * @param {string} [newline="\n"]
   */
  constructor(iterable, fileDescriptor, newline = '\n') {
    if (!(fileDescriptor instanceof FileDescriptor)) {
      throw new TypeError('fileDescriptor deve ser uma instância de FileDescriptor');
    }

    this.fileDescriptor = fileDescriptor;
    this.newline = newline;
    this.lines = [];
    this.lineNum = 0;

    this.lines = this.extractLines(iterable);
    this.validateAndNormalizeLines();
    this.linesCount = this.lines.length;
  }

  extractLines(iterable) {
    if (typeof iterable === 'string') {
      const normalized = iterable.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const rawLines = normalized.split('\n');
      if (rawLines.length > 0 && rawLines[rawLines.length - 1] === '') {
        rawLines.pop();
      }
      return rawLines;
    }

    if (Array.isArray(iterable)) {
      return iterable.map((l) => (l.endsWith('\n') || l.endsWith('\r') ? l.replace(/[\r\n]+$/, '') : l));
    }

    if (iterable && typeof iterable[Symbol.iterator] === 'function') {
      return Array.from(iterable).map((l) => (typeof l === 'string' ? l.replace(/[\r\n]+$/, '') : l));
    }

    throw new TypeError('Unsupported Iterable');
  }

  validateAndNormalizeLines() {
    const expectedSize = this.fileDescriptor.lineSize;
    for (let i = 0; i < this.lines.length; i++) {
      let line = this.lines[i];
      if (line.length > expectedSize) {
        throw new Error(`A linha ${i + 1} possui tamanho ${line.length} diferente do esperado ${expectedSize}`);
      }
      if (line.length < expectedSize) {
        this.lines[i] = line.padEnd(expectedSize, ' ');
      }
    }
  }

  *[Symbol.iterator]() {
    this.lineNum = 0;
    const totalLines = this.lines.length;

    for (let i = 0; i < totalLines; i++) {
      this.lineNum = i + 1;
      const line = this.lines[i];

      if (i === 0 && this.fileDescriptor.header) {
        yield this.fileDescriptor.header.getValues(line);
      } else if (i === totalLines - 1 && this.fileDescriptor.footer) {
        yield this.fileDescriptor.footer.getValues(line);
      } else {
        yield this.fileDescriptor.details[0].getValues(line);
      }
    }
  }
}
