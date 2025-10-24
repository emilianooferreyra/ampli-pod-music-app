# Scalability Roadmap

This document analyzes Ampli's current architecture against industry-standard streaming platform best practices and provides a roadmap for achieving production-scale reliability and performance.

## Executive Summary

Ampli's current architecture is **well-founded for MVP stage** but requires strategic improvements for production scale. The core patterns are solid, but critical scalability and reliability components need implementation.

---

## ✅ Current Architecture Strengths

### 1. Core Architecture Patterns

**Layered Architecture**

- ✅ Stateless API servers (Express.js)
- ✅ Separate metadata storage (MongoDB)
- ✅ Cloud-based file storage (Cloudinary)
- ✅ JWT-based authentication

**API Design**

- ✅ RESTful endpoint structure
- ✅ Request validation with Zod
- ✅ Authentication middleware (`mustAuth`)
- ✅ Proper separation of concerns (controllers, models, routers)

**Data Models**

- ✅ Clear separation: metadata in DB, audio files in cloud storage
- ✅ Similar entities: Users, Audio/Songs, Playlists, History
- ✅ Relationship patterns: followers/followings, audio ownership, playlist visibility
- ✅ Favorites and recommendation system foundations

**Storage Strategy**

- ✅ Immutable audio files in cloud storage
- ✅ Metadata in relational-like structure (Mongoose schemas)
- ✅ Organized file paths by artist/album/song pattern

---

## ⚠️ Critical Gaps vs Industry Standards

### 1. Content Delivery & Streaming

| Feature                | Industry Standard                       | Ampli Current                 | Priority  |
| ---------------------- | --------------------------------------- | ----------------------------- | --------- |
| **CDN Caching**        | ✅ LRU eviction for popular content     | ❌ Direct Cloudinary delivery | 🔴 HIGH   |
| **Adaptive Streaming** | ✅ HLS/DASH with auto bitrate switching | ❌ Single stream delivery     | 🟡 MEDIUM |
| **Multiple Bitrates**  | ✅ 64kbps, 128kbps, 320kbps versions    | ❌ Single quality upload      | 🔴 HIGH   |
| **Signed URLs**        | ✅ Expiring URLs (few hours)            | ❌ Public URLs                | 🔴 HIGH   |
| **Range Requests**     | ✅ HTTP range support                   | ⚠️ Depends on Cloudinary      | 🟢 LOW    |

**Impact**: Without CDN and multiple bitrates, users on slow connections will have poor experience, and bandwidth costs will be unnecessarily high.

### 2. Scalability Infrastructure

| Component                | Industry Standard                           | Ampli Current                       | Priority  |
| ------------------------ | ------------------------------------------- | ----------------------------------- | --------- |
| **Load Balancer**        | ✅ With health checks every 30s             | ❌ Single instance                  | 🟡 MEDIUM |
| **Database Replication** | ✅ Leader-follower (writes/reads separated) | ❌ Single MongoDB instance          | 🟡 MEDIUM |
| **Horizontal Scaling**   | ✅ Stateless API servers                    | ⚠️ Architecture ready, not deployed | 🟢 LOW    |
| **Database Sharding**    | ✅ Geographic sharding at scale             | ❌ Not planned                      | 🟢 LOW    |

**Impact**: Current setup can handle ~100-500 concurrent users. Beyond that, you'll hit database and single-point-of-failure bottlenecks.

### 3. Reliability & Resilience

| Pattern                | Industry Standard            | Ampli Current               | Priority  |
| ---------------------- | ---------------------------- | --------------------------- | --------- |
| **Circuit Breakers**   | ✅ For database connections  | ❌ Not implemented          | 🟡 MEDIUM |
| **Connection Pooling** | ✅ Explicit configuration    | ⚠️ Default Mongoose pooling | 🟡 MEDIUM |
| **Retry Logic**        | ✅ Exponential backoff       | ❌ Not implemented          | 🟡 MEDIUM |
| **Health Checks**      | ✅ Every 30s with monitoring | ⚠️ Basic endpoint exists    | 🟢 LOW    |
| **Fallback Responses** | ✅ For non-critical failures | ❌ Not implemented          | 🟢 LOW    |

**Impact**: Service disruptions will cause complete failures instead of graceful degradation. No automatic recovery from transient errors.

### 4. Security (As noted in ARCHITECTURE.md)

