# Drizzle ORM Schema Examples

Este documento muestra cómo migrar tus modelos de Mongoose a Drizzle ORM. Verás que **no necesitas saber mucho SQL** - Drizzle lo genera automáticamente.

## Comparación: Mongoose vs Drizzle

### Modelo User

#### Mongoose (Actual)
```typescript
// models/user.ts
import { Model, Schema, model } from "mongoose";

export interface UserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: {
    url: string;
    publicId: string;
  };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: Object,
    url: String,
    publicId: String,
  },
  tokens: [String],
  favorites: [{ type: Schema.Types.ObjectId, ref: "Audio" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export const User = model("User", userSchema);
```

#### Drizzle (Futuro)
```typescript
// db/schema/users.ts
import { pgTable, uuid, varchar, boolean, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  // En Drizzle, usas UUID en vez de ObjectId
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  verified: boolean('verified').default(false),

  // Avatar ya no es objeto embebido - son columnas separadas
  avatarUrl: text('avatar_url'),
  avatarPublicId: text('avatar_public_id'),

  // Timestamps automáticos
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tablas separadas para arrays de relaciones (en vez de arrays)
export const userTokens = pgTable('user_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userFollowers = pgTable('user_followers', {
  followerId: uuid('follower_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  followingId: uuid('following_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.followerId, table.followingId] }),
}));

// Type inference automática - obtienes tipos gratis!
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Modelo Audio/Song

#### Mongoose (Actual)
```typescript
// models/audio.ts
export interface AudioDocument {
  _id: ObjectId;
  title: string;
  about: string;
  owner: ObjectId;
  file: {
    url: string;
    publicId: string;
  };
  poster?: {
    url: string;
    publicId: string;
  };
  likes: ObjectId[];
  category: string;
  createdAt: Date;
}

const AudioSchema = new Schema<AudioDocument>({
  title: { type: String, required: true },
  about: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  file: {
    type: Object,
    url: String,
    publicId: String,
    required: true,
  },
  poster: {
    type: Object,
    url: String,
    publicId: String,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  category: { type: String, enum: categories, default: "Others" },
}, { timestamps: true });
```

#### Drizzle (Futuro)
```typescript
// db/schema/songs.ts
import { pgTable, uuid, text, varchar, integer, timestamp, bigint } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const songs = pgTable('songs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  about: text('about').notNull(),
  duration: integer('duration'), // segundos
  category: varchar('category', { length: 50 }).default('Others'),

  // File y poster ya no son objetos - columnas separadas
  fileUrl: text('file_url').notNull(),
  filePublicId: text('file_public_id').notNull(),
  posterUrl: text('poster_url'),
  posterPublicId: text('poster_public_id'),

  // Foreign key al owner
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

  playCount: bigint('play_count', { mode: 'number' }).default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Likes ahora es tabla separada (en vez de array)
export const likes = pgTable('likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  songId: uuid('song_id').references(() => songs.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: un usuario solo puede dar like una vez
  unique: unique().on(table.userId, table.songId),
}));

// Relaciones (opcional pero útil para queries)
export const songsRelations = relations(songs, ({ one, many }) => ({
  owner: one(users, {
    fields: [songs.ownerId],
    references: [users.id],
  }),
  likes: many(likes),
  artistSongs: many(artistSongs),
}));

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;
```

---

## Queries: Mongoose vs Drizzle

### Crear un usuario

#### Mongoose
```typescript
const user = await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: hashedPassword,
});
```

#### Drizzle
```typescript
const [user] = await db.insert(users).values({
  name: "John Doe",
  email: "john@example.com",
  password: hashedPassword,
}).returning();
```

### Buscar un usuario por email

#### Mongoose
```typescript
const user = await User.findOne({ email: "john@example.com" });
```

#### Drizzle
```typescript
import { eq } from 'drizzle-orm';

const user = await db.select()
  .from(users)
  .where(eq(users.email, "john@example.com"))
  .limit(1);
