# 🤖 Deadline Reminder Bot

Telegram bot for deadline reminders with OpenAI integration, built with NestJS.

## 📋 Features

- **/start** - Botni ishga tushirish va ma'lumotlarni kiritish
- **Ism** - Foydalanuvchi ismini saqlash
- **Sana** - Muhim kun sanasini saqlash (YYYY-MM-DD)
- **Sabab** - Bu kun nima uchun muhimligini to'liq yozish (AI uchun context)
- **Kunlik eslatma** - Har kuni ertalab 8:00 da
- **AI xabarlar** - OpenAI orqali kontekstga mos motivatsion xabarlar
  - **30+ kun**: Umumiy motivatsiya va rejalashtirish
  - **10-30 kun**: Tayorgarlik va fokuslanish
  - **3-10 kun**: Tinchlantirish va dalda berish ("Hayajonlanmang!")
  - **1-3 kun**: Kuchli ishonch va qo'llab-quvvatlash
- **Oxirgi 10 kun** - Emoji raqamlar bilan maxsus eslatmalar
- **/reset** - Ma'lumotlarni o'chirish va qayta boshlash

## 🚀 O'rnatish

### 1. Dependencies ni o'rnating

```bash
# Yarn ishlatayotgan bo'lsangiz
yarn install

# yoki npm
npm install
```

### 2. .env faylini sozlang

```bash
cp .env.example .env
```

`.env` fayliga quyidagilarni qo'shing:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/deadline_bot
```

### 3. Telegram Bot Token olish

1. Telegram da [@BotFather](https://t.me/BotFather) ga boring
2. `/newbot` buyrug'ini yuboring
3. Bot nomini va username kiriting
4. Token ni `.env` fayliga joylashtiring

### 4. OpenAI API Key olish

1. [OpenAI Platform](https://platform.openai.com/) ga kiring
2. API Keys bo'limidan yangi key yarating
3. Key ni `.env` fayliga joylashtiring

### 5. PostgreSQL o'rnatish (Local development)

**TAVSIYA: Docker ishlatish (Eng oson yo'l!)**

```bash
# PostgreSQL ni Docker da ishga tushirish
npm run docker:up

# Status tekshirish
docker-compose ps

# Logs ko'rish
npm run docker:logs
```

**Yoki PostgreSQL ni to'g'ridan-to'g'ri o'rnatish:**

<details>
<summary>MacOS (Homebrew)</summary>

```bash
brew install postgresql@15
brew services start postgresql@15
createdb deadline_bot
```
</details>

<details>
<summary>Ubuntu/Debian</summary>

```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb deadline_bot
```
</details>

<details>
<summary>Windows</summary>

[PostgreSQL Download](https://www.postgresql.org/download/windows/) dan yuklab oling
</details>

## 🏃 Ishga tushirish

### Option 1: Docker bilan (Tavsiya)

```bash
# PostgreSQL + Bot birga ishga tushirish
npm run dev
```

Bu buyruq:
1. PostgreSQL ni Docker da ishga tushiradi
2. Botni development rejimda ishga tushiradi

### Option 2: Alohida ishga tushirish

```bash
# 1. PostgreSQL ni ishga tushirish (agar ishlamasa)
npm run docker:up

# 2. Botni ishga tushirish
npm run start:dev
```

### Docker boshqaruv buyruqlari

```bash
# PostgreSQL ni ishga tushirish
npm run docker:up

# PostgreSQL ni to'xtatish
npm run docker:down

# PostgreSQL logs ko'rish
npm run docker:logs

# PostgreSQL status tekshirish
docker-compose ps
```

### Production mode

```bash
npm run build
npm run start:prod
```

## 📁 Struktura

```
src/
├── main.ts                 # Entry point
├── app.module.ts           # Root module
├── bot/
│   ├── bot.module.ts
│   ├── bot.service.ts      # Xabar yuborish
│   └── bot.update.ts       # /start va text handler
├── database/
│   ├── database.module.ts
│   └── database.service.ts # SQLite CRUD
├── openai/
│   ├── openai.module.ts
│   └── openai.service.ts   # AI xabarlar
└── scheduler/
    ├── scheduler.module.ts
    └── scheduler.service.ts # Kunlik cron job
