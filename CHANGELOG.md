# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0.0] - 2025-05-15

### Added
- Initial release of Raccoon, a developer toolbox web app
- JSON Formatter — format, minify, and validate JSON with error positions
- Timestamp Converter — parse Unix epochs, ISO 8601, RFC 2822, and date strings with live clock
- Base64 Encoder — encode/decode with full Unicode support (CJK, emoji)
- URL Encoder — encode/decode URL components and query strings
- Command palette (Cmd+K) for quick tool search across all pages
- Dark theme with design token system (teal accent, zinc surface palette, JetBrains Mono)
- Lazy-loaded tool routes for code splitting (~107KB gzip total)
- GitHub Pages deployment via GitHub Actions with hash-based routing
- 49 unit tests across all four tools covering happy paths, edge cases, and error handling
