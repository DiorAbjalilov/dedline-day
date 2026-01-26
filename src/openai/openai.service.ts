import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("OPENAI_API_KEY"),
    });
  }

  async generateMotivationalMessage(
    name: string,
    daysLeft: number,
    reason: string,
  ): Promise<string> {
    try {
      // Qolgan kunlarga qarab turli xil yondashuv
      let systemPrompt = "";
      let emotionalTone = "";

      if (daysLeft > 30) {
        // 30+ kun: Umumiy motivatsiya, rejalashtirish
        emotionalTone = "ijobiy, rejalashtirishga undovchi";
        systemPrompt = `Sen motivatsion xabarlar yozuvchi yordamchisan. Foydalanuvchiga uzoq muddatli maqsadga tayyorgarlik ko'rish uchun ijobiy va rejalashtirishga undovchi xabar yoz. O'zbek tilida yoz. 2-3 gap.`;
      } else if (daysLeft > 10) {
        // 10-30 kun: Tayorgarlik, fokuslanish
        emotionalTone = "tayorgarlikka undovchi, fokusli";
        systemPrompt = `Sen motivatsion xabarlar yozuvchi yordamchisan. Vaqt yaqinlashmoqda, foydalanuvchiga tayorgarlik ko'rish va muhim ishlarga e'tibor qaratishni tavsiya qil. O'zbek tilida yoz. 2-3 gap.`;
      } else if (daysLeft > 3) {
        // 3-10 kun: Dalda berish, hayajonlanmaslik, tinchlik
        emotionalTone = "tinchlantiruvchi, dalda beruvchi, ishonch beruvchi";
        systemPrompt = `Sen motivatsion xabarlar yozuvchi yordamchisan. Vaqt kam, lekin foydalanuvchiga HAYAJONLANMASLIK, tinch qolish va o'ziga ishonishni ayt. "Tashvishlanmang", "Hammasi yaxshi bo'ladi", "Siz tayyorsiz" kabi gaplar ishlatib, xotirjam tinchlantiruvchi xabar yoz. O'zbek tilida yoz. 2-3 gap.`;
      } else if (daysLeft >= 1) {
        // 1-3 kun: Kuchli dalda, ishonch, tinchlantirish
        emotionalTone = "kuchli ishonch beruvchi, tinchlantiruvchi, qo'llab-quvvatlovchi";
        systemPrompt = `Sen motivatsion xabarlar yozuvchi yordamchisan. Muhim kun juda yaqin! Foydalanuvchiga KUCHLI DALDA ber, hayajonlanmaslik va tinchlik haqida ayt. "Siz bunga tayyorsiz", "Qo'rqmang", "O'zingizga ishoning", "Hammasi joyida bo'ladi" kabi gaplar bilan kuchli qo'llab-quvvatlovchi xabar yoz. O'zbek tilida yoz. 2-3 gap.`;
      } else {
        // 0 kun yoki manfiy (bu holatda bu funksiya chaqirilmasligi kerak)
        emotionalTone = "tabriklash, xursandchilik";
        systemPrompt = `Sen motivatsion xabarlar yozuvchi yordamchisan. Bugun muhim kun! Foydalanuvchini tabriklab, omad tilab qisqa xabar yoz. O'zbek tilida yoz. 1-2 gap.`;
      }

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Foydalanuvchi: ${name}
Qolgan kunlar: ${daysLeft} kun
Muhim kun sababi: ${reason}

Yuqoridagi ma'lumotlarga asoslanib, foydalanuvchiga ${emotionalTone} xabar yoz. Xabar "${reason}" ga bevosita bog'liq va ma'noli bo'lishi kerak.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.8,
      });

      return response.choices[0]?.message?.content || "Omad tilaymiz! 💪";
    } catch (error) {
      console.error("OpenAI error:", error);
      
      // Xatolik bo'lsa, qolgan kunlarga qarab statik xabar qaytarish
      if (daysLeft > 30) {
        return "Vaqtingiz ko'p, bosqichma-bosqich tayyorgarlik ko'ring! 💪";
      } else if (daysLeft > 10) {
        return "Muhim ishlarga e'tibor qiling, siz uddalaysiz! 🎯";
      } else if (daysLeft > 3) {
        return "Tinch bo'ling, siz yaxshi tayyorsiz. Hayajonlanmang! 😊";
      } else if (daysLeft >= 1) {
        return "O'zingizga ishoning! Siz bunga tayyorsiz, hammasi yaxshi bo'ladi! 💪🌟";
      } else {
        return "Bugun sizning kuningiz! Omad yor bo'lsin! 🎉";
      }
    }
  }
}
