const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database(
    path.join(__dirname, "almoxarifado.db")
);

db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        cargo TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo_sku TEXT UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        id_categoria INTEGER NOT NULL,
        especificacoes TEXT,
        peso_kg REAL NOT NULL,
        estoque_atual INTEGER DEFAULT 0,
        estoque_minimo INTEGER DEFAULT 10,
        FOREIGN KEY (id_categoria) REFERENCES categorias(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_produto INTEGER NOT NULL,
        id_usuario INTEGER NOT NULL,
        tipo TEXT CHECK(tipo IN ('ENTRADA','SAIDA')) NOT NULL,
        quantidade INTEGER NOT NULL,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
        observacao TEXT,
        FOREIGN KEY (id_produto) REFERENCES produtos(id),
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    )`);

    db.get("SELECT COUNT(*) AS total FROM usuarios", (err, row) => {
        if (err || row.total > 0) return;

        db.run(`INSERT INTO usuarios (nome,email,senha,cargo) VALUES
            ('Carlos Silva','carlos@embalagens.com','123456','Almoxarife'),
            ('Mariana Souza','mariana@embalagens.com','123456','Gerente'),
            ('João Pedro','joao@embalagens.com','123456','Operador')`);

        db.run(`INSERT INTO categorias (nome,descricao) VALUES
            ('Caixas de Papelão','Caixas de papelão'),
            ('Frascos Plásticos','Frascos PET e PEAD'),
            ('Insumos de Lacre','Fitas e filmes')`);

        db.run(`INSERT INTO produtos
            (codigo_sku,nome,id_categoria,especificacoes,peso_kg,estoque_atual,estoque_minimo)
            VALUES
            ('PAP-300-01','Caixa Papelão Reforçada',1,'Gramatura: 400g/m²',0.350,150,50),
            ('FRA-500-02','Frasco Plástico PET 500ml',2,'Tampa rosca',0.045,12,100),
            ('PAP-100-03','Caixa Papelão Padrão',1,'Gramatura: 250g/m²',0.120,800,200)`);

        db.run(`INSERT INTO movimentacoes
            (id_produto,id_usuario,tipo,quantidade,observacao)
            VALUES
            (1,1,'ENTRADA',200,'Recebimento de lote'),
            (2,3,'SAIDA',88,'Baixa para produção'),
            (3,1,'ENTRADA',500,'Reposição de estoque')`);
    });
});

// LOGIN
app.post("/api/login", (req, res) => {
    const { email, senha } = req.body;

    db.get(
        "SELECT id,nome,email,cargo FROM usuarios WHERE email=? AND senha=?",
        [email, senha],
        (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user) return res.status(401).json({ error: "E-mail ou senha incorretos." });

            res.json({ usuario: user });
        }
    );
});

// CATEGORIAS
app.get("/api/categorias", (req, res) => {
    db.all("SELECT * FROM categorias ORDER BY nome", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// PRODUTOS
app.get("/api/produtos", (req, res) => {
    const busca = `%${req.query.q || ""}%`;

    db.all(`
        SELECT p.*, c.nome AS categoria_nome
        FROM produtos p
        JOIN categorias c ON c.id = p.id_categoria
        WHERE p.nome LIKE ? OR p.codigo_sku LIKE ?
        ORDER BY p.id DESC
    `, [busca, busca], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/api/produtos", (req, res) => {
    const {
        codigo_sku,
        nome,
        id_categoria,
        especificacoes,
        peso_kg,
        estoque_atual = 0,
        estoque_minimo = 10
    } = req.body;

    if (!codigo_sku || !nome || !id_categoria || peso_kg === undefined)
        return res.status(400).json({ error: "Preencha os campos obrigatórios." });

    db.run(`
        INSERT INTO produtos
        (codigo_sku,nome,id_categoria,especificacoes,peso_kg,estoque_atual,estoque_minimo)
        VALUES (?,?,?,?,?,?,?)
    `, [
        codigo_sku,
        nome,
        id_categoria,
        especificacoes || "",
        peso_kg,
        estoque_atual,
        estoque_minimo
    ], function(err) {
        if (err) return res.status(400).json({ error: "SKU já cadastrado ou dados inválidos." });

        res.json({
            id: this.lastID,
            message: "Produto cadastrado!"
        });
    });
});

app.put("/api/produtos/:id", (req, res) => {
    const {
        codigo_sku,
        nome,
        id_categoria,
        especificacoes,
        peso_kg,
        estoque_minimo
    } = req.body;

    db.run(`
        UPDATE produtos SET
        codigo_sku=?,
        nome=?,
        id_categoria=?,
        especificacoes=?,
        peso_kg=?,
        estoque_minimo=?
        WHERE id=?
    `, [
        codigo_sku,
        nome,
        id_categoria,
        especificacoes || "",
        peso_kg,
        estoque_minimo,
        req.params.id
    ], function(err) {
        if (err) return res.status(400).json({ error: "Erro ao atualizar produto." });

        res.json({ message: "Produto atualizado!" });
    });
});

app.delete("/api/produtos/:id", (req, res) => {
    db.run(
        "DELETE FROM produtos WHERE id=?",
        [req.params.id],
        function(err) {
            if (err)
                return res.status(400).json({
                    error: "Não é possível excluir produto com movimentações."
                });

            res.json({ message: "Produto excluído!" });
        }
    );
});

// MOVIMENTAÇÕES
app.get("/api/movimentacoes", (req, res) => {
    db.all(`
        SELECT m.*, p.nome AS produto_nome, p.codigo_sku,
               u.nome AS usuario_nome
        FROM movimentacoes m
        JOIN produtos p ON p.id=m.id_produto
        JOIN usuarios u ON u.id=m.id_usuario
        ORDER BY m.data_hora DESC
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/api/movimentacoes", (req, res) => {
    const {
        id_produto,
        id_usuario,
        tipo,
        quantidade,
        observacao
    } = req.body;

    const qtd = Number(quantidade);

    if (!id_produto || !id_usuario || !tipo || !qtd || qtd <= 0)
        return res.status(400).json({ error: "Dados inválidos." });

    db.get(
        "SELECT estoque_atual FROM produtos WHERE id=?",
        [id_produto],
        (err, produto) => {
            if (err || !produto)
                return res.status(404).json({ error: "Produto não encontrado." });

            if (tipo === "SAIDA" && produto.estoque_atual < qtd)
                return res.status(400).json({ error: "Estoque insuficiente." });

            const novoEstoque =
                tipo === "ENTRADA"
                    ? produto.estoque_atual + qtd
                    : produto.estoque_atual - qtd;

            db.serialize(() => {
                db.run(
                    "UPDATE produtos SET estoque_atual=? WHERE id=?",
                    [novoEstoque, id_produto]
                );

                db.run(`
                    INSERT INTO movimentacoes
                    (id_produto,id_usuario,tipo,quantidade,observacao)
                    VALUES (?,?,?,?,?)
                `, [
                    id_produto,
                    id_usuario,
                    tipo,
                    qtd,
                    observacao || ""
                ], function(err) {
                    if (err)
                        return res.status(500).json({ error: err.message });

                    res.json({
                        message: "Movimentação registrada!",
                        novoEstoque
                    });
                });
            });
        }
    );
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});