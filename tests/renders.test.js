import { describe, it, expect } from 'vitest';
import {
  CharColumn,
  PositiveIntegerColumn,
  HeaderRowDescriptor,
  DetailRowDescriptor,
  FooterRowDescriptor,
  FileDescriptor,
  RenderUtils,
} from '../src/index.js';

describe('RenderUtils', () => {
  it('renders Markdown, RST, and HTML tables with Header and Footer', () => {
    expect(() => RenderUtils.renderAsMarkdown(null)).toThrow(TypeError);
    expect(() => RenderUtils.renderAsRst(null)).toThrow(TypeError);
    expect(() => RenderUtils.renderAsHtml(null)).toThrow(TypeError);

    const c1 = new CharColumn('name', 10, 'Name description');
    const c2 = new PositiveIntegerColumn('age', 3, 'Age description');

    const header = new HeaderRowDescriptor([c1, c2]);
    const detail = new DetailRowDescriptor([c1, c2]);
    const footer = new FooterRowDescriptor([c1, c2]);

    const fd = new FileDescriptor([detail], header, footer);

    const md = RenderUtils.renderAsMarkdown(fd);
    expect(md).toContain('# Description');
    expect(md).toContain('## HEADER');
    expect(md).toContain('## DETAILS 1');
    expect(md).toContain('## FOOTER');
    expect(md).toContain('CharColumn');

    const rst = RenderUtils.renderAsRst(fd);
    expect(rst).toContain('File Description');
    expect(rst).toContain('HEADER');
    expect(rst).toContain('DETAILS 1');
    expect(rst).toContain('FOOTER');

    const html = RenderUtils.renderAsHtml(fd);
    expect(html).toContain('<h1>Description</h1>');
    expect(html).toContain('<h2>HEADER</h2>');
    expect(html).toContain('<h2>DETAILS 1</h2>');
    expect(html).toContain('<h2>FOOTER</h2>');
    expect(html).toContain('<table border="1">');
  });
});
