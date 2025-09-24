import { Router } from "express";
import db from "../database.js";

const router = Router();

router.post("/", (req, res) => {
  const { pedido_id, produto_id, quantidade } = req.body;
  db.get("SELECT preco, quantidade_estoque FROM produtos WHERE id = ?", [produto_id], (err, produto) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
    if (produto.quantidade_estoque < quantidade) return res.status(400).json({ error: "Estoque insuficiente" });

    const valor_total = produto.preco * quantidade;

    db.run(
      "INSERT INTO vendas (pedido_id, produto_id, quantidade, valor_total) VALUES (?, ?, ?, ?)",
      [pedido_id, produto_id, quantidade, valor_total],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });

        db.run(
          "UPDATE produtos SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?",
          [quantidade, produto_id]
        );

        res.status(201).json({ id: this.lastID, valor_total });
      }
    );
  });
});

router.get("/", (req, res) => {
  db.all("SELECT * FROM vendas", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

router.get("/:id", (req, res) => {
  db.get("SELECT * FROM vendas WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Venda não encontrada" });
    res.json(row);
  });
});

export default router;
