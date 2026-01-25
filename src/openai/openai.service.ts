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
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Sen motivatsion xabarlar yozuvchi yordamchisan. Foydalanuvchi uchun qisqa (2-3 gap), samimiy va ruhlantiruvchi xabar yoz. O'zbek tilida yoz.`,
          },
          {
            role: "user",
            content: `Foydalanuvchi ismi: ${name}
Muhim kunga qolgan kunlar: ${daysLeft} kun
Muhim kun sababi: ${reason}

Foydalanuvchiga qisqa motivatsion xabar yoz.`,
          },
        ],
        max_tokens: 150,
        temperature: 0.8,
      });

      return response.choices[0]?.message?.content || "Omad tilaymiz! 💪";
    } catch (error) {
      console.error("OpenAI error:", error);
      return "Maqsadingizga erishishingizni tilaymiz! 💪";
    }
  }
}
