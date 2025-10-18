# Migration Plan

This document outlines the planned migration strategy for the Intune App from the current tech stack to a modernized architecture.

## Current Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Monorepo**: None (single backend application)
- **Structure**: MVC-like pattern with business logic in controllers

## Target Stack

- **Backend Framework**: Hono.js
- **Database**: PostgreSQL with Drizzle ORM
- **Monorepo**: Turborepo + pnpm workspaces
- **Structure**: Service-based architecture with thin controllers

## Migration Phases

### Phase 1: Service Layer Introduction (CURRENT PRIORITY)

**Goal**: Extract all business logic from controllers into dedicated service layer

**Steps**:
1. Create `src/services/` directory
2. Identify business logic in controllers
3. Extract logic into service methods
4. Controllers become thin wrappers that:
   - Receive HTTP request
   - Call service method
   - Return HTTP response

**Why First**: This makes the framework migration trivial, as services are framework-agnostic.

**Example**:
```typescript
// Before (controller has business logic)
export const create: RequestHandler = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(403).json({ error: "Email in use" });

  const newUser = await User.create(req.body);
  const token = generateToken();
  await EmailVerificationToken.create({ owner: newUser._id, token });
  await sendVerificationMail(token, { ... });

  res.status(201).json({ user: newUser });
};

// After (controller calls service)
export const create: RequestHandler = async (req, res) => {
  const result = await userService.createUser(req.body);
  res.status(201).json(result);
};
```

### Phase 2: Express → Hono.js

**Goal**: Replace Express with Hono.js for better performance and TypeScript support

**Prerequisites**: Phase 1 complete (services extracted)

**Steps**:
1. Install Hono.js and dependencies
2. Create new Hono app structure
3. Port routes from Express to Hono syntax
4. Update middleware to Hono format
5. Controllers call existing services (no changes needed)
6. Update tests to use `hono/testing`

**Benefits**:
- Faster runtime performance
- Better TypeScript inference
- Smaller bundle size
- Modern API design

### Phase 3: MongoDB → PostgreSQL + Drizzle

**Goal**: Migrate from document-based to relational database

**Prerequisites**: Phase 2 complete (Hono migration done)

**Steps**:
1. Design PostgreSQL schema based on current models
2. Set up Drizzle ORM
3. Create migration scripts
4. Implement data migration strategy
5. Update services to use Drizzle instead of Mongoose
6. Run data migration
7. Verify data integrity

**Considerations**:
- Map MongoDB documents to relational tables
- Handle array fields (followers/followings) as junction tables
- Convert ObjectId references to foreign keys
- Update aggregation queries to SQL

### Phase 4: Monorepo Structure

**Goal**: Organize codebase into shared packages

**Prerequisites**: Phase 3 complete (database migrated)

**Steps**:
1. Set up Turborepo configuration
2. Create package structure:
   ```
   packages/
   ├── api/              # Backend (formerly pod-back/)
   ├── web/              # Frontend (future)
   ├── mobile/           # Mobile app (future)
   ├── types/            # @intune/types
   ├── validation/       # @intune/validation
   ├── api-client/       # @intune/api-client
   └── eslint-config/    # @intune/eslint-config
   ```
3. Extract shared types to `@intune/types`
4. Extract Zod schemas to `@intune/validation`
5. Create typed API client in `@intune/api-client`
6. Configure workspace dependencies
7. Set up shared build/lint/test scripts

**Benefits**:
- Code reuse across frontend/backend
- Type-safe API client
- Consistent validation rules
- Shared tooling configuration

## Critical Guidelines

### General Principles

1. **One phase at a time**: Complete each phase fully before moving to the next
2. **Service layer first**: Always extract services before changing frameworks
3. **Test coverage**: Add tests during service extraction (easier to test services)
4. **Incremental approach**: Migrate feature by feature, not all at once
5. **Backward compatibility**: Ensure API contracts remain stable

### When Refactoring

- **DO**: Extract business logic to services
- **DO**: Keep controllers thin (HTTP concerns only)
- **DO**: Write tests for services
- **DO**: Document breaking changes

- **DON'T**: Mix framework migration with business logic changes
- **DON'T**: Skip the service layer step
- **DON'T**: Change database and framework simultaneously
- **DON'T**: Ignore data migration scripts

## Timeline Estimate

- **Phase 1 (Services)**: 2-3 weeks
- **Phase 2 (Hono)**: 1-2 weeks
- **Phase 3 (PostgreSQL)**: 3-4 weeks
- **Phase 4 (Monorepo)**: 2-3 weeks

**Total**: ~8-12 weeks for complete migration

## Rollback Strategy

Each phase should have a rollback plan:

- **Phase 1**: Controllers can temporarily call services or use old logic (feature flags)
- **Phase 2**: Keep Express version in separate branch, easy rollback
- **Phase 3**: Keep MongoDB running in parallel during migration, switch with feature flag
- **Phase 4**: Packages can be consolidated back if needed

## Success Criteria

- [ ] All business logic in services (Phase 1)
- [ ] Hono.js serving all endpoints (Phase 2)
- [ ] PostgreSQL as primary database (Phase 3)
- [ ] Monorepo structure with shared packages (Phase 4)
- [ ] All tests passing
- [ ] Performance metrics maintained or improved
- [ ] Zero data loss during migrations
