# Development Guide

## Quick Start

### Backend (`pod-back/`)

```bash
# Development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
pnpm lint:fix

# Testing (to be implemented)
pnpm test
pnpm test:watch
pnpm test:coverage
```

## Environment Variables

Create a `.env` file in `pod-back/` based on `.env.template`:

### Required Variables

#### Database
- `MONGO_URI`: MongoDB connection string

#### Email Service (Mailtrap)
- `MAILTRAP_HOST`: SMTP host (default: `sandbox.smtp.mailtrap.io`)
- `MAILTRAP_PORT`: SMTP port (default: `2525`)
- `MAILTRAP_USER`: Your Mailtrap username
- `MAILTRAP_PASS`: Your Mailtrap password
- `VERIFICATION_EMAIL`: Sender email address (e.g., `noreply@intune.com`)

#### Authentication
- `JWT_SECRET`: Must be at least 32 characters
- `PASSWORD_RESET_LINK`: Frontend URL for password reset (e.g., `http://localhost:3000/reset-password`)
- `SIGN_IN_URL`: Frontend sign-in URL (e.g., `http://localhost:3000/signin`)

#### File Storage (Cloudinary)
- `CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUD_KEY`: Cloudinary API key
- `CLOUD_SECRET`: Cloudinary API secret

#### Optional
- `RESEND_API_KEY`: Alternative to Mailtrap (if using Resend for emails)

### Example `.env`

```bash
MONGO_URI=mongodb://localhost:27017/intune

# Mailtrap
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_password

# Email settings
VERIFICATION_EMAIL=noreply@intune.com
PASSWORD_RESET_LINK=http://localhost:3000/reset-password
SIGN_IN_URL=http://localhost:3000/signin

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_KEY=your_cloud_key
CLOUD_SECRET=your_cloud_secret
```

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Common Tasks

### Adding a New API Endpoint

1. Create Zod validation schema in `utils/validationSchema.ts`
2. Create controller in `controllers/`
3. Add route in `routers/`
4. Apply middleware: `validate()`, `mustAuth`, `isVerified`, etc.

Example:
```typescript
// utils/validationSchema.ts
export const MySchema = z.object({
  field: z.string().min(1)
});

// routers/myRouter.ts
router.post('/endpoint', validate(MySchema), mustAuth, myController);
```

### Working with File Uploads

Use the `fileParser` middleware for handling file uploads:

```typescript
router.post('/upload', mustAuth, fileParser, validate(Schema), controller);
```

In the controller:
```typescript
const file = req.file; // Single file
const files = req.files; // Multiple files

// Convert to base64 for Cloudinary
const b64 = Buffer.from(file.buffer).toString('base64');
const dataURI = `data:${file.mimetype};base64,${b64}`;

// Upload
const result = await cloudinary.uploader.upload(dataURI, {
  // transformation options
});
```

### Email Templates

Email templates are located in `mail/template.ts` and use inline images via `cid:` attachments.

To send an email:
```typescript
import { sendVerificationMail } from '@/utils/mail';

await sendVerificationMail(token, {
  name: user.name,
  email: user.email,
  userId: user._id.toString()
});
```

## Debugging

### Common Issues

**Email not sending:**
- Check Mailtrap credentials in `.env`
- Verify all `MAILTRAP_*` variables are set
- Check server logs for detailed error messages

**Authentication failing:**
- Ensure `JWT_SECRET` is set and at least 32 characters
- Check token is being sent in `Authorization: Bearer <token>` header

**File upload failing:**
- Verify Cloudinary credentials
- Check file size limits in `fileParser` middleware
- Ensure file mimetype is allowed

## Future Shared Packages

When the monorepo is set up, these packages will be created:

- `@intune/types`: Shared TypeScript interfaces (User, Audio, Playlist, etc.)
- `@intune/validation`: Zod schemas for both frontend and backend
- `@intune/api-client`: Typed API client for frontend consumption
- `@intune/eslint-config`: Shared ESLint configuration

Always design new types and validation schemas with future sharing in mind.
