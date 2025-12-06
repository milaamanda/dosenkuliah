const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET semua mahasiswa
router.get("/", (req, res) => {
  db.query("SELECT * FROM mahasiswa", (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json(results);
  });
});

// GET mahasiswa by NIM
router.get("/:nim", (req, res) => {
  const nim = req.params.nim;
  db.query("SELECT * FROM mahasiswa WHERE nim = ?", [nim], (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Not Found" });
    res.json(results[0]);
  });
});

// POST tambah mahasiswa
router.post("/", (req, res) => {
  const { nim, nama, gender, prodi, alamat } = req.body;
  db.query(
    "INSERT INTO mahasiswa VALUES (?,?,?,?,?)",
    [nim, nama, gender, prodi, alamat],
    (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ message: "Mahasiswa added successfully" });
    }
  );
});

// PUT update mahasiswa
router.put("/:nim", (req, res) => {
  const nim = req.params.nim;
  const { nama, gender, prodi, alamat } = req.body;
  db.query(
    "UPDATE mahasiswa SET nama=?, gender=?, prodi=?, alamat=? WHERE nim=?",
    [nama, gender, prodi, alamat, nim],
    (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ message: "Mahasiswa updated successfully" });
    }
  );
});

// DELETE mahasiswa
router.delete("/:nim", (req, res) => {
  const nim = req.params.nim;
  db.query("DELETE FROM mahasiswa WHERE nim=?", [nim], (err) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json({ message: "Mahasiswa deleted successfully" });
  });
});

module.exports = router;
