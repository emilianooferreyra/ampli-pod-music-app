# Intune App 🔈

Welcome music lovers! This is the codebase for **Intune App**, a modern full-stack music platform designed to make streaming, playlists, and discovering new artists seamless and fun.

Get the app itself (coming soon):

- **Web:** `intuneapp.com` _(planned)_
- **iOS / Android:** Available on the App Store and Play Store _(planned)_

---

## 🎵 Development Resources

Intune App is built with **TypeScript**, with a backend powered by **Hono.js** and a future React Native frontend in mind.

The backend provides REST APIs for audio streaming, user authentication, playlists, and more. Everything is structured in a **monorepo** using **pnpm workspaces** and **Turborepo** for high-performance development.

### Project Structure

/
├── packages/
│ ├── backend/ # Hono.js API for Intune App
│ └── frontend/ # (Planned) React Native mobile application
├── package.json
└── turbo.json

**Getting Started:** You’ll need [Node.js](https://nodejs.org/en/) v18+, [pnpm](https://pnpm.io/), and a [MongoDB](https://www.mongodb.com/) instance (local or cloud). Clone the repo with `git clone https://github.com/your-username/intuneapp.git` and `cd intuneapp`, then run `pnpm install`. Set up environment variables by navigating to the backend folder: `cd packages/backend` and copy `.env.template` to `.env`, filling in variables like `MONGO_URI` and `JWT_SECRET`. From the root of the repo, run `pnpm dev` to start the backend API (available at `http://localhost:8000`). Frontend development will be connected soon.

**Features:** User Authentication for secure sign-up, sign-in, and profile management; Audio Streaming to upload, manage, and stream audio files; Playlists & Favorites to create custom playlists and mark favorite tracks; Artist Profiles to follow artists and discover new music; and much more.

**Contributing:** Contributions are welcome! Please check existing issues before opening a new one, discuss big features before submitting a PR, and keep contributions focused and concise. For forking, change all branding to differentiate from Intune App, replace support links and analytics with your own, and clearly communicate that this is a forked project.

**Security:** If you discover any security issues, please email `security@intuneapp.com` and the team will respond promptly.

**License:** Intune App is open source under the **MIT License**. See `./LICENSE` for details.

P.S. Made with ❤️ for music lovers.
