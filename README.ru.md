<div align="center">
  <p>
    <img alt="dist-guard" src="./assets/logo.png" height="260">
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@webeach/dist-guard">
       <img src="https://img.shields.io/npm/v/@webeach/dist-guard.svg?color=646fe1&labelColor=9B7AEF" alt="npm package" />
    </a>
    <a href="https://github.com/webeach/dist-guard/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/webeach/dist-guard/ci.yml?color=646fe1&labelColor=9B7AEF" alt="build" />
    </a>
    <a href="https://www.npmjs.com/package/@webeach/dist-guard">
      <img src="https://img.shields.io/npm/dm/@webeach/dist-guard.svg?color=646fe1&labelColor=9B7AEF" alt="npm downloads" />
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

- `--target-dir <dir>` — директория для сканирования (по умолчанию: `dist`).
- `--pattern <glob>` — маска файлов для сканирования (по умолчанию: `*.*`).
- `--ignore <rules>` — ключи правил, которые нужно игнорировать (через запятую). Пример: `--ignore StripeSecretKey,TwilioAPIKey`.
- `--ignore-pattern <glob>` — игнорировать файлы/директории по glob-маске.
- `--no-redact` — отключить маскировку секретов в выводе терминала. Покажет полный токен.

**Пример:**

```bash
npx dist-guard --target-dir out --ignore GitHubToken --no-redact
```

### Файл конфигурации

`dist-guard` автоматически ищет настройки в `package.json` (в поле `distGuard`) или в файле `dist-guard.config.json` в корне проекта.

**Вариант 1: В `package.json`**

```json
{
  "name": "my-project",
  "distGuard": {
    "targetDir": "build",
    "ignorePatterns": ["**/*.map", "vendor/**"],
    "ignoreRules": ["GenericAPIKey"],
    "redact": false
  }
}
```

**Вариант 2: В `dist-guard.config.json`**

```json
{
  "$schema": "https://schemas.webea.ch/dist-guard/v0.1.json",
  "targetDir": "build",
  "ignorePatterns": ["**/*.map", "vendor/**"],
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
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install

      - name: Build project
        run: pnpm run build

      - name: Security Scan
        run: pnpm dlx @webeach/dist-guard --target-dir dist
```

---

## 🧩 Зависимости

В проекте используется [ripgrep](https://github.com/BurntSushi/ripgrep) (`@vscode/ripgrep`) — один из самых быстрых в мире поисковых движков, написанный на Rust. Для парсинга аргументов командной строки применяется легковесный `cac`.

---

## 🔖 Выпуск новой версии

Релизы обрабатываются автоматически с помощью `semantic-release`.

Перед публикацией новой версии убедись, что:

1. Все изменения закоммичены и запушены в ветку `main`.
2. Сообщения коммитов соответствуют формату [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/):
   - `feat: ...` — для новых фич
   - `fix: ...` — для исправлений багов
   - `chore: ...`, `refactor: ...` и другие типы — по необходимости
3. Версионирование определяется автоматически на основе типа коммитов (`patch`, `minor`, `major`).

---

## 👨‍💻 Автор

Разработка и поддержка: [Руслан Мартынов](https://github.com/ruslan-mart)

Если у тебя есть предложения или найден баг, открывай issue или отправляй pull request.

---

## 📄 Лицензия

Этот пакет распространяется под [лицензией MIT](./LICENSE).
