import { DateTimeColumn } from './DateTimeColumn.js';

/**
 * Time column supporting custom formatting and null-padding.
 */
export class TimeColumn extends DateTimeColumn {
  /**
   * @param {string} name
   * @param {string} [format="%H%M"]
   * @param {string} [description]
   */
  constructor(name, format = '%H%M', description = null) {
    super(name, format, description, 2);
    this.assertionType = 'time';
  }
}
