import { pool } from "../config/db.js";

export const getAllMember = async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// PEMERIKSAAN ANGGOTA
export const getMemberLoanStatus = async (_req, res) => {
  try {
    const result = await pool.query(`
        SELECT m.code, m.name, COUNT(l.book_code) AS borrowed_books
        FROM members m
        LEFT JOIN loans l ON m.code = l.member_code AND l.return_date IS NULL
        GROUP BY m.code, m.name
      `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// CEK PENALTI
export const checkPenalty = async (req, res) => {
  const { memberCode } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM penalties WHERE member_code = $1 AND penalty_end > CURRENT_DATE",
      [memberCode]
    );

    if (result.rows.length > 0) {
      res.json({
        msg: "Anggota sedang dalam masa penalti.",
        penalty: result.rows[0],
      });
    } else {
      res.json({ msg: "Anggota tidak sedang dalam masa penalti." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
