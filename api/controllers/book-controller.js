import { pool } from "../config/db.js";

export const getAllBook = async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
