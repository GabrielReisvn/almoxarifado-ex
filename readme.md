# 📦 AlmoxTech - Sistema de Gestão de Almoxarifado

> **Sistema web para controle de produtos, estoque e movimentações de um almoxarifado.**

![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

---

## 📑 Sumário

1. [Descrição](#-descrição)
2. [Funcionalidades](#-funcionalidades)
3. [Tecnologias](#-tecnologias)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Como Executar](#-como-executar)
6. [Credenciais de Teste](#-credenciais-de-teste)
7. [Banco de Dados](#-banco-de-dados)
8. [API](#-api)
9. [Dashboard](#-dashboard)
10. [Desenvolvedor](#-desenvolvedor)

---

## 📝 Descrição

O **AlmoxTech** é um sistema web desenvolvido para auxiliar no gerenciamento de um almoxarifado.

O sistema permite controlar produtos, categorias, estoque e movimentações de entrada e saída.

A aplicação possui:

- Sistema de login;
- Dashboard com informações do estoque;
- Cadastro de produtos;
- Edição de produtos;
- Exclusão de produtos;
- Pesquisa por nome ou SKU;
- Controle de estoque mínimo;
- Registro de entradas;
- Registro de saídas;
- Validação de estoque disponível;
- Histórico de movimentações;
- Persistência dos dados em banco SQLite.

---

## ✨ Funcionalidades

### 🔐 Login

O sistema possui autenticação por e-mail e senha.

Após o login, o usuário é identificado pelo seu:

- Nome;
- E-mail;
- Cargo.

---

### 📊 Dashboard

O Dashboard apresenta informações resumidas do estoque:

- Total de produtos;
- Quantidade de produtos com estoque baixo;
- Total de entradas;
- Total de saídas;
- Últimas movimentações realizadas.

---

### 📦 Produtos

É possível cadastrar produtos informando:

- SKU;
- Nome;
- Categoria;
- Peso em kg;
- Estoque inicial;
- Estoque mínimo;
- Especificações.

Também é possível:

- Pesquisar produtos;
- Editar produtos;
- Excluir produtos.

O estoque atual não é alterado diretamente durante a edição. Alterações de estoque são realizadas através das movimentações.

---

### 🔄 Movimentações

O sistema permite registrar:

**ENTRADA**
- Recebimento de produtos;
- Reposição de estoque.

**SAÍDA**
- Retirada de produtos;
- Baixa para produção.

Ao registrar uma movimentação, o estoque do produto é atualizado automaticamente.

O sistema também impede uma saída quando a quantidade solicitada é maior que o estoque disponível.

---

### ⚠️ Estoque mínimo

Produtos cujo estoque atual esteja abaixo ou igual ao estoque mínimo são destacados visualmente no sistema.

Isso permite identificar rapidamente produtos que precisam de reposição.

---

## 🛠 Tecnologias

### Frontend

- HTML5
- JavaScript ES6+
- Tailwind CSS
- Font Awesome

### Backend

- Node.js
- Express.js

### Banco de Dados

- SQLite
- SQLite3

---

## 📁 Estrutura do Projeto

```text
almoxarifado/
│
├── server.js
├── almoxarifado.db
├── package.json
│
└── public/
    ├── index.html
    └── script.js
```

### Arquivos principais

| Arquivo | Função |
|---|---|
| `server.js` | Servidor, API e banco de dados |
| `public/index.html` | Interface do sistema |
| `public/script.js` | Lógica do frontend |
| `almoxarifado.db` | Banco de dados SQLite |
| `package.json` | Dependências do projeto |

> O arquivo `almoxarifado.db` é criado automaticamente pelo sistema caso ainda não exista.

---

## 🚀 Como Executar

### 1. Instalar o Node.js

É necessário ter o **Node.js** instalado no computador.

---

### 2. Instalar as dependências

Dentro da pasta do projeto, execute:

```bash
npm install express sqlite3
```

---

### 3. Iniciar o servidor

Execute:

```bash
node server.js
```

Se estiver tudo correto, aparecerá:

```text
Servidor rodando em http://localhost:3000
```

---

### 4. Acessar o sistema

Abra o navegador e acesse:

```text
http://localhost:3000
```

---

## 🔑 Credenciais de Teste

O sistema possui usuários cadastrados automaticamente na primeira execução.

| Nome | E-mail | Senha | Cargo |
|---|---|---|---|
| Carlos Silva | `carlos@embalagens.com` | `123456` | Almoxarife |
| Mariana Souza | `mariana@embalagens.com` | `123456` | Gerente |
| João Pedro | `joao@embalagens.com` | `123456` | Operador |

### Exemplo

```text
E-mail: carlos@embalagens.com
Senha: 123456
```

---

## 🗄 Banco de Dados

O projeto utiliza **SQLite**.

O banco contém as seguintes tabelas:

### `usuarios`

Armazena os usuários do sistema.

```text
id
nome
email
senha
cargo
```

### `categorias`

Armazena as categorias dos produtos.

```text
id
nome
descricao
```

### `produtos`

Armazena os produtos e seus dados de estoque.

```text
id
codigo_sku
nome
id_categoria
especificacoes
peso_kg
estoque_atual
estoque_minimo
```

### `movimentacoes`

Registra o histórico de entradas e saídas.

```text
id
id_produto
id_usuario
tipo
quantidade
data_hora
observacao
```

### Relacionamentos

```text
USUARIOS
    │
    │ 1:N
    ▼
MOVIMENTACOES
    ▲
    │ N:1
    │
PRODUTOS
    │
    │ N:1
    ▼
CATEGORIAS
```

---

## 🌐 API

O backend disponibiliza uma API REST para comunicação entre o frontend e o banco de dados.

### 🔐 Autenticação

```http
POST /api/login
```

Realiza o login do usuário.

---

### 📂 Categorias

```http
GET /api/categorias
```

Retorna todas as categorias cadastradas.

---

### 📦 Produtos

Listar produtos:

```http
GET /api/produtos
```

Pesquisar produtos:

```http
GET /api/produtos?q=caixa
```

Cadastrar produto:

```http
POST /api/produtos
```

Editar produto:

```http
PUT /api/produtos/:id
```

Excluir produto:

```http
DELETE /api/produtos/:id
```

---

### 🔄 Movimentações

Listar movimentações:

```http
GET /api/movimentacoes
```

Registrar movimentação:

```http
POST /api/movimentacoes
```

O registro de uma movimentação também atualiza o estoque do produto.

---

## 📊 Dashboard

O Dashboard utiliza os dados retornados pela API para apresentar:

```text
┌─────────────────┐
│    Produtos     │
│       3         │
└─────────────────┘

┌─────────────────┐
│  Estoque Baixo  │
│       1         │
└─────────────────┘

┌─────────────────┐
│     Entradas    │
│      700        │
└─────────────────┘

┌─────────────────┐
│      Saídas     │
│       88        │
└─────────────────┘
```

Os valores são atualizados conforme novos produtos e movimentações são registrados.

---

## ⚙️ Regras de Negócio

### Estoque

O estoque é atualizado automaticamente:

```text
ENTRADA → estoque atual + quantidade

SAÍDA → estoque atual - quantidade
```

### Validação de saída

Uma saída não pode ser realizada quando:

```text
quantidade solicitada > estoque atual
```

Nesse caso, o sistema retorna uma mensagem informando que o estoque é insuficiente.

### SKU

Cada produto deve possuir um SKU único.

### Estoque mínimo

Quando:

```text
estoque atual <= estoque mínimo
```

o produto é considerado em situação de estoque baixo.

---

## 🎓 Objetivo Acadêmico

O projeto foi desenvolvido como uma aplicação prática envolvendo conceitos de:

- Programação Web;
- JavaScript;
- Desenvolvimento Backend;
- APIs REST;
- Banco de Dados;
- SQLite;
- CRUD;
- Modelagem de dados;
- Regras de negócio;
- Controle de estoque.

---

## 👨‍💻 Desenvolvedor

**Gabriel Viana**

**GitHub:**  
https://github.com/GabrielReisvn/almoxarifado-ex

---

## 📌 Observações

Este projeto possui finalidade acadêmica e de demonstração.

As senhas estão armazenadas de forma simples no banco de dados para facilitar o desenvolvimento e os testes do projeto. Em uma aplicação de produção, recomenda-se utilizar técnicas de hash de senha e autenticação baseada em sessão ou tokens.

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos.