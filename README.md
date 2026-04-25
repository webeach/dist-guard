<div align="center">
  <p>
    <img alt="dist-guard" src="./assets/logo.svg" height="260">
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@webeach/dist-guard">
       <img src="https://img.shields.io/npm/v/@webeach/dist-guard.svg?color=009BBF&labelColor=9F66FF" alt="npm package" />
    </a>
    <a href="https://github.com/webeach/dist-guard/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/webeach/dist-guard/ci.yml?color=009BBF&labelColor=9F66FF" alt="build" />
    </a>
    <a href="https://www.npmjs.com/package/@webeach/dist-guard">
      <img src="https://img.shields.io/npm/dm/@webeach/dist-guard.svg?color=009BBF&labelColor=9F66FF" alt="npm downloads" />
    </a>
  </p>
  <p><a href="./README.md">🇺🇸 English version</a> | <a href="./README.ru.md">🇷🇺 Русская версия</a></p>
  <p>A blazing fast CLI tool to scan your compiled (dist) files for leaked tokens, API keys, passwords, and other private data before deploying.</p>
</div>

---

## 💎 Features

- 🚀 **High Speed** — scans thousands of files in milliseconds
- 🧠 **Minimal False Positives** — smart context-aware analysis distinguishes real secrets from random hashes in code
- 🛡️ **Protection Against >50 Leak Types** — SaaS tokens, Cloud provider keys, SSH/RSA keys, database connection strings
- 🙈 **Automatic Redaction** — hides the contents of found tokens to prevent compromising them in CI/CD logs
- 💻 **Local Path Detection** — prevents OS usernames and local directory structures from leaking into production builds
- 📦 **Zero Config** — works straight out of the box with no extra setup required

---

## 📦 Installation

For use in projects (in CI/CD or npm scripts), it is recommended to install locally:

```bash
npm install -D @webeach/dist-guard
```

or

```bash
pnpm add -D @webeach/dist-guard
```

or

```bash
yarn add -D @webeach/dist-guard
```

---

## 🚀 Quick Start

Scan the `dist` directory without installing:

```bash
npx @webeach/dist-guard
```

or

```bash
pnpm dlx @webeach/dist-guard
```

or

```bash
yarn dlx @webeach/dist-guard
```

---

## 🛠 Configuration

### CLI Flags

| Flag                     | Alias | Description                                        | Default               |
| ------------------------ | ----- | -------------------------------------------------- | --------------------- |
| `--include <globs>`      | `-i`  | Comma-separated glob patterns of files to scan     | `{dist,build}/**/*.*` |
| `--exclude <globs>`      | `-x`  | Comma-separated glob patterns of files to exclude  | —                     |
| `--ignore-rules <rules>` | `-r`  | Comma-separated rule keys to ignore                | —                     |
| `--no-redact`            | —     | Show secrets in plain text instead of masking them | —                     |

**Example:**

```bash
npx @webeach/dist-guard -i "out/**/*.*" -r GitHubToken --no-redact
```

### Configuration File

`dist-guard` automatically looks for settings in `package.json` (under the `distGuard` field) or in a `dist-guard.config.json` file at the root of the project.

**Option 1: In `package.json`**

```json
{
  "name": "my-project",
  "distGuard": {
    "include": ["{dist,build}/**/*.*"],
    "exclude": ["**/*.map", "vendor/**"],
    "ignoreRules": ["GenericAPIKey"],
    "redact": false
  }
}
```

**Option 2: In `dist-guard.config.json`**

```json
{
  "$schema": "https://schemas.webea.ch/dist-guard/v0.2.json",
  "include": ["{dist,build}/**/*.*"],
  "exclude": ["**/*.map", "vendor/**"],
  "ignoreRules": ["GenericAPIKey"],
  "redact": false
}
```

---

## 📥 Usage Examples

### In npm scripts

Add scanning to your build process to prevent deploying secrets. If `dist-guard` finds a leak, it will exit with code `1` and halt the script execution.

```json
{
  "scripts": {
    "build": "vite build",
    "scan": "dist-guard",
    "release": "npm run build && npm run scan && npm run deploy"
  }
}
```

### In GitHub Actions

```yaml
name: Build and Scan
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build project
        run: pnpm run build

      - name: Security Scan
        run: pnpm dist-guard
```

---

## 🧩 Dependencies

The project uses [ripgrep](https://github.com/BurntSushi/ripgrep) — one of the fastest search engines in the world, written in Rust. For parsing command-line arguments, the lightweight `cac` is used.

---

## 👨‍💻 Author

Development and support: [Ruslan Martynov](https://github.com/ruslan-mart)

If you have suggestions or found a bug, feel free to open an issue or submit a pull request.

---

## 📄 License

This package is distributed under the [MIT License](./LICENSE).
