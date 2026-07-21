import { FileDescriptor } from '../descriptors/FileDescriptor.js';

/**
 * Sequential reader and iterator for Fixed Width Files.
 * Parses raw file content line-by-line according to a FileDescriptor specification.
 *
 * @example
 * const reader = new Reader(fwfContent, fileDescriptor);
 * for (const row of reader) {
 *   console.log(row);
 * }
 */
export class Reader {
  /**
   * Creates an instance of Reader.
   *
   * @param {string | string[] | Iterable<string>} iterable - Content as a string, line array, or string iterable.
   * @param {FileDescriptor} fileDescriptor - Layout specification for the file.
   * @param {string} [newline="\n"] - Line separator sequence.
   * @throws {TypeError} If fileDescriptor is not a FileDescriptor instance or iterable is invalid.
   */
  constructor(iterable, fileDescriptor, newline = '\n') {
    if (!(fileDescriptor instanceof FileDescriptor)) {
      throw new TypeError('fileDescriptor deve ser uma instância de FileDescriptor');
    }

    /**
     * Layout descriptor for the file.
     * @type {FileDescriptor}
     */
    this.fileDescriptor = fileDescriptor;

    /**
     * Line separator character.
     * @type {string}
     */
    this.newline = newline;

    /**
     * Current line number index during iteration (1-based).
     * @type {number}
     */
    this.lineNum = 0;

    /**
     * Array of extracted and normalized raw line strings.
     * @type {string[]}
     */
    this.lines = this.extractLines(iterable);

    this.validateAndNormalizeLines();

    /**
     * Total number of lines in the file.
     * @type {number}
     */
    this.linesCount = this.lines.length;
  }

  /**
   * Normalizes and splits various input types into an array of string lines.
   *
   * @param {string | string[] | Iterable<string>} iterable - Input content.
   * @returns {string[]} Array of lines.
   * @throws {TypeError} If input type is not supported.
   */
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

  /**
   * Validates line lengths against expected file line size and pads trailing spaces if needed.
   *
   * @throws {Error} If line length exceeds expected file line size.
   */
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

  /**
   * Iterator generator producing parsed row objects sequentially.
   *
   * @yields {Record<string, *>} Parsed row values object for each line.
   */
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
