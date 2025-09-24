import { Router } from "express";
import db from "../database.js";

const router = Router();

router.post("/", (req, res) => {
  const { produto_id, quantidade } = req.body;
  db.run(
    "INSERT INTO estoque (produto_id, quantidade) VALUES (?, ?)",
    [produto_id, quantidade],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      db.run(
        "UPDATE produtos SET quantidade_estoque = quantidade_estoque + ? WHERE id = ?",
        [quantidade, produto_id]
      );

      res.status(201).json({ id: this.lastID });
    }
  );
});

router.get("/", (req, res) => {
  db.all("SELECT * FROM estoque", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

router.get("/:id", (req, res) => {
  db.get("SELECT * FROM estoque WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Registro de estoque não encontrado" });
    res.json(row);
  });
});

export default router;
