# 📦 AlmoxTech - Sistema de Gestão de Almoxarifado
> **Solução Informatizada para Controle de Estoque e Embalagens Industriais**

![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-1.0.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)

---

## 📑 Sumário
1. [Descrição do Projeto](#-descrição-do-projeto)
2. [Status do Projeto](#-status-do-projeto)
3. [Funcionalidades e Requisitos](#-funcionalidades-e-requisitos)
4. [Acesso ao Projeto e Como Executar](#-acesso-ao-projeto-e-como-executar)
5. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
6. [Modelo de Banco de Dados (DER & Script SQL)](#-modelo-de-banco-de-dados-der--script-sql)
7. [Arquitetura de Rotas da API (Mapeamento Backend)](#-arquitetura-de-rotas-da-api-mapeamento-backend)
8. [Entregáveis e Critérios de Avaliação](#-entregáveis-e-critérios-de-avaliação)
9. [Pessoas Contribuidoras / Desenvolvedoras](#-pessoas-contribuidoras--desenvolvedoras)
10. [Conclusão](#-conclusão)

---

## 📝 Descrição do Projeto

O **AlmoxTech** é um sistema web desenvolvido para automatizar e otimizar a gestão de estoques em indústrias de embalagens (caixas de papelão, frascos plásticos, insumos de lacre e sinalização).

O sistema resolve problemas críticos enfrentados por almoxarifados fabris, tais como:
* Ruptura de estoque devido à falta de monitoramento do **estoque mínimo**.
* Ausência de **rastreabilidade imutável** em saídas para a linha de produção.
* Ineficiência em buscas de insumos por especificações técnicas (gramatura, capacidade, tipo de tampa, dimensões).
* Erros de digitação e inconsistência de dados.

Construído como uma aplicação de página única (*Single Page Application* - SPA), o sistema possui interface responsiva, alertas dinâmicos e persistência local via `localStorage`.

---

## 🚀 Status do Projeto

> **Status:** ✅ Concluído e Pronto para Avaliação / Implantação.

Todas as telas, validações de formulário, regra de negócio para estoque mínimo, controle de sessão e histórico de rastreabilidade foram implementadas e testadas.

---

## ✨ Funcionalidades e Requisitos

### 🔹 Requisitos Funcionais (RF)

| Código | Descrição |
| :--- | :--- |
| **RF01** | **Autenticação de Usuários:** Permite login com credenciais corporativas e controle de sessão por perfil (Almoxarife, Gerente, Operador). |
| **RF02** | **Painel Principal (Dashboard):** Exibe métricas em tempo real (Total de Produtos, Itens Críticos, Entradas do Mês, Saídas do Mês). |
| **RF03** | **Cadastro de Embalagens:** Permite cadastrar, editar e excluir itens especificando SKU, Categoria, Nome, Especificações Técnicas, Peso Unitário, Estoque Inicial e Estoque Mínimo. |
| **RF04** | **Pesquisa Reativa e Filtros:** Permite filtrar produtos instantaneamente por nome, SKU ou categoria sem recarregar a página. |
| **RF05** | **Alerta Automático de Estoque Mínimo:** Dispara sinalizações visuais de emergência e um painel de alerta sempre que o saldo atual for inferior ao estoque mínimo. |
| **RF06** | **Gestão de Movimentações:** Registra entradas (recebimentos/notas fiscais) e saídas (baixas para a linha de envase/produção). |
| **RF07** | **Validação de Saldo:** Impede saídas superiores ao estoque disponível no almoxarifado. |
| **RF08** | **Histórico de Auditoria Rastreável:** Mantém log imutável contendo data/hora, produto, tipo de movimentação, quantidade, operador responsável e observação/NF. |

### 🔸 Requisitos Não-Funcionais (RNF)

* **RNF01 - Usabilidade:** Interface intuitiva baseada no Tailwind CSS, com suporte a modo responsivo (desktop e dispositivos móveis).
* **RNF02 - Desempenho:** Carregamento ultra-rápido via cliente (browser-side execution) sem dependências pesadas.
* **RNF03 - Persistência de Dados:** Uso de `localStorage` para manter os dados salvos entre sessões, acompanhado de carga inicial (*seed data*).
* **RNF04 - Integridade dos Dados:** Validação rigorosa de campos obrigatórios, impedindo duplicidade de SKUs e valores numéricos negativos.

---

## 💻 Acesso ao Projeto e Como Executar

### Pré-requisitos
Para rodar o projeto, você precisa apenas de um **navegador web moderno** (Google Chrome, Mozilla Firefox, Microsoft Edge ou Safari). Não é necessária instalação de ambiente backend ou Node.js para a versão frontend interativa.

### Passo a Passo de Execução

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/almoxtech-gestao-estoque.git
   ```
2. **Navegar até a pasta do projeto:**
   ```bash
   cd almoxtech-gestao-estoque
   ```
3. **Executar a aplicação:**
   * Basta dar um duplo clique no arquivo `index.html` ou abri-lo diretamente no navegador.
   * *Opcional:* Se utilizar o VS Code, utilize a extensão **Live Server** para rodar em servidor local (`http://127.0.0.1:5500`).

---

### 🔑 Credenciais para Teste Rápido (Acesso Avaliador)

Para facilitar o processo de correção/avaliação, o sistema conta com atalhos de preenchimento rápido na tela de login:

| Usuário | E-mail Corporativo | Senha | Cargo |
| :--- | :--- | :--- | :--- |
| **Carlos Silva** | `carlos@embalagens.com` | `123456` | Almoxarife |
| **Mariana Souza** | `mariana@embalagens.com` | `123456` | Gerente de Produção |
| **João Pedro** | `joao@embalagens.com` | `123456` | Operador de Estoque |

---

## 🛠 Tecnologias Utilizadas

* **Linguagem Principal:** HTML5, CSS3 e JavaScript (ES6+ Vanilla).
* **Estilização & UI:** [Tailwind CSS v3](https://tailwindcss.com/) (via CDN).
* **Iconografia:** [FontAwesome 6 Free](https://fontawesome.com/).
* **Tipografia:** [Google Fonts - Inter](https://fonts.google.com/specimen/Inter).
* **Armazenamento Temporal:** HTML5 Web Storage API (`localStorage`).

---

## 🗄 Modelo de Banco de Dados (DER & Script SQL)

O sistema foi modelado segundo as melhores práticas de banco de dados relacionais para garantir a **3ª Forma Normal (3FN)** e integridade referencial.

### Diagrama Entidade-Relacionamento (Conceitual)

```
+-------------------+       1:N       +-------------------------+
|      USUARIO      |----------------<|  MOVIMENTACAO_ESTOQUE   |
+-------------------+                 +-------------------------+
| id_usuario (PK)   |                 | id_movimentacao (PK)    |
| nome              |                 | id_produto (FK)         |
| email (UNIQUE)    |                 | id_usuario (FK)         |
| senha             |                 | tipo (ENTRADA/SAIDA)    |
| cargo             |                 | quantidade              |
+-------------------+                 | data_hora               |
                                      | observacao              |
+-------------------+       1:N       +-------------------------+
|      PRODUTO      |----------------<|
+-------------------+                 
| id_produto (PK)   |
| codigo_sku(UNIQUE)|
| nome              |
| categoria         |
| especificacoes    |
| peso_kg           |
| estoque_atual     |
| estoque_minimo    |
+-------------------+
```

### Script de Criação SQL (`almoxarifado_db.sql`)

```sql
-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS almoxarifado_db;
USE almoxarifado_db;

-- 2. Tabela de Usuários / Operadores
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Produtos / Embalagens
CREATE TABLE produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    codigo_sku VARCHAR(30) UNIQUE NOT NULL,
    nome VARCHAR(120) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    especificacoes TEXT NOT NULL,
    peso_kg DECIMAL(8,3) NOT NULL,
    estoque_atual INT DEFAULT 0,
    estoque_minimo INT DEFAULT 10,
    CONSTRAINT chk_peso_positivo CHECK (peso_kg > 0),
    CONSTRAINT chk_estoque_minimo_positivo CHECK (estoque_minimo >= 0)
);

-- 4. Tabela de Movimentações de Estoque (Histórico de Rastreabilidade)
CREATE TABLE movimentacao_estoque (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    id_usuario INT NOT NULL,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
    quantidade INT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    observacao VARCHAR(255),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT chk_qtd_positiva CHECK (quantidade > 0)
);

-- 5. Inserção de Dados Iniciais (Seed Data)
INSERT INTO usuario (nome, email, senha, cargo) VALUES
('Carlos Silva', 'carlos@embalagens.com', '123456', 'Almoxarife'),
('Mariana Souza', 'mariana@embalagens.com', '123456', 'Gerente de Produção'),
('João Pedro', 'joao@embalagens.com', '123456', 'Operador de Estoque');

INSERT INTO produto (codigo_sku, nome, categoria, especificacoes, peso_kg, estoque_atual, estoque_minimo) VALUES
('PAP-300-01', 'Caixa Papelão Reforçada 30x20x15cm', 'Caixas de Papelão', 'Gramatura: 400g/m², Papelão Duplo Ondulado', 0.350, 150, 50),
('FRA-500-02', 'Frasco Plástico PET 500ml', 'Frascos Plásticos', 'Capacidade: 500ml, Tampa Rosca Lacrada HDPE', 0.045, 12, 100),
('PAP-100-03', 'Caixa Papelão Padrão 15x15x10cm', 'Caixas de Papelão', 'Gramatura: 250g/m², Papelão Simples', 0.120, 800, 200),
('FRA-1000-04', 'Frasco Plástico PEAD 1 Litro', 'Frascos Plásticos', 'Capacidade: 1000ml, Tampa Graduada Flip-Top', 0.085, 45, 80),
('LAC-050-05', 'Fita Adesiva Transparente 50mmx100m', 'Insumos de Lacre', 'Largura: 50mm, Adesivo Hot-Melt Alta Fixação', 0.220, 300, 50);
```

---

## 🌐 Arquitetura de Rotas da API (Mapeamento Backend)

Caso a aplicação seja integrada a uma API REST Backend (ex: Node.js/Express, Python/FastAPI ou Java/Spring), as rotas planejadas são:

### Autenticação
* `POST /api/v1/auth/login` - Autentica usuário e retorna Token JWT.
* `POST /api/v1/auth/logout` - Encerra a sessão ativa.

### Produtos / Embalagens
* `GET /api/v1/produtos` - Lista produtos (suporta filtros query: `?busca=...&categoria=...`).
* `GET /api/v1/produtos/:id` - Obtém detalhes de uma embalagem específica.
* `POST /api/v1/produtos` - Cadastra uma nova embalagem no acervo.
* `PUT /api/v1/produtos/:id` - Atualiza dados cadastrais de um produto.
* `DELETE /api/v1/produtos/:id` - Remove um produto sem histórico ativo.

### Movimentações de Estoque
* `GET /api/v1/movimentacoes` - Traz o histórico consolidado de auditoria.
* `POST /api/v1/movimentacoes` - Processa um novo lançamento de Entrada ou Saída com atualização atômica de saldo.

---

## 📦 Entregáveis e Critérios de Avaliação

O projeto atende integralmente aos critérios solicitados para avaliação acadêmica/técnica:

1. **Interface SPA funcional (`index.html`)**: Tela de login, Dashboard, Cadastro CRUD, Gestão de Movimentações e Central de Documentação inclusa no próprio aplicativo.
2. **Requisitos Funcionais e Não-Funcionais explicitados**: Mapeamento completo no código e neste documento.
3. **Validação de Formulários**: Impede envio de campos vazios, inconsistências de tipo de dados e registros inválidos.
4. **Mecanismo de Estoque Mínimo**: Banner de alerta de alta visibilidade e destaque dinâmico de itens críticos.
5. **Rastreabilidade**: Registro detalhado com hora exata e identificação do responsável.

---

## 👥 Pessoas Contribuidoras / Desenvolvedoras

| Foto | Nome / Integrantes | Papel no Projeto | Redes / Contato |
| :---: | :--- | :--- | :--- |
| 🧑‍💻 | **[Nome do Aluno 1 / Desenvolvedor]** | Frontend Developer & UI Designer | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](#) |
| 🧑‍💻 | **[Nome do Aluno 2 / Desenvolvedor]** | Modelagem de Dados & QA Tester | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](#) |

* **Disciplina:** Programação Web / Banco de Dados / Engenharia de Software
* **Instituição:** Insira o Nome da Faculdade / Universidade

---


## 🎯 Conclusão

O **AlmoxTech** demonstra como uma solução web leve e bem estruturada pode transformar a rotina operacional de uma indústria de embalagens, substituindo planilhas frágeis por um sistema seguro, visual e automatizado.
