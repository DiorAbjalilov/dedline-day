import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { BotService } from "../bot/bot.service";
import { DatabaseService } from "../database/database.service";
import { OpenaiService } from "../openai/openai.service";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private botService: BotService,
    private databaseService: DatabaseService,
    private openaiService: OpenaiService,
  ) {}

  // Har kuni ertalab soat 8:00 da (Toshkent vaqti, UTC+5)
  // UTC da bu 03:00 bo'ladi
  @Cron("0 3 * * *")
  async sendDailyReminders() {
    this.logger.log("Kunlik eslatmalar yuborilmoqda...");

    const users = this.databaseService.getAllUsers();

    for (const user of users) {
      try {
        // To'g'ri kun hisoblash - to'liq qolgan kunlar
        const [year, month, day] = user.target_date.split("-").map(Number);
        const targetDate = new Date(year, month - 1, day);
        targetDate.setHours(0, 0, 0, 0);
        const today = new Date(); // Hozirgi vaqtni o'zgartirmaymiz

        const diffTime = targetDate.getTime() - today.getTime();
        const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) {
          // Sana o'tib ketgan - foydalanuvchini xabardor qilish va o'chirish
          await this.botService.sendMessage(
            user.chat_id,
            `🎉 <b>${user.name}</b>, sizning muhim kuningiz keldi!\n\n` +
              `📅 Bugun: <b>${user.target_date}</b>\n` +
              `📝 ${user.reason}\n\n` +
              `Omad tilayman! 🍀`,
          );
          this.databaseService.deleteUser(user.chat_id);
          continue;
        }

        if (daysLeft === 0) {
          // Bugun muhim kun!
          await this.botService.sendMessage(
            user.chat_id,
            `🎊 <b>${user.name}</b>, BUGUN SIZNING KUNINGIZ! 🎊\n\n` +
              `📝 ${user.reason}\n\n` +
              `💪 Hammasi yaxshi bo'ladi! Ishoning o'zingizga!`,
          );
          this.databaseService.deleteUser(user.chat_id);
          continue;
        }

        // AI dan motivatsion xabar olish
        const motivationalMessage =
          await this.openaiService.generateMotivationalMessage(
            user.name,
            daysLeft,
            user.reason,
          );

        // Asosiy xabar
        let message =
          `🌅 <b>Xayrli tong, ${user.name}!</b>\n\n` +
          `📅 <b>${user.reason}</b> ga: <b>${daysLeft} kun</b> qoldi\n\n` +
          `💬 ${motivationalMessage}`;

        // Oxirgi 10 kun - emoji raqamlar bilan
        if (daysLeft <= 10) {
          const emoji = this.botService.getNumberEmoji(daysLeft);
          message =
            `${emoji} <b>DIQQAT!</b> ${emoji}\n\n` +
            `🌅 <b>Xayrli tong, ${user.name}!</b>\n\n` +
            `📅 <b>${user.reason}</b> ga: <b>${daysLeft} kun</b> qoldi!\n\n` +
            `⚡ Vaqt kam! Tayyor bo'ling!\n\n` +
            `💬 ${motivationalMessage}`;
        }

        await this.botService.sendMessage(user.chat_id, message);

        this.logger.log(`Eslatma yuborildi: ${user.name} (${user.chat_id})`);
      } catch (error) {
        this.logger.error(
          `Xato: ${user.chat_id} ga xabar yuborishda muammo`,
          error,
        );
      }
    }

    this.logger.log("Kunlik eslatmalar yuborildi!");
  }
}
