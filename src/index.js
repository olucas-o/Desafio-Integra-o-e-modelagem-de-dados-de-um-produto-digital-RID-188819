import express from "express";
import produtosRouter from "./routes/produtos.js";
import clientesRouter from "./routes/clientes.js";
import pedidosRouter from "./routes/pedidos.js";
import vendasRouter from "./routes/vendas.js";
import estoqueRouter from "./routes/estoque.js";

const app = express();
app.use(express.json());

app.use("/produtos", produtosRouter);
app.use("/clientes", clientesRouter);
app.use("/pedidos", pedidosRouter);
app.use("/vendas", vendasRouter);
app.use("/estoque", estoqueRouter);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
