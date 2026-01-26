import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";

export interface User {
  chat_id: number;
  name: string;
  target_date: string;
  reason: string;
  created_at: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const databaseUrl = this.configService.get<string>("DATABASE_URL");
    
    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl?.includes("railway") || databaseUrl?.includes("postgres://")
        ? { rejectUnauthorized: false }
        : false,
    });

    this.initTables();
  }

  onModuleDestroy() {
    this.pool.end();
  }

  private async initTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        chat_id BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        target_date TEXT NOT NULL,
        reason TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async createUser(
    chatId: number,
    name: string,
    targetDate: string,
    reason: string,
  ): Promise<void> {
    await this.pool.query(
      `INSERT INTO users (chat_id, name, target_date, reason)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (chat_id) 
       DO UPDATE SET name = $2, target_date = $3, reason = $4`,
      [chatId, name, targetDate, reason],
    );
  }

  async getUser(chatId: number): Promise<User | undefined> {
    const result = await this.pool.query(
      "SELECT * FROM users WHERE chat_id = $1",
      [chatId],
    );
    return result.rows[0];
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.pool.query("SELECT * FROM users");
    return result.rows;
  }

  async updateUserState(chatId: number, data: Partial<User>): Promise<void> {
    const user = await this.getUser(chatId);
    if (user) {
      await this.pool.query(
        `UPDATE users SET name = $1, target_date = $2, reason = $3
         WHERE chat_id = $4`,
        [
          data.name || user.name,
          data.target_date || user.target_date,
          data.reason || user.reason,
          chatId,
        ],
      );
    }
  }

  async deleteUser(chatId: number): Promise<void> {
    await this.pool.query("DELETE FROM users WHERE chat_id = $1", [chatId]);
  }
}
