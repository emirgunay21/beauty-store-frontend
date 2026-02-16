const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /products?category=beauty
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        ok: false,
        message: "category query zorunlu",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM products WHERE category = ?",
      [category]
    );

    return res.json({
      ok: true,
      source: "database",
      items: rows,
    });
  } catch (err) {
    console.error("PRODUCTS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});

module.exports = router;