```

## 🚀 Railway ga Deploy Qilish

### 1. Railway da PostgreSQL qo'shish

1. [Railway.app](https://railway.app) ga kiring
2. Loyihangizni oching
3. **"New"** → **"Database"** → **"PostgreSQL"** tanlang
4. PostgreSQL o'rnatiladi va `DATABASE_URL` avtomatik qo'shiladi

### 2. Environment Variables sozlash

Railway loyihasida **"Variables"** bo'limiga:

```
TELEGRAM_BOT_TOKEN=sizning_bot_token
OPENAI_API_KEY=sizning_openai_key
```

**MUHIM**: `DATABASE_URL` ni o'zingiz qo'shishga hojat yo'q! Railway PostgreSQL o'rnatganda avtomatik qo'shadi.

### 3. Deploy qilish

```bash
git add .
git commit -m "PostgreSQL migration"
git push
```

Railway avtomatik deploy qiladi. Endi har safar push qilsangiz ham foydalanuvchilar saqlanadi! ✅

### 4. Tekshirish

Railway **"Deployments"** bo'limida log'larni ko'ring:
```
Database connected successfully
```

## 🔧 Texnologiyalar

- **NestJS** - Backend framework
- **Telegraf** - Telegram Bot API
- **OpenAI** - GPT-3.5 turbo (kontekstga mos motivatsion xabarlar)
- **PostgreSQL** - Ishonchli database (foydalanuvchilar saqlanadi!)
- **@nestjs/schedule** - Cron jobs (har kuni 8:00 da)

## 🤖 AI Xabar Tizimi

Bot qolgan kunlarga qarab turli xil yondashuvda xabarlar yuboradi:

| Qolgan kunlar | Yondashuv | Misol |
|---------------|-----------|-------|
| 30+ kun | Umumiy motivatsiya, rejalashtirish | "Vaqtingiz ko'p, bosqichma-bosqich tayyorgarlik ko'ring!" |
| 10-30 kun | Tayorgarlik, fokuslanish | "Muhim ishlarga e'tibor qiling, siz uddalaysiz!" |
| 3-10 kun | Tinchlantirish, dalda berish | "Tinch bo'ling, siz yaxshi tayyorsiz. Hayajonlanmang!" |
| 1-3 kun | Kuchli ishonch berish | "O'zingizga ishoning! Siz bunga tayyorsiz!" |

Har bir xabar foydalanuvchi kiritgan to'liq sababga mos ravishda shaxsiylashtirilgan bo'ladi.

## 📝 Foydalanish Misoli

```
/start

Bot: Ismingizni yozing
→ Diyor

Bot: Muhim kun sanasini yozing (YYYY-MM-DD)
→ 2026-04-25

Bot: Bu kun nima uchun muhim ekanligini to'liqroq yozing
→ To'y kunim, sevikli insonim bilan turmush quramiz, hayotimdagi eng muhim qadam

✅ Hammasi tayyor! Har kuni motivatsion xabarlar olasiz.
```

### Kunlik xabarlar:
- **89 kun qolganda**: "Vaqtingiz ko'p, reja tuzing..."
- **15 kun qolganda**: "To'yingizga tayyorgarlik ko'ring, muhim ishlarga e'tibor qarating..."
- **5 kun qolganda**: "Diyor, hayajonlanmang! Siz yaxshi tayyorsiz, hammasi joyida..."
- **1 kun qolganda**: "Ertaga sizning kuningiz! O'zingizga ishoning, qo'rqmang!"

Har bir xabar **sizning to'liq yozilgan sababingizga** mos va **qolgan kunlarga** qarab yoziladi! 🎊
