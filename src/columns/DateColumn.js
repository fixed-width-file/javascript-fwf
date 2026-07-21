import { DateTimeColumn } from './DateTimeColumn.js';

/**
 * Date column supporting custom formatting and null-padding.
 */
export class DateColumn extends DateTimeColumn {
  /**
   * @param {string} name
   * @param {string} [format="%d%m%Y"]
   * @param {string} [description]
   */
  constructor(name, format = '%d%m%Y', description = null) {
    super(name, format, description, 3);
    this.assertionType = 'date';
  }
}
