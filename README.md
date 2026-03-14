# NIS CLUBS

Платформа школьных клубов с полноценным бэкендом: база данных SQLite, API и авторизация по сессии.

## Запуск (автономно)

1. Установить зависимости:
   ```bash
   pnpm install
   ```

2. Создать базу и заполнить тестовыми данными (один раз):
   ```bash
   npx prisma migrate dev
   pnpm db:seed
   ```

3. Запустить приложение:
   ```bash
   pnpm dev
   ```

4. Открыть в браузере: **http://localhost:3000**

## Тестовые аккаунты (после seed)

| Роль    | Email              | Пароль   |
|---------|--------------------|----------|
| Админ   | aidar@nis.edu.kz   | password |
| Владелец| alina@nis.edu.kz   | password |
| Ученик  | daniyar@nis.edu.kz | password |

## Стек

- **Фронтенд:** Next.js 15, React 19, Tailwind, Radix UI
- **Бэкенд:** Next.js Route Handlers (API), Prisma, SQLite
- **Авторизация:** сессия в httpOnly cookie (JWT), bcrypt для паролей

## Скрипты

- `pnpm dev` — режим разработки
- `pnpm build` — сборка
- `pnpm start` — запуск продакшн-сборки
- `pnpm db:seed` — заполнить БД тестовыми данными
- `pnpm db:studio` — открыть Prisma Studio для просмотра БД

## База данных

Файл БД: `prisma/dev.db` (SQLite). Схема и миграции — в `prisma/schema.prisma` и `prisma/migrations/`.

При необходимости сбросить БД и заново выполнить seed:
```bash
npx prisma migrate reset
```

## Деплой на Vercel через GitHub

### 1. Подготовка репозитория

1. В корне проекта инициализируйте git:
   ```bash
   git init
   git add .
   git commit -m "Initial NIS CLUBS with backend"
   ```
2. Создайте пустой репозиторий на GitHub.
3. Привяжите локальный проект и отправьте:
   ```bash
   git remote add origin https://github.com/<your-name>/<repo-name>.git
   git push -u origin main
   ```

### 2. Настройка проекта на Vercel

1. Зайдите на `https://vercel.com`, войдите через GitHub.
2. Нажмите **New Project → Import Git Repository** и выберите ваш репозиторий.
3. Vercel автоматически определит **Framework: Next.js** и команду сборки `next build`.
4. В разделе **Environment Variables** добавьте:
   - `AUTH_SECRET` — любая длинная случайная строка (секрет для JWT).
5. Нажмите **Deploy** и дождитесь сборки.

> ⚠ **Важно про базу данных:** сейчас используется SQLite-файл `prisma/dev.db`. На Vercel файловая система функций не предназначена для постоянной записи, поэтому данные могут не сохраняться между перезапусками. Для продакшна рекомендуется:
> - завести PostgreSQL (например, Neon/Supabase/Railway),
> - заменить в `prisma/schema.prisma` `provider = "postgresql"` и использовать `DATABASE_URL` из облачной БД,
> - запускать миграции командой `npx prisma migrate deploy` в CI.

