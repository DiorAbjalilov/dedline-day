import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Deadline Reminder Bot API")
    .setDescription("API for viewing bot users and deadlines")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Bot ishga tushdi
  console.log("🤖 Telegram Bot ishga tushdi!");
  console.log("📚 Swagger: http://localhost:3000/api");

  await app.listen(3000);
}

bootstrap();
