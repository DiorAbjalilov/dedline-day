# 🔄 SQLite → PostgreSQL Migratsiya

## O'zgarishlar

### ❌ Olib Tashlangan:
- `better-sqlite3` package
- `bot.db` fayl (SQLite database)

### ✅ Qo'shilgan:
- `pg` package (PostgreSQL client)
- `DATABASE_URL` environment variable
- Railway uchun persistent database

## Lokal O'rnatish

### 1. Dependencies yangilash

```bash
# Yarn ishlatayotgan bo'lsangiz
yarn install

# yoki npm
npm install
```

### 2. PostgreSQL o'rnatish

**MacOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb deadline_bot
```

**Ubuntu/Debian:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb deadline_bot
```

**Windows:**
https://www.postgresql.org/download/windows/ dan yuklab oling

### 3. .env faylini yangilash

`.env` fayliga `DATABASE_URL` qo'shing:

```env
TELEGRAM_BOT_TOKEN=your_token_here
OPENAI_API_KEY=your_openai_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/deadline_bot
```

**PostgreSQL default qiymatlar:**
- User: `postgres` yoki sizning user nomingiz
- Password: o'rnatishda belgilagan parol (yoki bo'sh)
- Host: `localhost`
- Port: `5432`
- Database: `deadline_bot`

### 4. Botni ishga tushirish

```bash
npm run start:dev
```

## Railway ga Deploy Qilish

### 1. Railway da PostgreSQL qo'shish

1. Railway loyihangizni oching
2. **"New"** tugmasini bosing
3. **"Database"** → **"PostgreSQL"** tanlang
4. PostgreSQL o'rnatiladi (1-2 daqiqa)

### 2. Environment Variables

Railway loyihasida **"Variables"** bo'limiga faqat quyidagilarni qo'shing:

```
TELEGRAM_BOT_TOKEN=sizning_token
OPENAI_API_KEY=sizning_key
```

**MUHIM**: `DATABASE_URL` ni o'zingiz qo'shishga hojat yo'q! Railway PostgreSQL servisini qo'shganingizda avtomatik bog'lanadi.

### 3. Deploy

```bash
git add .
git commit -m "Migrate to PostgreSQL"
git push
```

Railway avtomatik deploy qiladi va PostgreSQL ga bog'lanadi.

### 4. Tekshirish

Railway **"Deployments"** → **"View Logs"** bo'limida:

```
✅ Database connected successfully
✅ Application started successfully
```

## Tez-tez So'raladigan Savollar

### Q: Eski ma'lumotlarim saqlanib qoladimi?
**A:** SQLite dan PostgreSQL ga o'tkazish uchun manual migration kerak. Lekin eski foydalanuvchilar botni qaytadan `/start` qilishlari mumkin.

### Q: Railway da PostgreSQL bepulmi?
**A:** Railway da 500MB gacha PostgreSQL bepul. Bu bot uchun kifoya.

### Q: Local development uchun PostgreSQL shart emasmi?
**A:** Ha, shart. Lekin Docker ishlatishingiz mumkin:

```bash
docker run --name postgres-deadline \
  -e POSTGRES_DB=deadline_bot \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  -d postgres:15
```

Keyin `.env` da:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/deadline_bot
```

### Q: Har push qilganimda ham ma'lumotlar saqlanadi?
**A:** ✅ Ha! PostgreSQL persistent database, Railway qayta deploy bo'lsa ham ma'lumotlar saqlanadi.

## Muammolar

### Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Yechim:**
```bash
# PostgreSQL ishlaganini tekshirish
# MacOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Agar ishlamasa, ishga tushirish
brew services start postgresql@15  # MacOS
sudo systemctl start postgresql    # Linux
```

### Authentication Failed

```
Error: password authentication failed
```

**Yechim:** `.env` dagi `DATABASE_URL` ni tekshiring:
```bash
# PostgreSQL user va parolni o'zgartirish (local)
psql postgres
ALTER USER postgres PASSWORD 'yangi_parol';
```

Keyin `.env` ni yangilang:
```
DATABASE_URL=postgresql://postgres:yangi_parol@localhost:5432/deadline_bot
```

## Yordam

Agar muammo bo'lsa:
1. Railway logs ni tekshiring
2. `DATABASE_URL` to'g'ri ekanligini tasdiqlang
3. PostgreSQL ishlaganini tekshiring

PostgreSQL ishlaganini test qilish:
```bash
psql $DATABASE_URL -c "SELECT version();"
```