```

### Actualizar un usuario

#### Mongoose
```typescript
await User.findByIdAndUpdate(userId, { verified: true });
```

#### Drizzle
```typescript
await db.update(users)
  .set({ verified: true })
  .where(eq(users.id, userId));
```

### Obtener canciones con información del owner

#### Mongoose (con populate)
```typescript
const audios = await Audio.find()
  .populate('owner', 'name email avatar')
  .sort({ createdAt: -1 })
  .limit(10);
```

#### Drizzle (con JOIN)
```typescript
import { desc } from 'drizzle-orm';

const audios = await db.select({
  id: songs.id,
  title: songs.title,
  fileUrl: songs.fileUrl,
  ownerName: users.name,
  ownerEmail: users.email,
  ownerAvatar: users.avatarUrl,
})
  .from(songs)
  .leftJoin(users, eq(songs.ownerId, users.id))
  .orderBy(desc(songs.createdAt))
  .limit(10);
```

### Contar likes de una canción

#### Mongoose
```typescript
const audio = await Audio.findById(audioId);
const likesCount = audio.likes.length;
```

#### Drizzle
```typescript
import { count } from 'drizzle-orm';

const [result] = await db.select({ count: count() })
  .from(likes)
  .where(eq(likes.songId, songId));

const likesCount = result.count;
```

---

## Configuración de Drizzle

### 1. Instalación

```bash
cd ampli-backend
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg
```

### 2. Archivo de configuración

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/db/schema/*',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 3. Conexión a la base de datos

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Connection pooling
  min: 5,
});

export const db = drizzle(pool, { schema });
```

### 4. Comandos útiles

```json
// package.json scripts
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Uso:**
```bash
# Generar migration SQL desde tu schema TypeScript
pnpm db:generate

# Aplicar migrations a la base de datos
pnpm db:migrate

# Abrir UI visual de tu base de datos
pnpm db:studio
```

---

## Ventajas de Drizzle sobre SQL puro

### ✅ 1. Type Safety
```typescript
// ❌ SQL puro - sin types, fácil equivocarse
const result = await client.query('SELECT * FROM users WHERE email = $1', ['john@example.com']);
const user = result.rows[0]; // any - sin autocomplete

// ✅ Drizzle - types automáticos
const [user] = await db.select().from(users).where(eq(users.email, 'john@example.com'));
// user tiene tipo User completo con autocomplete!
```

### ✅ 2. Autocomplete en el editor
```typescript
await db.select().from(users).where(eq(users.
// Tu editor te sugiere: id, name, email, password, verified, etc.
```

### ✅ 3. Migraciones automáticas
```typescript
// Defines el schema en TypeScript
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }),
});

// Drizzle genera el SQL por ti:
// CREATE TABLE users (
//   id UUID PRIMARY KEY,
//   name VARCHAR(255)
// );
```

### ✅ 4. Queries más legibles
```typescript
// SQL puro
const result = await client.query(`
  SELECT s.*, u.name as owner_name
  FROM songs s
  LEFT JOIN users u ON s.owner_id = u.id
  WHERE s.category = $1
  ORDER BY s.created_at DESC
  LIMIT 10
`, ['Music']);

// Drizzle
const songs = await db.select({
  ...songs,
  ownerName: users.name,
})
  .from(songs)
  .leftJoin(users, eq(songs.ownerId, users.id))
  .where(eq(songs.category, 'Music'))
  .orderBy(desc(songs.createdAt))
  .limit(10);
```

---

## Plan de Migración Recomendado

### Paso 1: Crear schemas de Drizzle (1-2 días)
```bash
src/db/schema/
  ├── users.ts      # User model
  ├── songs.ts      # Audio model
  ├── playlists.ts  # Playlist models
  ├── artists.ts    # Artist model (nuevo)
  └── index.ts      # Export all schemas
