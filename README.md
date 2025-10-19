# Ampli 🎵

A free audio platform for creators to share podcasts, music, and audio content.

**Ampli** empowers creators to upload, organize, and share audio content with their audience. Built with modern web technologies and a focus on creator freedom.

Get the app (coming soon):

- **Web:** _(planned)_
- **iOS / Android:** Available on the App Store and Play Store _(planned)_

---

## 🚀 Current Status

Ampli is in active development. The backend API is functional with the following features:

- User authentication with email verification
- Audio file uploads with Cloudinary integration
- Playlist creation and management
- User profiles with follow/follower system
- Listening history tracking
- Favorites and recommendations

### Tech Stack

- **Backend:** Express.js + TypeScript + MongoDB
- **Authentication:** JWT with bcrypt
- **File Storage:** Cloudinary
- **Email:** Nodemailer with Mailtrap

### Project Structure

```
├── pod-back/           # Express.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routers/
│   │   └── middleware/
│   └── package.json
└── docs/               # Architecture and migration plans
```

---

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design and patterns
- [Development Guide](./docs/DEVELOPMENT.md) - Setup and development workflow
- [Migration Plan](./docs/MIGRATION-PLAN.md) - Future tech stack migration

---

## 🎯 Roadmap

See [docs/TODO.txt](./docs/TODO.txt) for the full development roadmap, including:

- Monorepo migration with Turborepo
- Mobile app with React Native (Expo)
- Migration to Hono.js + PostgreSQL + Drizzle ORM
- CI/CD pipeline with automated testing

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

Made with ❤️ for creators and music lovers.
