import express from "express";
import "dotenv/config";

import BookRoute from "./routes/book-route.js";

const app = express();

app.use(express.json());

const router = express.Router();
app.use("/api", router);

router.use("/book", BookRoute);

router.use("/getting-started", async (_req, res) => {
  res.status(200).json({
    message: "Selamat Datang Di Website Sport Collection",
  });
});

app.listen(process.env.API_PORT, () =>
  console.log(`Server berhasil dijalankan pada port ${process.env.API_PORT}`)
);
