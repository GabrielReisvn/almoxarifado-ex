Markdown


# Sistema de Gestão de Estoque - Indústria de Embalagens

Sistema web para controle de almoxarifado, gerenciamento de estoque mínimo, rastreabilidade de movimentações e controle de especificações técnicas para embalagens (caixas de papelão, frascos plásticos e insumos).
💻 Tecnologias Utilizadas
Backend: Node.js, Express.js

Banco de Dados: SQLite3

Frontend: HTML5, JavaScript (ES6+), Tailwind CSS (via CDN)

Arquitetura: REST API / SPA e Multi-Page Support

📂 Estrutura do Projeto
Plaintext


almoxarifado-node/
├── public/
│   ├── index.html        # Interface SPA (Single Page Application) integrada
│   ├── login.html        # Interface de Autenticação
│   ├── dashboard.html    # Painel Principal
│   ├── produtos.html     # Cadastro e Busca de Produtos
│   └── estoque.html      # Gestão de Entradas, Saídas e Histórico
├── almoxarifado.db       # Arquivo de Banco de Dados SQLite (gerado automaticamente)
├── server.js             # Servidor HTTP e API REST
├── package.json          # Dependências do Projeto
└── README.md             # Documentação do Sistema
⚙️ Instalação e Execução
Pré-requisitos
Node.js (versão 14.x ou superior)

npm (gerenciador de pacotes do Node)

Passo a Passo
Instalar as dependências:

Bash


npm install
Iniciar o servidor:

Bash


npm start
Acessar a aplicação no navegador:

Plaintext


http://localhost:3000
🔑 Credenciais para Teste
Ao iniciar o servidor pela primeira vez, o banco de dados é populado automaticamente com os seguintes usuários:

Nome,E-mail,Senha,Cargo
Carlos Silva,carlos@embalagens.com,123456,Almoxarife
Mariana Souza,mariana@embalagens.com,123456,Gerente de Produção
João Pedro,joao@embalagens.com,123456,Operador de Estoque

🗄️ Modelagem do Banco de Dados (almoxarifado.db)
Tabela usuarios
id (INTEGER PRIMARY KEY AUTOINCREMENT)

nome (TEXT NOT NULL)

email (TEXT UNIQUE NOT NULL)

senha (TEXT NOT NULL)

cargo (TEXT NOT NULL)

Tabela categorias
id (INTEGER PRIMARY KEY AUTOINCREMENT)

nome (TEXT NOT NULL)

descricao (TEXT)

Tabela produtos
id (INTEGER PRIMARY KEY AUTOINCREMENT)

codigo_sku (TEXT UNIQUE NOT NULL)

nome (TEXT NOT NULL)

id_categoria (INTEGER FK -> categorias.id)

especificacoes (TEXT — gramatura, dimensões, tipo de tampa, capacidade)

peso_kg (REAL NOT NULL)

estoque_atual (INTEGER DEFAULT 0)

estoque_minimo (INTEGER DEFAULT 10)

Tabela movimentacoes
id (INTEGER PRIMARY KEY AUTOINCREMENT)

id_produto (INTEGER FK -> produtos.id)

id_usuario (INTEGER FK -> usuarios.id)

tipo (TEXT CHECK: 'ENTRADA' ou 'SAIDA')

quantidade (INTEGER NOT NULL)

data_hora (DATETIME DEFAULT CURRENT_TIMESTAMP)

observacao (TEXT)

📋 Funcionalidades Implementadas
RF01 - Autenticação e Acesso: Tela de login com validação de credenciais, tratamento de erros e sessão ativa.

RF02 - Dashboard Principal: Apresentação de usuário logado, opção de encerramento de sessão (logout) e atalhos rápidos.

RF03 - Gestão de Produtos: CRUD completo (Criar, Consultar, Editar e Excluir) com suporte a especificações de embalagens (gramaturas, dimensões e capacidade).

RF04 - Busca Reativa: Filtro dinâmico em tempo real por nome do produto ou código SKU.

RF05 - Validação de Dados: Impedimento de dados vazios ou inconsistentes no front-end e no back-end.

RF06 - Lançamentos de Estoque: Módulo de entrada (+) e saída (-) com atualização instantânea do saldo em estoque.

RF07 - Alertas de Estoque Mínimo: Identificação visual e mensagens de aviso automáticas para produtos com saldo abaixo do limite configurado.

RF08 - Audit e Rastreabilidade: Histórico imutável gravando data/hora, tipo de operação, quantidade, produto e usuário responsável.

🛣️ Endpoints da API REST

Método,Rota,Descrição
POST,/api/login,Autentica o usuário e retorna o perfil
GET,/api/categorias,Lista todas as categorias de produtos
GET,/api/produtos,Lista os produtos (aceita filtro via query string ?q=)
POST,/api/produtos,Cadastra um novo produto
PUT,/api/produtos/:id,Atualiza os dados de um produto
DELETE,/api/produtos/:id,Remove um produto do banco de dados
GET,/api/movimentacoes,Retorna o histórico de movimentações
POST,/api/movimentacoes,Registra uma nova entrada ou saída

🎯 Mapeamento de Entregas da Atividade Prática

N°,Entrega,Status,Implementação
1,Lista de requisitos funcionais,✅ Concluído,Documentado na seção Funcionalidades Implementadas
2,Diagrama entidade relacionamento (DER),✅ Concluído,Mapeado na estrutura DDL do banco SQLite
3,Script SQL e população do banco,✅ Concluído,Automático no server.js (popula 3+ registros por tabela)
4,Interface de autenticação,✅ Concluído,public/login.html e no SPA index.html
5,Interface principal,✅ Concluído,public/dashboard.html e no SPA index.html
6,Interface cadastro de produto,✅ Concluído,public/produtos.html e no SPA index.html
7,Interface gestão de estoque,✅ Concluído,public/estoque.html e no SPA index.html
8,Casos de Teste,✅ Concluído,Validado via formulários com bloqueios de entrada/saída inconsistente
9,Requisitos de infraestrutura,✅ Concluído,Ambiente Node.js + Express + SQLite3