# Flutter L10n Scanner

> A beautiful desktop app that makes Flutter localization a breeze. Scan your Dart files, extract translatable strings, and generate ARB files in seconds.

🦀 **My first Rust + Tauri project!** Built this while learning Rust, and honestly, I'm loving it.

---

## Screenshots

|                                                                                                                        |                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ![Preview](https://res.cloudinary.com/dbnwetu3r/image/upload/v1763508695/Screenshot_2025-11-18_at_23.26.06_kdrosi.png) | ![Preview](https://res.cloudinary.com/dbnwetu3r/image/upload/v1763508695/Screenshot_2025-11-18_at_23.28.30_pvqdle.png) |

---

## What it does

Ever spent hours manually extracting strings from your Flutter app for localization? Yeah, me too. That's why I built this.

Just point it at your Flutter project, hit scan, and it'll find all those hardcoded strings hiding in your Dart files. Then you can export them to ARB files ready for translation.

---

## Features

- **Smart Scanning** - Automatically finds translatable strings in your Dart files
- **100+ Languages** - Support for virtually any language you need
- **Beautiful UI** - Glassy, modern interface with light/dark themes
- **Project Management** - Handle multiple Flutter projects
- **Ignore Patterns** - Skip test files, generated code, etc.
- **AI Translations** - OpenAI integration for automated translations (coming soon)

---

## Tech Stack

This project combines some really cool technologies:

| Layer    | Tech                            |
| -------- | ------------------------------- |
| Frontend | React, TypeScript, Tailwind CSS |
| Backend  | Rust, Tauri 2.0                 |
| Build    | Vite, Bun                       |

Why Tauri? Because it gives you native performance with a tiny bundle size. Plus, I wanted to learn Rust!

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or npm/yarn)
- [Rust](https://rustup.rs/)

### Installation

```bash
# Clone the repo
git clone https://github.com/vehanhemsara/l10n-scrapper.git
cd l10n-scrapper

# Install dependencies
bun install

# Run in development
bun run tauri dev

# Build for production
bun run tauri build
```

---

## How to Use

1. **Import a Project** - Click "Import" and select your Flutter project folder
2. **Configure** - Set ignore patterns and select target languages
3. **Scan** - Hit the scan button and watch the magic happen
4. **Export** - Generate your ARB files

---

## Roadmap

- [ ] AI-powered translations via OpenAI
- [ ] Batch translation support
- [ ] ARB file editing
- [ ] Translation memory
- [ ] Export to other formats (JSON, XLIFF)

---

## Contributing

Found a bug? Want to add a feature? PRs are welcome! This is a learning project, so I'd love feedback from more experienced Rust devs.

---

## Author

**Vehan Hemsara**

Just a developer trying to learn Rust one project at a time. If you find this useful, give it a star!

- GitHub: [@vehanhemsara](https://github.com/vehanhemsara)

---

## License

MIT - feel free to use this however you want!
