# 🤖 Deadline Reminder Bot

Telegram bot for deadline reminders with OpenAI integration, built with NestJS.

## 📋 Features

- **/start** - Botni ishga tushirish va ma'lumotlarni kiritish
- **Ism** - Foydalanuvchi ismini saqlash
- **Sana** - Muhim kun sanasini saqlash (YYYY-MM-DD)
- **Sabab** - Bu kun nima uchun muhimligini saqlash
- **Kunlik eslatma** - Har kuni ertalab 8:00 da
- **AI xabarlar** - OpenAI orqali motivatsion xabarlar
- **Oxirgi 10 kun** - Emoji raqamlar bilan maxsus eslatmalar

## 🚀 O'rnatish

### 1. Dependencies ni o'rnating

```bash
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

## 🏃 Ishga tushirish

### Development mode

```bash
npm run start:dev
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

## 🔧 Texnologiyalar

- **NestJS** - Backend framework
- **Telegraf** - Telegram Bot API
- **OpenAI** - GPT-3.5 turbo
- **SQLite** - Ma'lumotlar bazasi
- **@nestjs/schedule** - Cron jobs
# dedline-day
