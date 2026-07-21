import { AbstractColumn } from './AbstractColumn.js';

/**
 * Formats a Date object using a Python-style strftime specifier string (%d, %m, %Y, %H, %M, %S).
 *
 * @param {Date} dateObj - The UTC Date object to format.
 * @param {string} formatStr - Format pattern (e.g. "%d%m%Y%H%M%S").
 * @returns {string} Formatted date/time string.
 */
export function formatPythonDate(dateObj, formatStr) {
  const d = String(dateObj.getUTCDate()).padStart(2, '0');
  const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const Y = String(dateObj.getUTCFullYear()).padStart(4, '0');
  const H = String(dateObj.getUTCHours()).padStart(2, '0');
  const M = String(dateObj.getUTCMinutes()).padStart(2, '0');
  const S = String(dateObj.getUTCSeconds()).padStart(2, '0');

  return formatStr
    .replace(/%d/g, d)
    .replace(/%m/g, m)
    .replace(/%Y/g, Y)
    .replace(/%H/g, H)
    .replace(/%M/g, M)
    .replace(/%S/g, S);
}

/**
 * Parses a string formatted according to a Python-style strptime format pattern into a UTC Date object.
 *
 * @param {string} str - Raw date/time string.
 * @param {string} formatStr - Format pattern (e.g. "%d%m%Y%H%M").
 * @returns {Date|null} Parsed UTC Date object or null if parsing fails/invalid date.
 */
export function parsePythonDate(str, formatStr) {
  let regexStr = '^';
  const groupOrder = [];
  let i = 0;
  while (i < formatStr.length) {
    if (formatStr[i] === '%') {
      const spec = formatStr[i + 1];
      if (spec === 'd' || spec === 'm' || spec === 'H' || spec === 'M' || spec === 'S') {
        regexStr += '(\\d{2})';
        groupOrder.push(spec);
      } else if (spec === 'Y') {
        regexStr += '(\\d{4})';
        groupOrder.push('Y');
      } else {
        regexStr += '\\' + spec;
      }
      i += 2;
    } else {
      regexStr += formatStr[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      i++;
    }
  }
  regexStr += '$';

  const match = str.match(new RegExp(regexStr));
  if (!match) return null;

  let year = 2000;
  let month = 1;
  let day = 1;
  let hour = 0;
  let min = 0;
  let sec = 0;

  for (let g = 0; g < groupOrder.length; g++) {
    const val = parseInt(match[g + 1], 10);
    const spec = groupOrder[g];
    if (spec === 'Y') year = val;
    if (spec === 'm') month = val;
    if (spec === 'd') day = val;
    if (spec === 'H') hour = val;
    if (spec === 'M') min = val;
    if (spec === 'S') sec = val;
  }

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (hour < 0 || hour > 23) return null;
  if (min < 0 || min > 59) return null;
  if (sec < 0 || sec > 59) return null;

  const res = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
  if (isNaN(res.getTime())) return null;
  return res;
}

/**
 * DateTime column supporting custom date-time formatting (%d, %m, %Y, %H, %M, %S) and null/zero-padding.
 * Parses raw fixed-width date-time strings to UTC Date objects and vice versa.
 *
 * @extends AbstractColumn
 * @example
 * const col = new DateTimeColumn('created_at', '%d%m%Y%H%M', 'Creation Timestamp');
 * col.toValue('210720261640'); // Date object (UTC: 2026-07-21T16:40:00.000Z)
 */
export class DateTimeColumn extends AbstractColumn {
  /**
   * Creates an instance of DateTimeColumn.
   *
   * @param {string} name - Column name.
   * @param {string} [format="%d%m%Y%H%M"] - Date format string using Python strftime patterns.
   * @param {string|null} [description=null] - Column description.
   * @param {number} [requiredFormatNumElements=5] - Number of format specifiers required.
   * @throws {TypeError} If name or format is not a string.
   * @throws {Error} If name or format is blank, or format specifier count does not match requirement.
   */
  constructor(name, format = '%d%m%Y%H%M', description = null, requiredFormatNumElements = 5) {
    if (typeof name !== 'string') {
      throw new TypeError('O campo name deve ser uma string');
    }
    if (!name || !name.trim()) {
      throw new Error('O campo column_name deve ser uma string válida e não branca');
    }
    if (typeof format !== 'string') {
      throw new TypeError(`O argumento '_format' do campo '${name}' deve ser uma string`);
    }
    if (!format || !format.trim()) {
      throw new Error(`O argumento '_format' do campo '${name}' deve ser uma string válida e não branca`);
    }

    const matches = format.match(/%[a-zA-Z]/g) || [];
    if (matches.length !== requiredFormatNumElements) {
      throw new Error(`O argumento '_format' (${format}) do campo '${name}' deve ter um formato de data/hora válido`);
    }

    const sampleDate = new Date(Date.UTC(2001, 11, 31, 13, 59, 0));
    const size = formatPythonDate(sampleDate, format).length;

    super(name, size, description);

    /**
     * Date format pattern.
     * @type {string}
     */
    this.format = format;

    /**
     * Expected specifier count.
     * @type {number}
     */
    this.requiredFormatNumElements = requiredFormatNumElements;

    /**
     * Type descriptor for error assertions.
     * @type {string}
     */
    this.assertionType = 'datetime';
  }

  /**
   * Converts raw string slice from file into a UTC Date object.
   *
   * @param {string} slice - Raw fixed-width date-time string.
   * @returns {Date|null} Parsed Date object or null if zero-filled string.
   * @throws {Error} If slice does not match date-time format.
   */
  toValue(slice) {
    super.toValue(slice);
    if (slice === '0'.repeat(this.size)) {
      return null;
    }
    const parsed = parsePythonDate(slice, this.format);
    if (!parsed) {
      throw new Error(`O valor '${slice}' do campo '${this.name}' é inválido para o formato '${this.format}'`);
    }
    return parsed;
  }

  /**
   * Serializes a Date object into a formatted fixed-width string.
   *
   * @param {Date|null} value - Date object to format. Null/undefined serializes to zero string.
   * @returns {string} Formatted fixed-width string.
   * @throws {TypeError} If value is not a valid Date instance.
   */
  toStr(value) {
    if (value === null || value === undefined) {
      return '0'.repeat(this.size);
    }
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new TypeError(`O campo '${this.name}' só aceita '${this.assertionType}' ou 'None'`);
    }
    const formatted = formatPythonDate(value, this.format);
    return this.validateToStrSize(formatted);
  }
}
