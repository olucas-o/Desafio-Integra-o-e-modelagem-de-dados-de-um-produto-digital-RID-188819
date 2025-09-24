import { Router } from "express";
import db from "../database.js";

const router = Router();

router.post("/", (req, res) => {
  const { nome_produto, preco, quantidade_estoque } = req.body;
  db.run(
    "INSERT INTO produtos (nome_produto, preco, quantidade_estoque) VALUES (?, ?, ?)",
    [nome_produto, preco, quantidade_estoque],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.get("/", (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

router.get("/:id", (req, res) => {
  db.get("SELECT * FROM produtos WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(row);
  });
});

export default router;
