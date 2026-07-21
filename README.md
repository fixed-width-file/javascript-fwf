<!-- markdownlint-disable MD013 -->
# javascript-fwf

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-blue?logo=nodedotjs)](https://nodejs.org/)
[![FWF Compliance](https://img.shields.io/badge/FWF_Compliance-5%2F5_cases_passed-brightgreen?logo=github)](https://github.com/fixed-width-file/fwf-compliance-tests)
[![QA](https://github.com/fixed-width-file/javascript-fwf/actions/workflows/qa.yml/badge.svg)](https://github.com/fixed-width-file/javascript-fwf/actions/workflows/qa.yml)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)

**javascript-fwf** is a fast, type-safe JavaScript / ES Module library for parsing, validating, and exporting **Fixed Width Files (FWF)**.

It is part of the [Fixed Width File Ecosystem](https://fixed-width-file.github.io/) and fully implements the **[fwf-compliance-tests v1.0.0](https://github.com/fixed-width-file/fwf-compliance-tests)** specification.

---

## 🌟 Key Features

- **Type-Safe Columns**: `CharColumn`, `RightCharColumn`, `PositiveIntegerColumn`, `PositiveDecimalColumn`, `DateColumn`, `TimeColumn`, and `DateTimeColumn`.
- **Flexible Descriptors**: Structured records with `HeaderRowDescriptor`, `DetailRowDescriptor`, and `FooterRowDescriptor`.
- **Multiple Output Renders**: Export layout specifications to Markdown, ReStructuredText (RST), or HTML tables via `RenderUtils`.
- **Full Test Suite & Compliance**: 100% compliant with `fwf-compliance-tests` v1.0.0.
- **Git Hooks Ready**: Pre-configured `pre-commit` and `pre-push` hooks.

---

## 🚀 Installation

Install via `npm`:

```bash
npm install @fixed-width-file/javascript-fwf
```

---

## 💡 Quickstart

```js
import {
  CharColumn,
  PositiveIntegerColumn,
  DetailRowDescriptor,
  FileDescriptor,
  Reader
} from '@fixed-width-file/javascript-fwf';

// 1. Define columns
const nameCol = new CharColumn('name', 20, 'User Name');
const ageCol = new PositiveIntegerColumn('age', 3, 'Age in years');

// 2. Define row and file descriptors
const detail = new DetailRowDescriptor([nameCol, ageCol]);
const fileDescriptor = new FileDescriptor([detail]);

// 3. Read fixed-width file content
const content = "KELSON MEDEIROS     045\nMARIA SILVA         030\n";
const reader = new Reader(content, fileDescriptor, "\n");

for (const row of reader) {
  console.log(`Name: ${row.name} | Age: ${row.age}`);
}
```

---

## 🧪 Testing & Compliance

Run unit tests using Vitest:

```bash
npm test
```

Run test coverage:

```bash
npm run test:coverage
```

---

## ⚓ Pre-Commit & Pre-Push Setup

Set up pre-commit and pre-push hooks:

```bash
pre-commit install
pre-commit install --hook-type pre-push
```

Run checks manually:

```bash
pre-commit run --all-files
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
