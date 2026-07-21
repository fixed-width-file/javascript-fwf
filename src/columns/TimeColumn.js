import { DateTimeColumn } from './DateTimeColumn.js';

/**
 * Time column supporting custom formatting (default "%H%M") and null/zero-padding.
 * Parses raw time strings into UTC Date objects.
 *
 * @extends DateTimeColumn
 * @example
 * const col = new TimeColumn('opening_time', '%H%M', 'Opening Time');
 * col.toValue('1430'); // Date object (UTC: 2000-01-01T14:30:00.000Z)
 */
export class TimeColumn extends DateTimeColumn {
  /**
   * Creates an instance of TimeColumn.
   *
   * @param {string} name - Column name.
   * @param {string} [format="%H%M"] - Time format pattern.
   * @param {string|null} [description=null] - Column description.
   */
  constructor(name, format = '%H%M', description = null) {
    super(name, format, description, 2);
    this.assertionType = 'time';
  }
}