```

### Paso 2: Generar y aplicar migrations (1 día)
```bash
pnpm db:generate  # Genera SQL
pnpm db:migrate   # Aplica a DB local
```

### Paso 3: Migrar queries modelo por modelo (1 semana)

**Día 1-2: Auth**
- Migrar User queries en `controllers/auth.ts`
- Migrar token queries

**Día 3-4: Audio**
- Migrar Audio queries en `controllers/audio.ts`
- Migrar likes y favorites

**Día 5: Playlists & History**
- Migrar Playlist queries
- Migrar History queries

**Día 6-7: Testing & Fixes**

### Paso 4: Migrar datos de MongoDB a PostgreSQL (1 día)
```typescript
// scripts/migrate-data.ts
import { connectMongo } from './old-db';
import { db } from './src/db';

// 1. Leer todos los users de MongoDB
const mongoUsers = await User.find();

// 2. Insertar en PostgreSQL
for (const mongoUser of mongoUsers) {
  await db.insert(users).values({
    id: uuidFromObjectId(mongoUser._id),
    name: mongoUser.name,
    email: mongoUser.email,
    password: mongoUser.password,
    verified: mongoUser.verified,
    avatarUrl: mongoUser.avatar?.url,
    avatarPublicId: mongoUser.avatar?.publicId,
  });
}
```

---

## Recursos de Aprendizaje

### Documentación Oficial
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview) - Muy clara y con ejemplos
- [Drizzle Quick Start](https://orm.drizzle.team/docs/quick-start) - Tutorial paso a paso

### Video Tutorials (Recomendados)
- [Drizzle Crash Course - Web Dev Simplified](https://www.youtube.com/watch?v=5pqGmL0Kzyc)
- [Drizzle ORM - Theo](https://www.youtube.com/watch?v=_SLxGYzv6jo)

### Comunidad
- [Drizzle Discord](https://discord.gg/drizzle) - Muy activa, responden rápido
- [GitHub Discussions](https://github.com/drizzle-team/drizzle-orm/discussions)

---

## Cheat Sheet: Operadores comunes

```typescript
import { eq, ne, gt, gte, lt, lte, like, ilike, inArray, isNull, isNotNull, and, or, desc, asc } from 'drizzle-orm';

// Igualdad
.where(eq(users.email, 'john@example.com'))

// Diferente
.where(ne(users.verified, true))

// Mayor que / Menor que
.where(gt(songs.playCount, 1000))
.where(lte(users.createdAt, new Date()))

// LIKE (búsqueda parcial)
.where(like(songs.title, '%love%'))
.where(ilike(users.name, '%john%')) // case-insensitive

// IN (múltiples valores)
.where(inArray(songs.category, ['Music', 'Podcast']))

// NULL checks
.where(isNull(users.avatarUrl))
.where(isNotNull(songs.posterUrl))

// Múltiples condiciones (AND)
.where(and(
  eq(users.verified, true),
  gt(songs.playCount, 100)
))

// Múltiples condiciones (OR)
.where(or(
  eq(songs.category, 'Music'),
  eq(songs.category, 'Podcast')
))

// Ordenamiento
.orderBy(desc(songs.createdAt))
.orderBy(asc(users.name))
```

---

## Conclusión

**No necesitas ser experto en SQL para usar Drizzle.** Si sabes TypeScript y ya trabajas con Mongoose, la transición será **más fácil de lo que piensas**.

Drizzle es como "Mongoose pero para PostgreSQL" - defines schemas en TypeScript, haces queries con métodos encadenados, y obtienes type-safety automático.

**Lo mejor:** Cuando generas migrations con `pnpm db:generate`, Drizzle crea el SQL por ti. Puedes revisar el SQL generado para aprender, pero no necesitas escribirlo manualmente.

---

**Siguiente paso:** Cuando estés listo para empezar, avísame y te ayudo a crear el primer schema de Drizzle para el modelo User.