| Feature                        | Industry Standard        | Ampli Current                            | Priority  |
| ------------------------------ | ------------------------ | ---------------------------------------- | --------- |
| **Rate Limiting**              | ✅ On all auth endpoints | ❌ Not implemented                       | 🔴 HIGH   |
| **CORS Configuration**         | ✅ Properly configured   | ❌ Not configured                        | 🔴 HIGH   |
| **Security Headers**           | ✅ Helmet or equivalent  | ❌ Not implemented                       | 🔴 HIGH   |
| **NoSQL Injection Protection** | ✅ Sanitization          | ⚠️ Zod validation helps but not complete | 🟡 MEDIUM |
| **Request Logging**            | ✅ Comprehensive         | ❌ Basic error logging only              | 🟢 LOW    |
| **Environment Validation**     | ✅ On startup            | ❌ Not validated                         | 🟡 MEDIUM |

**Impact**: Vulnerable to brute force attacks, CSRF, XSS, and injection attacks. Not production-ready from security standpoint.

---

## 📋 Production-Scale Architecture Roadmap

### Phase 1: Security Hardening (Week 1-2) 🔴 CRITICAL

**Goal**: Make the platform production-safe from security threats.

**Implementation**:

1. **Rate Limiting**

   ```typescript
   // middleware/rateLimiter.ts
   import rateLimit from "express-rate-limit";

   export const authLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // 5 attempts per window
     message: "Too many authentication attempts, please try again later",
     standardHeaders: true,
     legacyHeaders: false,
   });

   export const apiLimiter = rateLimit({
     windowMs: 1 * 60 * 1000, // 1 minute
     max: 100, // 100 requests per minute
     message: "Too many requests, please slow down",
   });
   ```

2. **CORS Configuration**

   ```typescript
   // middleware/cors.ts
   import cors from "cors";

   export const corsOptions = cors({
     origin: process.env.ALLOWED_ORIGINS?.split(",") || [
       "http://localhost:3000",
     ],
     credentials: true,
     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
     allowedHeaders: ["Content-Type", "Authorization"],
   });
   ```

3. **Security Headers (Helmet)**

   ```typescript
   // middleware/security.ts
   import helmet from "helmet";

   export const securityHeaders = helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         imgSrc: ["'self'", "https://res.cloudinary.com"],
         mediaSrc: ["'self'", "https://res.cloudinary.com"],
       },
     },
     crossOriginEmbedderPolicy: false,
   });
   ```

4. **Environment Validation**

   ```typescript
   // utils/validateEnv.ts
   import { z } from "zod";

   const envSchema = z.object({
     MONGO_URI: z.string().url(),
     JWT_SECRET: z.string().min(32),
     CLOUDINARY_NAME: z.string(),
     CLOUDINARY_KEY: z.string(),
     CLOUDINARY_SECRET: z.string(),
     MAILTRAP_USER: z.string(),
     MAILTRAP_PASS: z.string(),
     NODE_ENV: z.enum(["development", "production", "test"]),
   });

   export function validateEnv() {
     try {
       envSchema.parse(process.env);
     } catch (error) {
       console.error("❌ Invalid environment variables:", error);
       process.exit(1);
     }
   }
   ```

**Success Metrics**:

- Rate limiting active on all auth endpoints
- CORS properly configured for frontend domain
- All security headers present in responses
- Environment validated on startup

---

### Phase 2: Content Delivery Optimization (Month 1-2) 🔴 HIGH

**Goal**: Reduce bandwidth costs and improve playback experience.

**Implementation**:

1. **Multiple Bitrate Storage**

   ```typescript
   // Update Audio model to store multiple versions
   interface AudioDocument {
     // ... existing fields
     files: {
       original: { url: string; publicId: string };
       high: { url: string; publicId: string; bitrate: 320 }; // 320kbps
       medium: { url: string; publicId: string; bitrate: 128 }; // 128kbps
       low: { url: string; publicId: string; bitrate: 64 }; // 64kbps
     };
   }
   ```

2. **Cloudinary Transformations**

   ```typescript
   // controllers/audio.ts - createAudio function
   const uploadVariants = async (audioFile: Express.Multer.File) => {
     const qualities = [
       { quality: "high", bitrate: "320k" },
       { quality: "medium", bitrate: "128k" },
       { quality: "low", bitrate: "64k" },
     ];

     const uploads = qualities.map(({ quality, bitrate }) =>
       cloudinary.uploader.upload(audioFile.path, {
         resource_type: "video",
         folder: "audio-files",
         audio_codec: "mp3",
         audio_frequency: 44100,
         bit_rate: bitrate,
       })
     );

     return Promise.all(uploads);
   };
   ```

3. **Signed URL Generation**

   ```typescript
   // utils/cloudinary.ts
   import { cloudinary } from "@/cloud";

   export function generateSignedUrl(publicId: string, expiresIn = 3600) {
     const timestamp = Math.round(Date.now() / 1000) + expiresIn;

     return cloudinary.url(publicId, {
       resource_type: "video",
       sign_url: true,
       type: "authenticated",
       expires_at: timestamp,
     });
   }
   ```

