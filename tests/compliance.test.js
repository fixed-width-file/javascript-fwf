import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CharColumn,
  RightCharColumn,
  PositiveIntegerColumn,
  PositiveDecimalColumn,
  DateColumn,
  TimeColumn,
  DateTimeColumn,
  HeaderRowDescriptor,
  DetailRowDescriptor,
  FooterRowDescriptor,
  FileDescriptor,
  Reader,
} from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findComplianceDir() {
  const localPath = path.resolve(__dirname, '../fwf-compliance-tests');
  const siblingPath = path.resolve(__dirname, '../../fwf-compliance-tests');

  if (fs.existsSync(path.join(localPath, 'manifest.json'))) {
    return localPath;
  }
  if (fs.existsSync(path.join(siblingPath, 'manifest.json'))) {
    return siblingPath;
  }
  return null;
}

function buildColumn(colDef) {
  const cType = colDef.type || 'char';
  const name = colDef.name || '';
  const desc = colDef.description || name;
  const size = colDef.size || 0;

  switch (cType) {
    case 'char':
      return new CharColumn(name, size, desc);
    case 'right_char':
      return new RightCharColumn(name, size, desc);
    case 'positive_integer':
      return new PositiveIntegerColumn(name, size, desc);
    case 'positive_decimal':
      return new PositiveDecimalColumn(name, size, colDef.decimals ?? 2, desc);
    case 'date':
      return new DateColumn(name, colDef.format || '%d%m%Y', desc);
    case 'time':
      return new TimeColumn(name, colDef.format || '%H%M', desc);
    case 'datetime':
      return new DateTimeColumn(name, colDef.format || '%d%m%Y%H%M', desc);
    default:
      throw new Error(`Unknown column type: ${cType}`);
  }
}

function buildFileDescriptor(data) {
  let header = null;
  if (data.header && data.header.columns) {
    const cols = data.header.columns.map(buildColumn);
    header = new HeaderRowDescriptor(cols);
  }

  let footer = null;
  if (data.footer && data.footer.columns) {
    const cols = data.footer.columns.map(buildColumn);
    footer = new FooterRowDescriptor(cols);
  }

  const details = (data.details || []).map((d) => {
    const cols = d.columns.map(buildColumn);
    return new DetailRowDescriptor(cols);
  });

  return new FileDescriptor(details, header, footer);
}

function formatValueForComparison(val, expectedVal) {
  if (val instanceof Date && !isNaN(val.getTime())) {
    const expStr = String(expectedVal);
    const y = String(val.getUTCFullYear()).padStart(4, '0');
    const m = String(val.getUTCMonth() + 1).padStart(2, '0');
    const d = String(val.getUTCDate()).padStart(2, '0');
    const H = String(val.getUTCHours()).padStart(2, '0');
    const M = String(val.getUTCMinutes()).padStart(2, '0');
    const S = String(val.getUTCSeconds()).padStart(2, '0');

    if (expStr.length === 10 && expStr.includes('-')) {
      return `${y}-${m}-${d}`;
    }
    if (expStr.includes('T')) {
      return `${y}-${m}-${d}T${H}:${M}:${S}`;
    }
    if (expStr.length === 8 && expStr.includes(':')) {
      return `${H}:${M}:${S}`;
    }
    return `${y}-${m}-${d} ${H}:${M}:${S}`;
  }
  return val;
}

describe('Compliance Test Suite (fwf-compliance-tests v1.0.0)', () => {
  const complianceDir = findComplianceDir();

  if (!complianceDir) {
    it.skip('fwf-compliance-tests repository not found', () => {});
    return;
  }

  const manifestJson = fs.readFileSync(path.join(complianceDir, 'manifest.json'), 'utf-8');
  const manifest = JSON.parse(manifestJson);

  manifest.cases.forEach((caseRef) => {
    const caseId = caseRef.id;
    it(`runs compliance case: ${caseId}`, () => {
      const casePath = path.join(complianceDir, 'cases', caseId);

      const descJson = fs.readFileSync(path.join(casePath, 'descriptor.json'), 'utf-8');
      const descData = JSON.parse(descJson);
      const fileDescriptor = buildFileDescriptor(descData);

      const inputContent = fs.readFileSync(path.join(casePath, 'input.fwf'), 'utf-8');
      const expectedJson = fs.readFileSync(path.join(casePath, 'expected.json'), 'utf-8');
      const expectedData = JSON.parse(expectedJson);

      const reader = new Reader(inputContent, fileDescriptor, '\n');
      const parsedRows = Array.from(reader);

      expect(parsedRows.length).toBe(expectedData.length);

      expectedData.forEach((expectedRow, idx) => {
        Object.keys(expectedRow).forEach((colName) => {
          const expectedVal = expectedRow[colName];
          const actualRaw = parsedRows[idx][colName];
          const actualVal = formatValueForComparison(actualRaw, expectedVal);

          if (typeof expectedVal === 'number' && !Number.isInteger(expectedVal)) {
            expect(actualVal).toBeCloseTo(expectedVal, 4);
          } else {
            expect(actualVal).toEqual(expectedVal);
          }
        });
      });
    });
  });
});
