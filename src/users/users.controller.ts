import { Controller, Get, Delete, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { DatabaseService, User } from "../database/database.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private databaseService: DatabaseService) {}

  @Get()
  @ApiOperation({ summary: "Barcha userlarni olish" })
  @ApiResponse({
    status: 200,
    description: "Userlar ro'yxati",
  })
  async getAllUsers(): Promise<User[]> {
    return await this.databaseService.getAllUsers();
  }

  @Get(":chatId")
  @ApiOperation({ summary: "Bitta userni olish" })
  @ApiParam({ name: "chatId", description: "Telegram chat ID" })
  @ApiResponse({
    status: 200,
    description: "User ma'lumotlari",
  })
  async getUser(@Param("chatId", ParseIntPipe) chatId: number): Promise<User | undefined> {
    return await this.databaseService.getUser(chatId);
  }

  @Delete(":chatId")
  @ApiOperation({ summary: "Userni o'chirish" })
  @ApiParam({ name: "chatId", description: "Telegram chat ID" })
  @ApiResponse({
    status: 200,
    description: "User o'chirildi",
  })
  async deleteUser(@Param("chatId", ParseIntPipe) chatId: number): Promise<{
    message: string;
  }> {
    await this.databaseService.deleteUser(chatId);
    return { message: `User ${chatId} o'chirildi` };
  }
}
