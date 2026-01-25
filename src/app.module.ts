import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TelegrafModule } from "nestjs-telegraf";
import { session } from "telegraf";
import { BotModule } from "./bot/bot.module";
import { DatabaseModule } from "./database/database.module";
import { OpenaiModule } from "./openai/openai.module";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>("TELEGRAM_BOT_TOKEN") || "",
        middlewares: [session()],
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    OpenaiModule,
    BotModule,
    SchedulerModule,
    UsersModule,
  ],
})
export class AppModule {}
