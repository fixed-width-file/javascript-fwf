import { DateTimeColumn } from './DateTimeColumn.js';

/**
 * Date column supporting custom formatting (default "%d%m%Y") and null/zero-padding.
 * Parses raw date strings into UTC Date objects.
 *
 * @extends DateTimeColumn
 * @example
 * const col = new DateColumn('birth_date', '%d%m%Y', 'Birth Date');
 * col.toValue('21072026'); // Date object (UTC: 2026-07-21T00:00:00.000Z)
 */
export class DateColumn extends DateTimeColumn {
  /**
   * Creates an instance of DateColumn.
   *
   * @param {string} name - Column name.
   * @param {string} [format="%d%m%Y"] - Date format pattern.
   * @param {string|null} [description=null] - Column description.
   */
  constructor(name, format = '%d%m%Y', description = null) {
    super(name, format, description, 3);
    this.assertionType = 'date';
  }
}
