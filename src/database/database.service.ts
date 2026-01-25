import { Injectable, OnModuleInit } from "@nestjs/common";
import Database from "better-sqlite3";

export interface User {
  chat_id: number;
  name: string;
  target_date: string;
  reason: string;
  created_at: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Database.Database;

  onModuleInit() {
    this.db = new Database("bot.db");
    this.initTables();
  }

  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        chat_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        target_date TEXT NOT NULL,
        reason TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  createUser(
    chatId: number,
    name: string,
    targetDate: string,
    reason: string,
  ): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO users (chat_id, name, target_date, reason)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(chatId, name, targetDate, reason);
  }

  getUser(chatId: number): User | undefined {
    const stmt = this.db.prepare("SELECT * FROM users WHERE chat_id = ?");
    return stmt.get(chatId) as User | undefined;
  }

  getAllUsers(): User[] {
    const stmt = this.db.prepare("SELECT * FROM users");
    return stmt.all() as User[];
  }

  updateUserState(chatId: number, data: Partial<User>): void {
    const user = this.getUser(chatId);
    if (user) {
      const stmt = this.db.prepare(`
        UPDATE users SET name = ?, target_date = ?, reason = ?
        WHERE chat_id = ?
      `);
      stmt.run(
        data.name || user.name,
        data.target_date || user.target_date,
        data.reason || user.reason,
        chatId,
      );
    }
  }

  deleteUser(chatId: number): void {
    const stmt = this.db.prepare("DELETE FROM users WHERE chat_id = ?");
    stmt.run(chatId);
  }
}
