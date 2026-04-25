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
  <p>Молниеносный CLI-инструмент для сканирования собранных (dist) файлов на наличие забытых токенов, API-ключей, паролей и других приватных данных перед деплоем.</p>
</div>

---

## 💎 Особенности

- 🚀 **Высокая скорость** — сканирует тысячи файлов за миллисекунды
- 🧠 **Минимум ложных срабатываний** — умный анализ контекста отличает реальные секреты от случайных хэшей в коде
- 🛡️ **Защита от >50 типов утечек** — токены SaaS, ключи Cloud провайдеров, SSH/RSA ключи, строки подключения к БД
- 🙈 **Автоматическая маскировка** — скрывает содержимое найденных токенов, чтобы не скомпрометировать их в логах CI/CD
- 💻 **Детект локальных путей** — предотвращает утечку имен пользователей ОС и структуры директорий разработчика
- 📦 **Zero Config** — работает прямо из коробки без дополнительных настроек

---

## 📦 Установка

Для использования в проектах (в CI/CD или npm scripts) рекомендуется устанавливать локально:

```bash
npm install -D @webeach/dist-guard
```

или

```bash
pnpm add -D @webeach/dist-guard
```

или

```bash
yarn add -D @webeach/dist-guard
```

---

## 🚀 Быстрый старт

Сканировать директорию `dist` без установки:

```bash
npx @webeach/dist-guard
```

или

```bash
pnpm dlx @webeach/dist-guard
```

или

```bash
yarn dlx @webeach/dist-guard
```

---

## 🛠 Конфигурация

### CLI Флаги

| Флаг                     | Алиас | Описание                                              | По умолчанию          |
| ------------------------ | ----- | ----------------------------------------------------- | --------------------- |
| `--include <globs>`      | `-i`  | Glob-паттерны файлов для сканирования (через запятую) | `{dist,build}/**/*.*` |
| `--exclude <globs>`      | `-x`  | Glob-паттерны файлов для исключения (через запятую)   | —                     |
| `--ignore-rules <rules>` | `-r`  | Ключи правил для игнорирования (через запятую)        | —                     |
| `--no-redact`            | —     | Показывать секреты без маскировки                     | —                     |

**Пример:**

```bash
npx @webeach/dist-guard -i "out/**/*.*" -r GitHubToken --no-redact
```

### Файл конфигурации

`dist-guard` автоматически ищет настройки в `package.json` (в поле `distGuard`) или в файле `dist-guard.config.json` в корне проекта.

**Вариант 1: В `package.json`**

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

**Вариант 2: В `dist-guard.config.json`**

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

## 📥 Примеры использования

### В npm scripts

Добавьте сканирование в ваш процесс сборки, чтобы предотвратить деплой секретов. Если `dist-guard` найдет утечку, он завершится с кодом `1` и прервёт выполнение скрипта.

```json
{
  "scripts": {
    "build": "vite build",
    "scan": "dist-guard",
    "release": "npm run build && npm run scan && npm run deploy"
  }
}
```

### В GitHub Actions

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

## 🧩 Зависимости

В проекте используется [ripgrep](https://github.com/BurntSushi/ripgrep) — один из самых быстрых в мире поисковых движков, написанный на Rust. Для парсинга аргументов командной строки применяется легковесный `cac`.

---

## 👨‍💻 Автор

Разработка и поддержка: [Руслан Мартынов](https://github.com/ruslan-mart)

Если у тебя есть предложения или найден баг, открывай issue или отправляй pull request.

---

## 📄 Лицензия

Этот пакет распространяется под [лицензией MIT](./LICENSE).
