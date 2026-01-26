import { Update, Start, On, Ctx, Message, Command } from "nestjs-telegraf";
import { Context } from "telegraf";
import { DatabaseService } from "../database/database.service";

interface SessionData {
  step?: "awaiting_name" | "awaiting_date" | "awaiting_reason";
  name?: string;
  targetDate?: string;
}

interface MyContext extends Context {
  session: SessionData;
}

@Update()
export class BotUpdate {
  constructor(private databaseService: DatabaseService) {}

  @Command("reset")
  async onReset(@Ctx() ctx: MyContext) {
    if (!ctx.chat) return;

    const chatId = ctx.chat.id;
    const existingUser = await this.databaseService.getUser(chatId);

    if (existingUser) {
      await this.databaseService.deleteUser(chatId);
      await ctx.reply(
        `🗑️ Ma'lumotlaringiz o'chirildi.\n\n` +
          `Yangi sana belgilash uchun /start buyrug'ini yuboring.`,
        { parse_mode: "HTML" },
      );
    } else {
      await ctx.reply(
        `❌ Siz hali ro'yxatdan o'tmagansiz.\n\n` +
          `Ro'yxatdan o'tish uchun /start buyrug'ini yuboring.`,
        { parse_mode: "HTML" },
      );
    }
  }

  @Start()
  async onStart(@Ctx() ctx: MyContext) {
    if (!ctx.chat) return;

    const chatId = ctx.chat.id;
    const existingUser = await this.databaseService.getUser(chatId);

    if (existingUser) {
      // User allaqachon ro'yxatdan o'tgan - ma'lumotlarini ko'rsatish
      const [year, month, day] = existingUser.target_date
        .split("-")
        .map(Number);
      const target = new Date(year, month - 1, day);
      target.setHours(0, 0, 0, 0);
      const now = new Date();
      const diffTime = target.getTime() - now.getTime();
      const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      await ctx.reply(
        `👋 <b>${existingUser.name}</b>, siz allaqachon ro'yxatdan o'tgansiz!\n\n` +
          `📅 Muhim kun: <b>${existingUser.target_date}</b>\n` +
          `📝 Sabab: <b>${existingUser.reason}</b>\n` +
          `⏳ Qolgan kunlar: <b>${daysLeft} kun</b>\n\n` +
          `🔄 Yangi sana belgilash uchun /reset buyrug'ini yuboring.`,
        { parse_mode: "HTML" },
      );
      return;
    }

    ctx.session = ctx.session || {};
    ctx.session.step = "awaiting_name";

    await ctx.reply(
      `🎯 <b>Deadline Reminder Bot</b>ga xush kelibsiz!\n\n` +
        `Men sizga muhim kunlaringizni eslatib turaman.\n\n` +
        `Iltimos, <b>ismingizni</b> yozing:`,
      { parse_mode: "HTML" },
    );
  }

  @On("text")
  async onText(@Ctx() ctx: MyContext, @Message("text") text: string) {
    ctx.session = ctx.session || {};

    if (!ctx.chat) {
      return;
    }

    const chatId = ctx.chat.id;
    const step = ctx.session.step;

    if (!step) {
      await ctx.reply(
        `Botni ishga tushirish uchun /start buyrug'ini yuboring.`,
      );
      return;
    }

    switch (step) {
      case "awaiting_name":
        ctx.session.name = text.trim();
        ctx.session.step = "awaiting_date";
        await ctx.reply(
          `Yaxshi, <b>${ctx.session.name}</b>! 👋\n\n` +
            `Endi sizning <b>muhim kuningiz sanasini</b> yozing.\n\n` +
            `📅 Format: <code>YYYY-MM-DD</code>\n` +
            `Masalan: <code>2026-03-15</code>`,
          { parse_mode: "HTML" },
        );
        break;

      case "awaiting_date":
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(text.trim())) {
          await ctx.reply(
            `❌ Noto'g'ri format!\n\n` +
              `Sanani <code>YYYY-MM-DD</code> formatida yozing.\n` +
              `Masalan: <code>2026-03-15</code>`,
            { parse_mode: "HTML" },
          );
          return;
        }

        const inputDate = new Date(text.trim());
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate <= today) {
          await ctx.reply(
            `❌ Sana kelajakda bo'lishi kerak!\n\n` +
              `Iltimos, bugundan keyingi sanani kiriting.`,
            { parse_mode: "HTML" },
          );
          return;
        }

        ctx.session.targetDate = text.trim();
        ctx.session.step = "awaiting_reason";
        await ctx.reply(
          `📅 Sana saqlandi: <b>${ctx.session.targetDate}</b>\n\n` +
            `Endi bu kun <b>nima uchun muhim</b> ekanligini <b>to'liqroq yozing</b>:\n\n` +
            `Iltimos, to'liq ma'lumot bering, men sizga har kuni shu sababga mos motivatsion xabarlar yuboraman.\n\n` +
            `Yaxshi misollar:\n` +
            `✅ "Universitet yakuniy imtihoni, 4 yil o'qishimning natijasi"\n` +
            `✅ "To'y kunim, sevikli insonim bilan turmush quramiz"\n` +
            `✅ "Yangi ish joyiga intervyu, karyeramda katta qadam"\n\n` +
            `Yomon misol:\n` +
            `❌ "Imtihon" (juda qisqa)`,
          { parse_mode: "HTML" },
        );
        break;

      case "awaiting_reason":
        const reason = text.trim();
        const name = ctx.session.name || "";
        const targetDate = ctx.session.targetDate || "";

        if (!name || !targetDate) {
          ctx.session = {};
          ctx.session.step = "awaiting_name";
          await ctx.reply(
            `Ma'lumotlar to'liq emas. Iltimos, /start buyrug'ini qayta yuboring.`,
          );
          return;
        }

        // Sabab juda qisqa bo'lsa, ogohlantirish
        if (reason.length < 15) {
          await ctx.reply(
            `⚠️ Sabab juda qisqa!\n\n` +
              `Iltimos, to'liqroq yozing. Men sizga har kuni shu sababga mos motivatsion xabarlar yuboraman.\n\n` +
              `Yaxshi misollar:\n` +
              `✅ "Universitet yakuniy imtihoni, 4 yil o'qishimning natijasi"\n` +
              `✅ "To'y kunim, sevikli insonim bilan turmush quramiz"\n` +
              `✅ "Yangi ish joyiga intervyu, karyeramda katta qadam"`,
            { parse_mode: "HTML" },
          );
          return;
        }

        await this.databaseService.createUser(chatId, name, targetDate, reason);

        // To'g'ri kun hisoblash - to'liq qolgan kunlar
        const [year, month, day] = targetDate.split("-").map(Number);
        const target = new Date(year, month - 1, day);
        target.setHours(0, 0, 0, 0);
        const now = new Date(); // Hozirgi vaqtni o'zgartirmaymiz
        const diffTime = target.getTime() - now.getTime();
        const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        ctx.session = {};

        await ctx.reply(
          `✅ <b>Hammasi tayyor, ${name}!</b>\n\n` +
            `📅 Muhim kun: <b>${targetDate}</b>\n` +
            `📝 Sabab: <b>${reason}</b>\n` +
            `⏳ Qolgan kunlar: <b>${daysLeft} kun</b>\n\n` +
            `🔔 Men sizga har kuni <b>ertalab soat 8:00</b> da AI yordamida maxsus motivatsion xabarlar yuboraman!\n\n` +
            `💪 Omad tilayman!`,
          { parse_mode: "HTML" },
        );
        break;
    }
  }
}