4. **Client-Side Quality Selection**

   ```typescript
   // New endpoint: GET /api/audio/:id/stream?quality=medium
   router.get("/:id/stream", mustAuth, async (req, res) => {
     const { id } = req.params;
     const quality = req.query.quality || "medium";

     const audio = await Audio.findById(id);
     const signedUrl = generateSignedUrl(audio.files[quality].publicId);

     res.json({ url: signedUrl });
   });
   ```

**Success Metrics**:

- Audio files stored in 3 bitrates
- Signed URLs expire after 1 hour
- Client can request quality preference
- 30-50% reduction in bandwidth costs

---

### Phase 3: Database & Connection Reliability (Month 2-3) 🟡 MEDIUM

**Goal**: Prevent database bottlenecks and improve error recovery.

**Implementation**:

1. **Explicit Connection Pooling**

   ```typescript
   // db/index.ts
   import mongoose from "mongoose";

   export const connectDB = async () => {
     await mongoose.connect(process.env.MONGO_URI!, {
       maxPoolSize: 10, // Maximum 10 connections
       minPoolSize: 5, // Minimum 5 connections
       serverSelectionTimeoutMS: 5000,
       socketTimeoutMS: 45000,
     });

     console.log("✅ Database connected with pooling");
   };
   ```

2. **Circuit Breaker Pattern**

   ```typescript
   // utils/circuitBreaker.ts
   class CircuitBreaker {
     private failures = 0;
     private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
     private nextAttempt = Date.now();

     constructor(private threshold = 5, private timeout = 60000) {}

     async execute<T>(fn: () => Promise<T>): Promise<T> {
       if (this.state === "OPEN") {
         if (Date.now() < this.nextAttempt) {
           throw new Error("Circuit breaker is OPEN");
         }
         this.state = "HALF_OPEN";
       }

       try {
         const result = await fn();
         this.onSuccess();
         return result;
       } catch (error) {
         this.onFailure();
         throw error;
       }
     }

     private onSuccess() {
       this.failures = 0;
       this.state = "CLOSED";
     }

     private onFailure() {
       this.failures++;
       if (this.failures >= this.threshold) {
         this.state = "OPEN";
         this.nextAttempt = Date.now() + this.timeout;
       }
     }
   }

   export const dbCircuitBreaker = new CircuitBreaker(5, 60000);
   ```

3. **Retry Logic with Exponential Backoff**

   ```typescript
   // utils/retry.ts
   export async function retryWithBackoff<T>(
     fn: () => Promise<T>,
     maxRetries = 3,
     baseDelay = 1000
   ): Promise<T> {
     for (let attempt = 0; attempt < maxRetries; attempt++) {
       try {
         return await fn();
       } catch (error) {
         if (attempt === maxRetries - 1) throw error;

         const delay = baseDelay * Math.pow(2, attempt);
         await new Promise((resolve) => setTimeout(resolve, delay));
       }
     }
     throw new Error("Max retries exceeded");
   }
   ```

4. **Enhanced Health Checks**

   ```typescript
   // controllers/health.ts
   export const healthCheck = async (req: Request, res: Response) => {
     const checks = {
       database: false,
       cloudinary: false,
       uptime: process.uptime(),
       timestamp: new Date().toISOString(),
     };

     try {
       // Check database
       await mongoose.connection.db.admin().ping();
       checks.database = true;

       // Check Cloudinary
       await cloudinary.api.ping();
       checks.cloudinary = true;

       res.status(200).json({
         status: "healthy",
         checks,
       });
     } catch (error) {
       res.status(503).json({
         status: "unhealthy",
         checks,
         error: error.message,
       });
     }
   };
   ```

**Success Metrics**:

- Connection pool explicitly configured
- Circuit breaker prevents cascade failures
- Retry logic handles transient errors
- Health endpoint reports component status

---

### Phase 4: Migration to PostgreSQL (Month 3-4) 🟡 MEDIUM

**Goal**: Prepare for horizontal scaling with better replication support.

This aligns with your existing migration plan in TODO.txt. Key additions based on industry best practices:

1. **Read Replica Configuration**

   ```typescript
   // db/postgres.ts with Drizzle
   import { drizzle } from "drizzle-orm/node-postgres";
   import { Pool } from "pg";

   const writerPool = new Pool({
     connectionString: process.env.DATABASE_WRITER_URL,
     max: 10,
   });

   const readerPool = new Pool({
     connectionString: process.env.DATABASE_READER_URL,
     max: 20, // More read connections
   });

   export const dbWriter = drizzle(writerPool);
   export const dbReader = drizzle(readerPool);
   ```

2. **Smart Query Routing**

   ```typescript
   // utils/dbRouter.ts
   export function getDb(operation: "read" | "write") {
     return operation === "write" ? dbWriter : dbReader;
   }

   // Usage in controllers
   const users = await getDb("read").select().from(usersTable);
   await getDb("write").insert(usersTable).values(newUser);
   ```

