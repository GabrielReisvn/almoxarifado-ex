const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicialização e Criação do Banco de Dados SQLite
const db = new sqlite3.Database('./almoxarifado.db', (err) => {
    if (err) console.error("Erro ao conectar ao banco:", err.message);
    else console.log("Conectado ao SQLite (almoxarifado.db).");
});

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
        estoque_atual INTEGER NOT NULL DEFAULT 0,
        estoque_minimo INTEGER NOT NULL DEFAULT 10,
        FOREIGN KEY (id_categoria) REFERENCES categorias(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_produto INTEGER NOT NULL,
        id_usuario INTEGER NOT NULL,
        tipo TEXT CHECK(tipo IN ('ENTRADA', 'SAIDA')) NOT NULL,
        quantidade INTEGER NOT NULL,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
        observacao TEXT,
        FOREIGN KEY (id_produto) REFERENCES produtos(id),
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    )`);

    // Dados Iniciais (População automática caso as tabelas estejam vazias)
    db.get("SELECT COUNT(*) AS count FROM usuarios", (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO usuarios (nome, email, senha, cargo) VALUES
                ('Carlos Silva', 'carlos@embalagens.com', '123456', 'Almoxarife'),
                ('Mariana Souza', 'mariana@embalagens.com', '123456', 'Gerente de Produção'),
                ('João Pedro', 'joao@embalagens.com', '123456', 'Operador de Estoque')`);

            db.run(`INSERT INTO categorias (nome, descricao) VALUES
                ('Caixas de Papelão', 'Caixas cartonadas de diversas gramaturas'),
                ('Frascos Plásticos', 'Frascos PET e PEAD'),
                ('Insumos de Lacre', 'Fitas adesivas e filmes stretch')`);

            db.run(`INSERT INTO produtos (codigo_sku, nome, id_categoria, especificacoes, peso_kg, estoque_atual, estoque_minimo) VALUES
                ('PAP-300-01', 'Caixa Papelão Reforçada 30x20x15cm', 1, 'Gramatura: 400g/m²', 0.350, 150, 50),
                ('FRA-500-02', 'Frasco Plástico PET 500ml', 2, 'Tampa: Rosca Plástica', 0.045, 12, 100),
                ('PAP-100-03', 'Caixa Papelão Padrão 15x15x10cm', 1, 'Gramatura: 250g/m²', 0.120, 800, 200)`);

            db.run(`INSERT INTO movimentacoes (id_produto, id_usuario, tipo, quantidade, observacao) VALUES
                (1, 1, 'ENTRADA', 200, 'Recebimento de lote - NF 4501'),
                (2, 3, 'SAIDA', 88, 'Baixa para linha de envasamento'),
                (3, 1, 'ENTRADA', 500, 'Reposição de estoque')`);
        }
    });
});

// Autenticação
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    db.get("SELECT id, nome, email, cargo FROM usuarios WHERE email = ? AND senha = ?", [email, senha], (err, row) => {
        if (err) return res.status(500).json({ error: "Erro no servidor" });
        if (!row) return res.status(401).json({ error: "E-mail ou senha incorretos." });
        res.json({ message: "Login realizado com sucesso", usuario: row });
    });
});

// Categorias
app.get('/api/categorias', (req, res) => {
    db.all("SELECT * FROM categorias", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Produtos (Listagem + Busca)
app.get('/api/produtos', (req, res) => {
    const query = req.query.q ? `%${req.query.q}%` : '%';
    const sql = `
        SELECT p.*, c.nome AS categoria_nome 
        FROM produtos p 
        JOIN categorias c ON p.id_categoria = c.id 
        WHERE p.nome LIKE ? OR p.codigo_sku LIKE ?
        ORDER BY p.id DESC
    `;
    db.all(sql, [query, query], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Criar Produto
app.post('/api/produtos', (req, res) => {
    const { codigo_sku, nome, id_categoria, especificacoes, peso_kg, estoque_atual, estoque_minimo } = req.body;
    if (!codigo_sku || !nome || !id_categoria || peso_kg === undefined) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }
    const sql = `INSERT INTO produtos (codigo_sku, nome, id_categoria, especificacoes, peso_kg, estoque_atual, estoque_minimo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [codigo_sku, nome, id_categoria, especificacoes, peso_kg, estoque_atual || 0, estoque_minimo || 10], function(err) {
        if (err) return res.status(400).json({ error: "SKU já cadastrado ou dados inválidos." });
        res.json({ id: this.lastID, message: "Produto cadastrado com sucesso!" });
    });
});

// Atualizar Produto
app.put('/api/produtos/:id', (req, res) => {
    const { codigo_sku, nome, id_categoria, especificacoes, peso_kg, estoque_minimo } = req.body;
    const sql = `UPDATE produtos SET codigo_sku = ?, nome = ?, id_categoria = ?, especificacoes = ?, peso_kg = ?, estoque_minimo = ? WHERE id = ?`;
    db.run(sql, [codigo_sku, nome, id_categoria, especificacoes, peso_kg, estoque_minimo, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Produto atualizado com sucesso!" });
    });
});

// Excluir Produto
app.delete('/api/produtos/:id', (req, res) => {
    db.run("DELETE FROM produtos WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: "Não é possível excluir produtos com histórico de movimentação." });
        res.json({ message: "Produto excluído com sucesso!" });
    });
});

// Movimentação de Estoque (Entrada e Saída)
app.get('/api/movimentacoes', (req, res) => {
    const sql = `
        SELECT m.*, p.nome AS produto_nome, p.codigo_sku, u.nome AS usuario_nome 
        FROM movimentacoes m
        JOIN produtos p ON m.id_produto = p.id
        JOIN usuarios u ON m.id_usuario = u.id
        ORDER BY m.data_hora DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/movimentacoes', (req, res) => {
    const { id_produto, id_usuario, tipo, quantidade, observacao } = req.body;
    const qtd = parseInt(quantidade);

    if (!id_produto || !id_usuario || !tipo || isNaN(qtd) || qtd <= 0) {
        return res.status(400).json({ error: "Dados de movimentação inválidos." });
    }

    db.get("SELECT estoque_atual FROM produtos WHERE id = ?", [id_produto], (err, prod) => {
        if (err || !prod) return res.status(404).json({ error: "Produto não encontrado." });

        if (tipo === 'SAIDA' && prod.estoque_atual < qtd) {
            return res.status(400).json({ error: "Estoque insuficiente para esta saída." });
        }

        const novoEstoque = tipo === 'ENTRADA' ? prod.estoque_atual + qtd : prod.estoque_atual - qtd;

        db.serialize(() => {
            db.run("UPDATE produtos SET estoque_atual = ? WHERE id = ?", [novoEstoque, id_produto]);
            db.run("INSERT INTO movimentacoes (id_produto, id_usuario, tipo, quantidade, observacao) VALUES (?, ?, ?, ?, ?)", 
                [id_produto, id_usuario, tipo, qtd, observacao], 
                function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: "Movimentação registrada com sucesso!" });
                }
            );
        });
    });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));