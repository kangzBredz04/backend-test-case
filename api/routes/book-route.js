import express from "express";
import {
  borrowBook,
  getAllBook,
  getAvailableBooks,
  returnBook,
} from "../controllers/book-controller.js";

const router = express.Router();

router.get("/get-all", getAllBook);
router.post("/borrow", borrowBook);
router.post("/return", returnBook);
router.get("/available-books", getAvailableBooks);

export default router;
