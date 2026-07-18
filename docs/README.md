# EchoPrint — Docs

Entry point for product and engineering documentation.

## Navigation

- [Specs](specs/) — product requirements: what to build, for whom, and how success is measured.

## Before you write

- Filename: `NNNN-kebab-case-title.md` (four-digit number; never reuse a number).
- Every document has a `Status` field in its header.
- Create a spec by copying [`specs/0000-template.md`](specs/0000-template.md).

## Status lifecycle

```
Draft → Active → Shipped → Deprecated
                        ↘ Superseded by NNNN
```

Do not delete superseded documents. Mark their status and link to the replacement.
