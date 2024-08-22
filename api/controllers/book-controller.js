import { pool } from "../config/db.js";

// MENDAPATKAN SEMUA BUKU
export const getAllBook = async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// MEMIMJAM BUKU
export const borrowBook = async (req, res) => {
  const { memberCode, bookCode } = req.body;

  try {
    // Cek jumlah buku yang dipinjam oleh anggota
    const loanCount = await pool.query(
      "SELECT COUNT(*) FROM loans WHERE member_code = $1 AND return_date IS NULL",
      [memberCode]
    );

    if (loanCount.rows[0].count >= 2) {
      return res.status(400).json({ msg: "Anggota sudah meminjam 2 buku." });
    }

    // Cek apakah buku sedang dipinjam oleh anggota lain
    const bookLoan = await pool.query(
      "SELECT * FROM loans WHERE book_code = $1 AND return_date IS NULL",
      [bookCode]
    );

    if (bookLoan.rows.length > 0) {
      return res
        .status(400)
        .json({ msg: "Buku sedang dipinjam anggota lain." });
    }

    // Cek apakah anggota sedang dalam masa penalti
    const penalty = await pool.query(
      "SELECT * FROM penalties WHERE member_code = $1 AND penalty_end > CURRENT_DATE",
      [memberCode]
    );

    if (penalty.rows.length > 0) {
      return res
        .status(400)
        .json({ msg: "Anggota sedang dalam masa penalti." });
    }

    // Memasukkan data peminjaman jika semua syarat terpenuhi
    await pool.query(
      "INSERT INTO loans (member_code, book_code, loan_date) VALUES ($1, $2, CURRENT_DATE)",
      [memberCode, bookCode]
    );

    res.json({ msg: "Buku berhasil dipinjam." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// MENGEMBALIKAN BUKU
export const returnBook = async (req, res) => {
  const { memberCode, bookCode } = req.body;

  try {
    // Cek apakah buku yang dikembalikan valid
    const loan = await pool.query(
      "SELECT * FROM loans WHERE member_code = $1 AND book_code = $2 AND return_date IS NULL",
      [memberCode, bookCode]
    );

    if (loan.rows.length === 0) {
      return res
        .status(400)
        .json({ msg: "Buku ini tidak dipinjam oleh anggota tersebut." });
    }

    // Update tanggal pengembalian buku
    await pool.query(
      "UPDATE loans SET return_date = CURRENT_DATE WHERE member_code = $1 AND book_code = $2",
      [memberCode, bookCode]
    );

    // Cek apakah pengembalian melebihi 7 hari
    const overdue = await pool.query(
      "SELECT * FROM loans WHERE member_code = $1 AND book_code = $2 AND CURRENT_DATE > loan_date + INTERVAL '7 days'",
      [memberCode, bookCode]
    );

    if (overdue.rows.length > 0) {
      // Tambahkan penalti jika telat mengembalikan
      await pool.query(
        "INSERT INTO penalties (member_code, penalty_start, penalty_end) VALUES ($1, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days')",
        [memberCode]
      );

      return res.json({
        msg: "Buku berhasil dikembalikan, tetapi Anda dikenakan denda.",
      });
    }

    res.json({ msg: "Buku berhasil dikembalikan." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// PEMERIKSAAN BUKU
export const getAvailableBooks = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.code, b.title, b.author, b.stock - COUNT(l.book_code) AS available_stock
      FROM books b
      LEFT JOIN loans l ON b.code = l.book_code AND l.return_date IS NULL
      GROUP BY b.code, b.title, b.author, b.stock
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
