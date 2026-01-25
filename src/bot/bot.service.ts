import { Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";

@Injectable()
export class BotService {
  constructor(@InjectBot() private bot: Telegraf<any>) {}

  async sendMessage(chatId: number, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: "HTML",
      });
    } catch (error) {
      console.error(`Failed to send message to ${chatId}:`, error);
    }
  }

  async sendSticker(chatId: number, sticker: string): Promise<void> {
    try {
      await this.bot.telegram.sendSticker(chatId, sticker);
    } catch (error) {
      console.error(`Failed to send sticker to ${chatId}:`, error);
    }
  }

  // Raqam emojilarni qaytaradi
  getNumberEmoji(num: number): string {
    const emojiMap: { [key: number]: string } = {
      0: "0️⃣",
      1: "1️⃣",
      2: "2️⃣",
      3: "3️⃣",
      4: "4️⃣",
      5: "5️⃣",
      6: "6️⃣",
      7: "7️⃣",
      8: "8️⃣",
      9: "9️⃣",
      10: "🔟",
    };
    return emojiMap[num] || `${num}`;
  }
}
