import { Router } from "express";
import db from "../database.js";

const router = Router();

router.post("/", (req, res) => {
  const { nome_cliente, email, telefone } = req.body;
  db.run(
    "INSERT INTO clientes (nome_cliente, email, telefone) VALUES (?, ?, ?)",
    [nome_cliente, email, telefone],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.get("/", (req, res) => {
  db.all("SELECT * FROM clientes", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

router.get("/:id", (req, res) => {
  db.get("SELECT * FROM clientes WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Cliente não encontrado" });
    res.json(row);
  });
});

export default router;
