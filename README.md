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
- **OpenAI** - GPT-3.5 turbo (kontekstga mos motivatsion xabarlar)
- **SQLite** - Ma'lumotlar bazasi
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
