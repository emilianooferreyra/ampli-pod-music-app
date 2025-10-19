import "dotenv/config";
import "./db";
import express from "express";
import mongoose from "mongoose";
import path from "node:path";
import authRouter from "./routers/auth";
import audioRouter from "./routers/audio";
import favoriteRouter from "./routers/favorite";
import playlistRouter from "./routers/playlist";
import profileRouter from "./routers/profile";
import historyRouter from "./routers/history";

import { errorHandler } from "./middleware/error";

import "./utils/schedule";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);
app.use("/playlist", playlistRouter);
app.use("/profile", profileRouter);
app.use("/history", historyRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 8989;

const server = app.listen(PORT, () => {
  console.log("Port is listening on port " + PORT);
});

const gracefulShutdown = async () => {
  console.log("Received kill signal, shutting down gracefully.");
  server.close(async () => {
    console.log("Closed out remaining connections.");
    await mongoose.connection.close();
    console.log("Mongoose connection closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
