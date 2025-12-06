const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET semua dosen + Filter + Sorting + Pagination
router.get("/", (req, res) => {
  const { search, prodi, gender, sortby, order, page, limit } = req.query;

  const limitValue = parseInt(limit) || 10;
  const pageValue = parseInt(page) || 1;
  const offsetValue = (pageValue - 1) * limitValue;

  let query = "SELECT * FROM dosen WHERE 1=1";
  let params = [];

  if (search) {
    query += " AND (nama_dosen LIKE ? OR prodi LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (prodi) {
    query += " AND prodi = ?";
    params.push(prodi);
  }

  if (gender) {
    query += " AND gender = ?";
    params.push(gender);
  }

  const allowedSort = ["nidn", "nama_dosen", "prodi"];
  const sortColumn = allowedSort.includes(sortby) ? sortby : "nama_dosen";
  const sortOrder = order && order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  query += ` ORDER BY ${sortColumn} ${sortOrder}`;

  query += " LIMIT ? OFFSET ?";
  params.push(limitValue, offsetValue);

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error filtering dosen:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.json({
      page: pageValue,
      limit: limitValue,
      total: results.length,
      data: results,
    });
  });
});

// GET dosen by NIDN
router.get("/:Nidn", (req, res) => {
  const Nidn = req.params.Nidn;
  db.query("SELECT * FROM dosen WHERE Nidn = ?", [Nidn], (err, results) => {
    if (err) {
      console.error("Error fetching dosen:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Dosen not found" });
    }
    res.json(results[0]);
  });
});

// POST tambah dosen
router.post("/", (req, res) => {
  const { Nidn, nama_dosen, gender, prodi, email } = req.body;
  db.query(
    "INSERT INTO dosen (Nidn, nama_dosen, gender, prodi, email) VALUES (?, ?, ?, ?, ?)",
    [Nidn, nama_dosen, gender, prodi, email],
    (err) => {
      if (err) {
        console.error("Error inserting dosen:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.json({ message: "Dosen added successfully" });
    }
  );
});

// PUT update dosen
router.put("/:Nidn", (req, res) => {
  const Nidn = req.params.Nidn;
  const { nama_dosen, gender, prodi, email } = req.body;
  db.query(
    "UPDATE dosen SET nama_dosen=?, gender=?, prodi=?, email=? WHERE Nidn=?",
    [nama_dosen, gender, prodi, email, Nidn],
    (err) => {
      if (err) {
        console.error("Error updating dosen:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.json({ message: "Dosen updated successfully" });
    }
  );
});

// DELETE dosen
router.delete("/:Nidn", (req, res) => {
  const nidn = req.params.Nidn;
  db.query("DELETE FROM dosen WHERE Nidn=?", [Nidn], (err) => {
    if (err) {
      console.error("Error deleting dosen:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json({ message: "Dosen dengan NIDN ${Nidn} berhasil dihapus" });
  });
});

module.exports = router;
