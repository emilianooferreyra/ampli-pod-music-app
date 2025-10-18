# Migration Plan: Express + MongoDB → Hono + Drizzle + Postgres

## Overview

This document outlines the migration strategy from the current tech stack to a modern, type-safe alternative.

**Current Stack:**
- Express.js
- MongoDB + Mongoose
- Multer for file uploads
- JWT auth

**Target Stack:**
- Hono.js
- PostgreSQL + Drizzle ORM
- Native Hono file uploads
- JWT auth (maintained)

---

## Table of Contents

1. [Why Migrate?](#why-migrate)
2. [Migration Strategy](#migration-strategy)
3. [File Upload Solution](#file-upload-solution)
4. [Step-by-Step Plan](#step-by-step-plan)
5. [Code Examples](#code-examples)
6. [Risk Assessment](#risk-assessment)

---

## Why Migrate?

### Benefits of Hono

- **Better TypeScript Support**: Full type inference across the stack
- **Runtime Agnostic**: Works on Node.js, Bun, Deno, Cloudflare Workers
- **Performance**: Significantly faster than Express
- **Modern API**: Cleaner, more intuitive API design
- **RPC Support**: Type-safe API calls between frontend/backend
- **Growing Ecosystem**: Official middleware packages (@hono/zod-validator, @hono/jwt, etc.)

### Benefits of Drizzle + Postgres

- **Type Safety**: Full TypeScript support with schema inference
- **SQL Transparency**: Write SQL-like queries with type safety
- **Better Relations**: First-class support for foreign keys and joins
- **Transactions**: Built-in transaction support
- **Migrations**: Better migration tooling
- **Standard SQL**: More predictable and portable than MongoDB

### Estimated Time

- **Incremental Approach**: 3-4 weeks
- **Full Rewrite**: 2-3 weeks (higher risk)

---

## Migration Strategy

### Recommended: Incremental Migration (Lower Risk)

**Phase 1: Express → Hono (Week 1-2)**
1. Keep MongoDB/Mongoose
2. Migrate routes one by one
3. Adapt middlewares to Hono context
4. Test each route thoroughly

**Phase 2: MongoDB → Postgres + Drizzle (Week 3-4)**
1. Design Postgres schema based on Mongoose models
2. Set up Drizzle
3. Migrate models one by one
4. Run both databases in parallel during transition
5. Migrate data
6. Remove MongoDB dependency

**Advantages:**
- Lower risk - easier to debug issues
- Can deploy Phase 1 before starting Phase 2
- Team can learn gradually
- Easier to rollback if needed

### Alternative: Full Rewrite (Higher Risk)

Rewrite from scratch with new tech stack, then migrate data at the end.

**Advantages:**
- Cleaner code, no legacy patterns
- Faster overall completion

**Disadvantages:**
- Higher risk of bugs
- Harder to test incrementally
- Cannot deploy until fully complete

---

## File Upload Solution

### The Multer "Problem"

Multer is Express-specific and doesn't work directly with Hono because:
- Depends on Express `req/res` objects
- Hono uses its own context system (`c`)
- Hono is runtime-agnostic, Multer is Node.js specific

### Solution: Hono Native API (Recommended)

Hono has **built-in file upload support** - no Multer needed!

**Current approach (Express + Multer):**
```typescript
// middleware/fileParser.ts
const storage = multer.memoryStorage()
const upload = multer({ storage })

const fileParser: RequestHandler = (req, res, next) => {
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "poster", maxCount: 1 }
  ])(req, res, (err) => {
    if (err) return res.status(422).json({ error: err.message })
    next()
  })
}

// controller/audio.ts
const files = req.files as { [fieldname: string]: Express.Multer.File[] }
const audioFile = files.file?.[0]
const posterFile = files.poster?.[0]

const audioBuffer = audioFile.buffer
```

**New approach (Hono native):**
```typescript
// No middleware needed!

// routes/audio.ts
app.post('/audio/create', async (c) => {
  const body = await c.req.parseBody() // Built-in!

  const audioFile = body['file'] as File
  const posterFile = body['poster'] as File | undefined

  if (!audioFile) {
    return c.json({ error: 'Audio file is missing!' }, 422)
  }

  // Convert to Buffer for Cloudinary
  const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
  const posterBuffer = posterFile
    ? Buffer.from(await posterFile.arrayBuffer())
    : null

  // Rest of your Cloudinary code works the same!
})
```

**Key differences:**
- ✅ No middleware needed - Hono handles it natively
- ✅ Uses standard Web API (File, FormData)
- ✅ Less code
- ✅ Works in all runtimes
- ✅ Cloudinary integration is identical

### Alternative Options

#### Option 2: hono-multer (Community Package)

```bash
npm install hono-multer
```

```typescript
import { multer } from 'hono-multer'

const upload = multer({ storage: multer.memoryStorage() })

app.post('/audio/create',
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
  ]),
  async (c) => {
    const files = c.req.files
    // Similar API to Express multer
  }
)
```

**Pros:** Familiar API
**Cons:** Community maintained, not official

#### Option 3: Cloud Upload Service (Modern)

Services like UploadThing, Uploadcare provide direct-to-cloud uploads:

```typescript
import { createUploadthing } from 'uploadthing/server'

const f = createUploadthing()

const uploadRouter = {
  audioUploader: f({
    audio: { maxFileSize: "50MB" },
    image: { maxFileSize: "4MB" }
  })
  .middleware(async ({ req }) => {
    const user = await authenticate(req)
    return { userId: user.id }
  })
  .onUploadComplete(async ({ metadata, file }) => {
    await saveAudio({
      userId: metadata.userId,
      fileUrl: file.url
    })
  })
}
```

**Pros:** Managed service, includes CDN
**Cons:** External dependency, potential cost

---

## Step-by-Step Plan

### Phase 1: Express → Hono Migration

#### Week 1: Setup & Core Routes

**Day 1-2: Project Setup**
- [ ] Install Hono dependencies
  ```bash
  npm install hono @hono/node-server
  npm install -D @hono/zod-validator
  ```
- [ ] Create new Hono app alongside Express (run on different port)
- [ ] Set up basic Hono server structure
- [ ] Configure TypeScript for Hono

**Day 3-4: Migrate Middleware**
- [ ] Convert `requireAuth` middleware
  ```typescript
  // Before (Express)
  export const requireAuth: RequestHandler = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1]
    // ... verification
    req.user = userData
    next()
  }

  // After (Hono)
  export const requireAuth = async (c: Context, next: Next) => {
    const token = c.req.header('authorization')?.split("Bearer ")[1]
    // ... verification
    c.set('user', userData)
    await next()
  }
  ```
- [ ] Convert `isAuth` middleware
- [ ] Convert `isVerified` middleware
- [ ] Convert `isValidPassResetToken` middleware
- [ ] Create Zod validators from validation schemas

**Day 5: Test Basic Auth Routes**
- [ ] Migrate `/auth/create` (signup)
- [ ] Migrate `/auth/sign-in`
- [ ] Migrate `/auth/verify-email`
- [ ] Test all auth flows
- [ ] Verify JWT token generation/validation

#### Week 2: Remaining Routes

**Day 1-2: Profile Routes**
- [ ] Migrate `/profile/uploads`
- [ ] Migrate `/profile/info/:profileId`
- [ ] Migrate `/profile/followers`
- [ ] Migrate `/profile/followings`
- [ ] Migrate `/profile/update-follower/:profileId`
- [ ] Test follower/following functionality

**Day 3: Audio Routes (with file upload)**
- [ ] Migrate `/audio/create` with native Hono file upload
- [ ] Migrate `/audio/:audioId` (update)
- [ ] Migrate `/audio/latest`
- [ ] Test Cloudinary integration
- [ ] Verify audio upload/update flows

**Day 4: Playlist & History Routes**
- [ ] Migrate all `/playlist/*` routes
- [ ] Migrate all `/history/*` routes
- [ ] Test playlist creation/update
- [ ] Test history tracking

**Day 5: Final Routes & Testing**
- [ ] Migrate `/favorite/*` routes
- [ ] Complete integration testing
- [ ] Performance testing
- [ ] Fix any bugs

**Deployment:**
- [ ] Deploy Hono version
- [ ] Monitor for issues
- [ ] Remove Express code

---

### Phase 2: MongoDB → Postgres + Drizzle Migration

#### Week 3: Schema Design & Setup

**Day 1-2: Postgres Schema Design**
- [ ] Design `users` table
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    avatar_public_id TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] Design `audios` table with foreign key to users
- [ ] Design `playlists` table
- [ ] Design `email_verification_tokens` table
- [ ] Design `password_reset_tokens` table
- [ ] Design junction tables:
  - `user_followers` (many-to-many)
  - `user_favorites` (many-to-many)
  - `playlist_audios` (many-to-many)

**Day 3: Drizzle Setup**
- [ ] Install Drizzle
  ```bash
  npm install drizzle-orm pg
  npm install -D drizzle-kit
  ```
- [ ] Configure `drizzle.config.ts`
- [ ] Create schema files in `src/db/schema/`
- [ ] Generate initial migration
- [ ] Run migration on local Postgres

**Day 4-5: Create Drizzle Models**
- [ ] Define User schema
  ```typescript
  export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    verified: boolean('verified').default(false),
    avatarUrl: text('avatar_url'),
    avatarPublicId: text('avatar_public_id'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  })
  ```
- [ ] Define Audio schema with relations
- [ ] Define Playlist schema with relations
- [ ] Define Token schemas
- [ ] Define junction tables with relations
- [ ] Test schema generation

#### Week 4: Data Migration & Queries

**Day 1-2: Migrate Core Models**
- [ ] Replace User model queries
  - `User.findOne()` → `db.select().from(users).where()`
  - `User.create()` → `db.insert(users).values()`
  - `User.findByIdAndUpdate()` → `db.update(users).set().where()`
- [ ] Replace Auth controller queries
- [ ] Replace Profile controller queries
- [ ] Test user operations

**Day 3: Migrate Audio & Playlist**
- [ ] Replace Audio model queries
- [ ] Replace Playlist model queries
- [ ] Convert MongoDB aggregations to SQL joins
  ```typescript
  // Before (MongoDB)
  Audio.aggregate([
    { $match: { owner: userId } },
    { $lookup: { from: 'users', localField: 'owner', foreignField: '_id' } }
  ])

  // After (Drizzle)
  db.select()
    .from(audios)
    .leftJoin(users, eq(audios.ownerId, users.id))
    .where(eq(audios.ownerId, userId))
  ```
- [ ] Test audio/playlist operations

**Day 4: Migrate History & Favorites**
- [ ] Replace History model queries
- [ ] Replace Favorite model queries
- [ ] Handle many-to-many relations
- [ ] Test history tracking
- [ ] Test favorites functionality

**Day 5: Data Migration & Cleanup**
- [ ] Write data migration script
  ```typescript
  // scripts/migrate-data.ts
  // Read from MongoDB
  // Transform data
  // Insert into Postgres
  ```
- [ ] Run data migration
- [ ] Verify data integrity
- [ ] Remove MongoDB/Mongoose dependencies
- [ ] Update environment variables
- [ ] Final testing

**Deployment:**
- [ ] Set up Postgres database (production)
- [ ] Run migrations
- [ ] Migrate production data
- [ ] Deploy new version
- [ ] Monitor closely

---

## Code Examples

### Complete Route Comparison

#### Express Version (Current)

```typescript
// routers/audio.ts
import { Router } from "express"
import fileParser from "@/middleware/fileParser"
import { createAudio, updateAudio, getLatestUploads } from "@/controllers/audio"
import { isVerified, requireAuth } from "@/middleware/auth"
import { validate } from "@/middleware/validator"
import { AudioValidationSchema } from "@/utils/validation-schema"

const router = Router()

router.post(
  "/create",
  requireAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  createAudio
)

export default router

// controllers/audio.ts
export const createAudio: RequestHandler = async (req: CreateAudioRequest, res) => {
  const { title, about, category } = req.body
  const ownerId = req.user.id

  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const audioFile = files.file?.[0]
  const posterFile = files.poster?.[0]

  if (!audioFile)
    return res.status(422).json({ error: "Audio file is missing!" })

  const audioRes = await cloudinary.uploader.upload(
    `data:${audioFile.mimetype};base64,${audioFile.buffer.toString("base64")}`,
    { resource_type: "video" }
  )

  const newAudio = new Audio({
    title,
    about,
    category,
    owner: ownerId,
    file: { url: audioRes.secure_url, publicId: audioRes.public_id },
  })

  if (posterFile) {
    const posterRes = await cloudinary.uploader.upload(
      `data:${posterFile.mimetype};base64,${posterFile.buffer.toString("base64")}`,
      { width: 300, height: 300, crop: "thumb", gravity: "face" }
    )
    newAudio.poster = { url: posterRes.secure_url, publicId: posterRes.public_id }
  }

  await newAudio.save()

  res.status(201).json({
    audio: {
      title,
      about,
      file: newAudio.file.url,
      poster: newAudio.poster?.url,
    },
  })
}
```

#### Hono Version (Target)

```typescript
// routes/audio.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { requireAuth, isVerified } from '@/middleware/auth'
import { AudioValidationSchema } from '@/utils/validation-schema'
import cloudinary from '@/cloud'
import { db } from '@/db'
import { audios } from '@/db/schema'

const app = new Hono()

app.post(
  '/create',
  requireAuth,
  isVerified,
  zValidator('form', AudioValidationSchema),
  async (c) => {
    const { title, about, category } = c.req.valid('form')
    const user = c.get('user')

    // Native file handling - no middleware needed!
    const body = await c.req.parseBody()
    const audioFile = body['file'] as File
    const posterFile = body['poster'] as File | undefined

    if (!audioFile) {
      return c.json({ error: 'Audio file is missing!' }, 422)
    }

    // Convert to Buffer for Cloudinary
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
    const audioRes = await cloudinary.uploader.upload(
      `data:${audioFile.type};base64,${audioBuffer.toString('base64')}`,
      { resource_type: 'video' }
    )

    // Drizzle insert
    const [newAudio] = await db.insert(audios).values({
      title,
      about,
      category,
      ownerId: user.id,
      fileUrl: audioRes.secure_url,
      filePublicId: audioRes.public_id,
    }).returning()

    // Handle poster upload
    if (posterFile) {
      const posterBuffer = Buffer.from(await posterFile.arrayBuffer())
      const posterRes = await cloudinary.uploader.upload(
        `data:${posterFile.type};base64,${posterBuffer.toString('base64')}`,
        { width: 300, height: 300, crop: "thumb", gravity: "face" }
      )

      await db.update(audios)
        .set({
          posterUrl: posterRes.secure_url,
          posterPublicId: posterRes.public_id,
        })
        .where(eq(audios.id, newAudio.id))
    }

    return c.json({
      audio: {
        title: newAudio.title,
        about: newAudio.about,
        file: newAudio.fileUrl,
        poster: newAudio.posterUrl,
      }
    }, 201)
  }
)

export default app
```

### Middleware Conversion

#### Express Middleware

```typescript
// middleware/auth.ts (Express)
import { RequestHandler } from "express"
import { verify } from "jsonwebtoken"
import { JWT_SECRET } from "@/utils/variables"
import User from "@/models/user"

export const requireAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers
  const token = authorization?.split("Bearer ")[1]

  if (!token) {
    return res.status(403).json({ error: "Unauthorized request!" })
  }

  const payload = verify(token, JWT_SECRET) as JwtPayload
  const id = payload.userId

  const user = await User.findOne({ _id: id, tokens: token })
  if (!user) {
    return res.status(403).json({ error: "Unauthorized request!" })
  }

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  }
  req.token = token

  next()
}
```

#### Hono Middleware

```typescript
// middleware/auth.ts (Hono)
import { Context, Next } from 'hono'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '@/utils/variables'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const requireAuth = async (c: Context, next: Next) => {
  const authorization = c.req.header('authorization')
  const token = authorization?.split("Bearer ")[1]

  if (!token) {
    return c.json({ error: "Unauthorized request!" }, 403)
  }

  const payload = verify(token, JWT_SECRET) as JwtPayload
  const userId = payload.userId

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))

  if (!user || !user.tokens.includes(token)) {
    return c.json({ error: "Unauthorized request!" }, 403)
  }

  // Set user in context
  c.set('user', {
    id: user.id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatarUrl,
    followers: user.followersCount, // computed or joined
    followings: user.followingsCount,
  })
  c.set('token', token)

  await next()
}
```

### Database Query Conversion

#### MongoDB/Mongoose → Drizzle

```typescript
// Find one user
// Before
const user = await User.findOne({ email: 'test@example.com' })

// After
const [user] = await db
  .select()
  .from(users)
  .where(eq(users.email, 'test@example.com'))
  .limit(1)

// Create user
// Before
const user = await User.create({ name, email, password })

// After
const [user] = await db
  .insert(users)
  .values({ name, email, password })
  .returning()

// Update user
// Before
await User.findByIdAndUpdate(userId, { verified: true })

// After
await db
  .update(users)
  .set({ verified: true })
  .where(eq(users.id, userId))

// Complex query with relations
// Before (MongoDB aggregate)
const audios = await Audio.aggregate([
  { $match: { owner: userId } },
  { $lookup: {
      from: 'users',
      localField: 'owner',
      foreignField: '_id',
      as: 'owner'
  }},
  { $unwind: '$owner' },
  { $sort: { createdAt: -1 } },
  { $limit: 10 }
])

// After (Drizzle with join)
const audios = await db
  .select({
    id: audios.id,
    title: audios.title,
    fileUrl: audios.fileUrl,
    ownerName: users.name,
    ownerId: users.id,
  })
  .from(audios)
  .leftJoin(users, eq(audios.ownerId, users.id))
  .where(eq(audios.ownerId, userId))
  .orderBy(desc(audios.createdAt))
  .limit(10)
```

---

## Risk Assessment

### High Risk Areas

1. **Data Migration**
   - Risk: Data loss or corruption during MongoDB → Postgres migration
   - Mitigation:
     - Run both databases in parallel during transition
     - Comprehensive testing on staging data
     - Backup MongoDB before migration
     - Write rollback scripts

2. **File Upload Changes**
   - Risk: Breaking existing file upload functionality
   - Mitigation:
     - Test with various file types and sizes
     - Maintain same Cloudinary integration
     - Verify buffer conversion works correctly

3. **Auth Token Validation**
   - Risk: Users getting logged out or unable to authenticate
   - Mitigation:
     - Keep JWT secret and algorithm the same
     - Test token validation thoroughly
     - Have rollback plan ready

### Medium Risk Areas

1. **Complex Aggregations**
   - Risk: MongoDB aggregations may not translate easily to SQL
   - Mitigation:
     - Identify complex queries early
     - Test SQL equivalents thoroughly
     - Consider denormalization if needed

2. **TypeScript Type Changes**
   - Risk: Type errors throughout codebase
   - Mitigation:
     - Fix types incrementally
     - Use `any` temporarily if needed (then fix)
     - Leverage Drizzle's type inference

### Low Risk Areas

1. **Business Logic**
   - Risk: Business logic should be largely unaffected
   - Mitigation: Good separation of concerns helps

2. **Cloudinary Integration**
   - Risk: Minimal - same buffer-based upload
   - Mitigation: Test once, should work everywhere

---

## Rollback Plan

If migration needs to be rolled back:

**Phase 1 Rollback (Hono → Express):**
1. Keep Express code until Hono is proven stable
2. Use feature flags to switch between implementations
3. Revert DNS/routing to Express endpoints

**Phase 2 Rollback (Drizzle → Mongoose):**
1. Keep MongoDB running during initial deployment
2. Have data sync scripts ready
3. Can revert to Mongoose queries quickly

---

## Testing Strategy

### Unit Tests
- [ ] Test individual Drizzle queries
- [ ] Test middleware conversions
- [ ] Test file upload handling
- [ ] Test auth token validation

### Integration Tests
- [ ] Test full API endpoints
- [ ] Test file upload → Cloudinary flow
- [ ] Test auth flows (signup, login, verify)
- [ ] Test playlist/audio operations

### Performance Tests
- [ ] Compare Express vs Hono response times
- [ ] Test database query performance
- [ ] Test file upload performance
- [ ] Load testing with concurrent requests

### Manual Testing
- [ ] Test all endpoints with Postman/Thunder Client
- [ ] Test with frontend application
- [ ] Test edge cases (large files, invalid data, etc.)

---

## Resources

### Documentation
- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Hono File Upload Guide](https://hono.dev/guides/file-uploads)
- [Drizzle Migrations Guide](https://orm.drizzle.team/docs/migrations)

### Useful Packages
- `@hono/node-server` - Run Hono on Node.js
- `@hono/zod-validator` - Zod validation middleware
- `@hono/jwt` - JWT authentication
- `drizzle-orm` - ORM
- `drizzle-kit` - Migration tools
- `pg` - PostgreSQL client

### Community
- [Hono Discord](https://discord.gg/hono)
- [Drizzle Discord](https://discord.gg/drizzle)

---

## Next Steps

1. **Review this plan** with the team
2. **Set up local environment** with Postgres
3. **Create feature branch** for Phase 1
4. **Start with auth middleware** conversion
5. **Test incrementally** at each step

---

## Notes

- Keep this document updated as migration progresses
- Document any issues or blockers encountered
- Add lessons learned for future reference
- Track actual time spent vs. estimates

---

**Document Version:** 1.0
**Last Updated:** 2025-10-18
**Author:** Claude Code Assistant
