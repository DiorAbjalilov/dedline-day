# 🐳 Docker bilan Ishlatish

Bu qo'llanma Docker orqali PostgreSQL ishga tushirishni tushuntiradi.

## Talablar

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) o'rnatilgan bo'lishi kerak
- Docker ishlab turgan bo'lishi kerak

## Tezkor Boshlash

```bash
# 1. PostgreSQL ni ishga tushirish
npm run docker:up

# 2. Botni ishga tushirish
npm run start:dev

# yoki birgalikda:
npm run dev
```

## Docker Buyruqlari

### PostgreSQL ni Ishga Tushirish

```bash
npm run docker:up
# yoki
docker-compose up -d
```

Bu buyruq:
- PostgreSQL 15 konteynerini ishga tushiradi
- Port: `5432`
- Database: `deadline_bot`
- User: `postgres`
- Password: `postgres123`
- Ma'lumotlar saqlangan volume yaratadi

### Status Tekshirish

```bash
docker-compose ps
```

Ko'rinishi:
```
NAME                     STATUS      PORTS
deadline-bot-postgres    Up 2 min    0.0.0.0:5432->5432/tcp
```

### Logs Ko'rish

```bash
npm run docker:logs
# yoki
docker-compose logs -f postgres
```

### PostgreSQL ni To'xtatish

```bash
npm run docker:down
# yoki
docker-compose down
```

**MUHIM**: Bu faqat konteynerni to'xtatadi, ma'lumotlar saqlanadi!

### Ma'lumotlarni O'chirish (Restart from scratch)

```bash
docker-compose down -v
```

**OGOHLANTIRISH**: Bu barcha ma'lumotlarni o'chiradi!

## PostgreSQL ga Ulanish

### Psql orqali (Docker ichida)

```bash
docker exec -it deadline-bot-postgres psql -U postgres -d deadline_bot
```

PostgreSQL shell ochiladi:
```sql
-- Barcha userlarni ko'rish
SELECT * FROM users;

-- User qo'shish (test)
INSERT INTO users (chat_id, name, target_date, reason) 
VALUES (12345, 'Test', '2026-12-31', 'Test sabab');

-- Table strukturasini ko'rish
\d users

-- Chiqish
\q
```

### GUI Tool bilan

**DBeaver, pgAdmin, TablePlus** kabi tool'lardan foydalanish:

```
Host: localhost
Port: 5432
Database: deadline_bot
User: postgres
Password: postgres123
```

## Muammolarni Hal Qilish

### Port band

Agar `5432` port band bo'lsa:

```bash
# Qaysi dastur ishlatayotganini tekshirish
lsof -i :5432

# Eski PostgreSQL to'xtatish (agar o'rnatilgan bo'lsa)
# MacOS
brew services stop postgresql@15

# Linux
sudo systemctl stop postgresql
```

### Konteyner ishlamayapti

```bash
# Logs tekshirish
docker-compose logs postgres

# Konteyner restart qilish
docker-compose restart postgres

# Konteyner rebuild qilish
docker-compose up -d --force-recreate
```

### Ma'lumotlar yo'qoldi

Agar `docker-compose down -v` qilgan bo'lsangiz, volume o'chirilgan.

Volume mavjudligini tekshirish:
```bash
docker volume ls | grep deadline
```

## Environment Variables

`.env` faylingizda:

```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/deadline_bot
```

**Local development uchun** bu sozlamalar yetarli.

**Production (Railway)** uchun Railway o'z `DATABASE_URL` beradi.

## Docker Compose Konfiguratsiya

`docker-compose.yml` fayli:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine          # Yengil versiya
    container_name: deadline-bot-postgres
    restart: unless-stopped            # Avtomatik restart
    environment:
      POSTGRES_DB: deadline_bot        # Database nomi
      POSTGRES_USER: postgres          # User
      POSTGRES_PASSWORD: postgres123   # Parol
    ports:
      - "5432:5432"                    # Port mapping
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persistent storage
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local                      # Local volume driver
```

## Backup & Restore

### Backup

```bash
# Database dump olish
docker exec deadline-bot-postgres pg_dump -U postgres deadline_bot > backup.sql

# Compressed backup
docker exec deadline-bot-postgres pg_dump -U postgres deadline_bot | gzip > backup.sql.gz
```

### Restore

```bash
# SQL fayldan restore
docker exec -i deadline-bot-postgres psql -U postgres deadline_bot < backup.sql

# Compressed fayldan
gunzip -c backup.sql.gz | docker exec -i deadline-bot-postgres psql -U postgres deadline_bot
```

## Production Setup

Production uchun Docker ishlatmang. Railway yoki boshqa cloud provider'dan foydalaning:

- ✅ Railway PostgreSQL
- ✅ Heroku Postgres
- ✅ AWS RDS
- ✅ DigitalOcean Managed PostgreSQL

## Ko'proq Ma'lumot

- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Tezkor Referans

| Buyruq | Tavsif |
|--------|--------|
| `npm run docker:up` | PostgreSQL ishga tushirish |
| `npm run docker:down` | PostgreSQL to'xtatish |
| `npm run docker:logs` | Logs ko'rish |
| `npm run dev` | PostgreSQL + Bot ishga tushirish |
| `docker-compose ps` | Status ko'rish |
| `docker-compose restart postgres` | Restart |
| `docker exec -it deadline-bot-postgres psql -U postgres -d deadline_bot` | PostgreSQL shell |

## Yordam

Agar muammo bo'lsa:
1. Docker Desktop ishlab turganini tekshiring
2. `.env` faylingizda `DATABASE_URL` to'g'ri ekanligini tasdiqlang
3. Logs tekshiring: `npm run docker:logs`
4. Port band emasligini tekshiring: `lsof -i :5432`