**Success Metrics**:

- Write queries go to leader
- Read queries distributed to followers
- 3x improvement in read performance

---

### Phase 5: Horizontal Scaling (Month 4-6) 🟢 LOW PRIORITY

**Goal**: Support 10,000+ concurrent users.

**Prerequisites**:

- PostgreSQL migration complete
- Monitoring in place
- Actual user load justifies investment

**Implementation**:

1. **Stateless Session Management**

   ```typescript
   // Already achieved with JWT tokens
   // Ensure no server-side session state
   ```

2. **Load Balancer Configuration** (Example with Nginx)

   ```nginx
   upstream ampli_api {
     least_conn;
     server api1.ampli.com:3000;
     server api2.ampli.com:3000;
     server api3.ampli.com:3000;
   }

   server {
     listen 80;
     location / {
       proxy_pass http://ampli_api;
       proxy_set_header Host $host;
       health_check interval=30s fails=3 passes=2;
     }
   }
   ```

3. **Container Orchestration** (Example with Docker Compose)
   ```yaml
   services:
     api:
       build: ./ampli-backend
       deploy:
         replicas: 3
       environment:
         - DATABASE_URL=${DATABASE_URL}
       depends_on:
         - postgres
         - redis
   ```

**Success Metrics**:

- 3+ API instances running
- Load balanced with health checks
- Zero-downtime deployments
- Can handle 10,000 concurrent users

---

### Phase 6: Advanced Streaming (Month 6+) 🟢 FUTURE

**Goal**: Enterprise-level streaming experience with adaptive bitrate.

**Trigger**: When you reach 1,000+ daily active users.

**Implementation**:

1. **HLS/DASH Adaptive Streaming**

   - Use a service like Mux, AWS MediaConvert, or Cloudflare Stream
   - Generate m3u8 playlists with multiple quality variants
   - Client automatically switches based on bandwidth

2. **CDN Integration**
   - Cloudflare CDN for global edge caching
   - Cache-Control headers optimized
   - Purge stale content automatically

**Success Metrics**:

- Smooth playback on 3G connections
- Automatic quality adjustment
- 80%+ cache hit rate on popular content
- <100ms latency to first byte globally

---

## 🎯 Immediate Action Items (This Week)

**Priority 1: Security** (Can implement today)

1. Install dependencies:

   ```bash
   pnpm add express-rate-limit helmet cors
   pnpm add -D @types/cors
   ```

2. Create files:

   - `middleware/rateLimiter.ts`
   - `middleware/security.ts`
   - `utils/validateEnv.ts`

3. Update `index.ts`:

   ```typescript
   import { securityHeaders } from "./middleware/security";
   import { corsOptions } from "./middleware/cors";
   import { authLimiter, apiLimiter } from "./middleware/rateLimiter";
   import { validateEnv } from "./utils/validateEnv";

   validateEnv(); // Validate on startup

   app.use(securityHeaders);
   app.use(corsOptions);
   app.use("/api/", apiLimiter);
   app.use("/api/auth", authLimiter);
   ```

**Priority 2: Signed URLs** (This week)

1. Implement `utils/cloudinary.ts` with signed URL generation
2. Update audio stream endpoints to use signed URLs
3. Add URL expiration to Audio response type

**Priority 3: Connection Pooling** (This week)

1. Update `db/index.ts` with explicit pool configuration
2. Add connection monitoring logs

---

## 📊 Comparison Matrix: Current vs Target Architecture

| Category             | Industry Standard      | Ampli Current     | Ampli Target (6 months) |
| -------------------- | ---------------------- | ----------------- | ----------------------- |
| **Concurrent Users** | Millions               | ~100              | ~10,000                 |
| **Database**         | PostgreSQL (sharded)   | MongoDB (single)  | PostgreSQL (replicated) |
| **API Instances**    | 100s with auto-scaling | 1                 | 3-5 with load balancer  |
| **CDN**              | Global CDN             | Cloudinary direct | Cloudinary + Cloudflare |
| **Audio Qualities**  | 3-5 variants           | 1                 | 3 variants              |
| **Security**         | Enterprise-grade       | Basic             | Production-ready        |
| **Monitoring**       | Full observability     | Basic logs        | Health checks + metrics |
| **Deployment**       | Continuous             | Manual            | Automated CI/CD         |

---

## 📚 References

- [System Design One - Streaming Platform Analysis](https://newsletter.systemdesign.one/p/spotify-system-design)
- [Current Architecture](./ARCHITECTURE.md)
- [Development Roadmap](./TODO.txt)

---

**Last Updated**: 2025-10-23
**Next Review**: After Phase 1 completion
