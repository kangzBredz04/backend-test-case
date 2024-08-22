import express from "express";
import { getAllBook } from "../controllers/book-controller.js";

const router = express.Router();

router.get("/get-all", getAllBook);

export default router;
