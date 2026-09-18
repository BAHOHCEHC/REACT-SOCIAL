# Базовий образ Node.js 22 на Alpine Linux.
# Alpine значно легший за повний Linux-образ.
FROM node:22-alpine


# Робоча директорія всередині контейнера.
# Усі наступні команди виконуються відносно /app.
WORKDIR /app


# Спочатку копіюємо тільки package.json і package-lock.json.
# Це дозволяє Docker кешувати встановлення залежностей.
COPY package*.json ./


# Встановлюємо ВСІ залежності, включно з devDependencies.
# Це важливо, тому що prisma у тебе знаходиться в devDependencies.
#
# --include=dev гарантує, що Prisma CLI буде встановлений,
# навіть якщо нижче ми використовуємо NODE_ENV=production.
RUN npm ci --include=dev


# Копіюємо весь проєкт у контейнер.
# --chown=node:node одразу встановлює правильного власника файлів,
# щоб застосунок, запущений від non-root користувача node,
# міг без проблем писати на диск (наприклад, через multer).
#
# Сюди потраплять:
# - bin/
# - routes/
# - public/
# - views/
# - app.js
# - prisma/schema.prisma
# - prisma.config.ts (якщо він є)
# та інші файли проєкту.
COPY --chown=node:node . .


# Генеруємо Prisma Client на основі prisma/schema.prisma.
# Prisma CLI береться з локального node_modules,
# тому npm install -g prisma НЕ потрібен.
RUN npx prisma generate


# Тільки після встановлення залежностей і генерації Prisma Client
# задаємо production-режим для запуску застосунку.
ENV NODE_ENV=production


# Порт, на якому Express слухатиме запити.
ENV PORT=3000


# Запускаємо контейнер не від root, а від стандартного користувача Node.
# Це безпечніше для production.
USER node


# Документуємо, що контейнер використовує порт 3000.
EXPOSE 3000


# Команда запуску Express-застосунку.
CMD ["npm", "start"]