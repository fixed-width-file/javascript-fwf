import { RowDescriptor } from './RowDescriptor.js';

/**
 * Descriptor representing a header row structure in a Fixed Width File.
 *
 * @extends RowDescriptor
 */
export class HeaderRowDescriptor extends RowDescriptor {}

/**
 * Descriptor representing a detail (data) row structure in a Fixed Width File.
 *
 * @extends RowDescriptor
 */
export class DetailRowDescriptor extends RowDescriptor {}

/**
 * Descriptor representing a footer row structure in a Fixed Width File.
 *
 * @extends RowDescriptor
 */
export class FooterRowDescriptor extends RowDescriptor {}
