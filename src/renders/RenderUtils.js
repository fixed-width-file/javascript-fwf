import { FileDescriptor } from '../descriptors/FileDescriptor.js';

/**
 * Utility class for exporting layout specifications (FileDescriptor) to various documentation formats.
 * Supports Markdown, ReStructuredText (RST), and HTML table formats.
 */
export class RenderUtils {
  /**
   * Renders a FileDescriptor layout specification as a Markdown formatted document string.
   *
   * @param {FileDescriptor} fileDescriptor - Layout descriptor to export.
   * @returns {string} Formatted Markdown text.
   * @throws {TypeError} If fileDescriptor is not an instance of FileDescriptor.
   */
  static renderAsMarkdown(fileDescriptor) {
    if (!(fileDescriptor instanceof FileDescriptor)) {
      throw new TypeError('fileDescriptor deve ser uma instância de FileDescriptor');
    }

    let out = '# Description\n\n';

    function renderTable(title, cols, trailing = true) {
      const maxColNameSize = Math.max(6, ...cols.map((c) => c.name.length));
      const maxColTypeSize = Math.max(4, ...cols.map((c) => c.constructor.name.length));

      out += `## ${title}\n\n`;
      out += `|    # | ${'Column'.padEnd(maxColNameSize)} | Size | Start |  End | ${'Type'.padEnd(maxColTypeSize)} | Description\n`;
      out += `| ---- | ${'-'.repeat(maxColNameSize)} | ---- | ----- | ---- | ${'-'.repeat(maxColTypeSize)} | -----------\n`;

      cols.forEach((col, idx) => {
        const line = String(idx + 1).padStart(4);
        const name = col.name.padEnd(maxColNameSize);
        const size = String(col.size).padStart(4);
        const start = String(col.start).padStart(5);
        const end = String(col.end).padStart(4);
        const type = col.constructor.name.padEnd(maxColTypeSize);
        out += `| ${line} | ${name} | ${size} | ${start} | ${end} | ${type} | ${col.description}\n`;
      });

      if (trailing) {
        out += '\n';
      }
    }

    if (fileDescriptor.header) {
      renderTable('HEADER', fileDescriptor.header.columns);
    }

    fileDescriptor.details.forEach((detail, i) => {
      renderTable(`DETAILS ${i + 1}`, detail.columns);
    });

    if (fileDescriptor.footer) {
      renderTable('FOOTER', fileDescriptor.footer.columns, false);
    }

    return out;
  }

  /**
   * Renders a FileDescriptor layout specification as a ReStructuredText (RST) formatted document string.
   *
   * @param {FileDescriptor} fileDescriptor - Layout descriptor to export.
   * @returns {string} Formatted ReStructuredText text.
   * @throws {TypeError} If fileDescriptor is not an instance of FileDescriptor.
   */
  static renderAsRst(fileDescriptor) {
    if (!(fileDescriptor instanceof FileDescriptor)) {
      throw new TypeError('fileDescriptor deve ser uma instância de FileDescriptor');
    }

    let out = 'File Description\n===============\n\n';

    function renderTable(title, cols, trailing = true) {
      const headers = ['#', 'Column', 'Size', 'Start', 'End', 'Type', 'Description'];
      const rows = cols.map((col, idx) => [
        String(idx + 1),
        col.name,
        String(col.size),
        String(col.start),
        String(col.end),
        col.constructor.name,
        col.description,
      ]);
      const allRows = [headers, ...rows];
      const colWidths = headers.map((_, i) => Math.max(...allRows.map((r) => r[i].length)));

      const sep = () => colWidths.map((w) => '='.repeat(w)).join(' ') + '\n';

      out += `${title}\n--------------------\n\n`;
      out += sep();
      out += headers.map((h, i) => h.padEnd(colWidths[i])).join(' ') + '\n';
      out += sep();
      rows.forEach((r) => {
        out += r.map((cell, i) => cell.padEnd(colWidths[i])).join(' ') + '\n';
      });
      out += sep();
      if (trailing) {
        out += '\n';
      }
    }

    if (fileDescriptor.header) {
      renderTable('HEADER', fileDescriptor.header.columns);
    }

    fileDescriptor.details.forEach((detail, i) => {
      renderTable(`DETAILS ${i + 1}`, detail.columns);
    });

    if (fileDescriptor.footer) {
      renderTable('FOOTER', fileDescriptor.footer.columns, false);
    }

    return out;
  }

  /**
   * Renders a FileDescriptor layout specification as an HTML table document string.
   *
   * @param {FileDescriptor} fileDescriptor - Layout descriptor to export.
   * @returns {string} Formatted HTML text.
   * @throws {TypeError} If fileDescriptor is not an instance of FileDescriptor.
   */
  static renderAsHtml(fileDescriptor) {
    if (!(fileDescriptor instanceof FileDescriptor)) {
      throw new TypeError('fileDescriptor deve ser uma instância de FileDescriptor');
    }

    let out = '<h1>Description</h1>\n';

    function renderTable(title, cols, trailing = true) {
      out += `<h2>${title}</h2>\n`;
      out += '<table border="1">\n';
      out += '<tr><th>#</th><th>Column</th><th>Size</th><th>Start</th><th>End</th><th>Type</th><th>Description</th></tr>\n';

      cols.forEach((col, idx) => {
        out +=
          '<tr>' +
          `<td>${idx + 1}</td>` +
          `<td>${col.name}</td>` +
          `<td>${col.size}</td>` +
          `<td>${col.start}</td>` +
          `<td>${col.end}</td>` +
          `<td>${col.constructor.name}</td>` +
          `<td>${col.description}</td>` +
          '</tr>\n';
      });

      out += '</table>\n';
      if (trailing) {
        out += '<br/>\n';
      }
    }

    if (fileDescriptor.header) {
      renderTable('HEADER', fileDescriptor.header.columns);
    }

    fileDescriptor.details.forEach((detail, i) => {
      renderTable(`DETAILS ${i + 1}`, detail.columns);
    });

    if (fileDescriptor.footer) {
      renderTable('FOOTER', fileDescriptor.footer.columns, false);
    }

    return out;
  }
}
