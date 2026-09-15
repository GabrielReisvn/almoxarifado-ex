const API = "/api";

let usuarioLogado = null;
let produtos = [];
let categorias = [];
let movimentacoes = [];

//API

async function api(url, options = {}) {
    const response = await fetch(API + url, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erro na requisição.");
    }return data;
}

//LOGIN

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("username").value;
    const senha = document.getElementById("password").value;

    try {
        const data = await api("/login", {
            method: "POST",
            body: JSON.stringify({ email, senha })
        });

        usuarioLogado = data.usuario;
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("navSection").classList.remove("hidden");
        carregarSistema();

    } catch (error) {
        document.getElementById("loginAlert").classList.remove("hidden");
        document.getElementById("loginAlertMsg").textContent = error.message;
    }
});

// Inicialização do sistema após login

async function carregarSistema() {
    document.getElementById("loggedUser").textContent =
        `${usuarioLogado.nome} - ${usuarioLogado.cargo}`;
    await carregarCategorias();
    await carregarProdutos();
    await carregarMovimentacoes();
    preencherProdutosMovimento();
    atualizarDashboard();
}

//Nav

function showSection(section) {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("products").classList.add("hidden");
    document.getElementById("movements").classList.add("hidden");
    document.getElementById(section).classList.remove("hidden");
    if (section === "products") {
        carregarProdutos();
    }
    if (section === "movements") {
        carregarMovimentacoes();
        preencherProdutosMovimento();
    }
}

function logout() {
    usuarioLogado = null;
    document.getElementById("navSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("loginForm").reset();
    document.getElementById("loginAlert").classList.add("hidden");
    showSection("dashboard");
}

// categorias

async function carregarCategorias() {
    categorias = await api("/categorias");
    const selects = [
        document.getElementById("productCategory"),
        document.getElementById("editProductCategory")
    ];

    selects.forEach(select => {
        select.innerHTML = `<option value="">Categoria</option>`;

        categorias.forEach(categoria => {
            select.innerHTML += `
                <option value="${categoria.id}">
                    ${categoria.nome}
                </option> `;
        });});
}

// Produtos
async function carregarProdutos() {
    produtos = await api("/produtos");

    renderizarProdutos();
    preencherProdutosMovimento();
    atualizarDashboard();
}

function renderizarProdutos(lista = produtos) {
    const tabela = document.getElementById("productsTable");
    if (!lista.length) {
        tabela.innerHTML = `
            <tr>
                <td colspan="6" class="p-4 text-center">
                    Nenhum produto encontrado.
                </td>
            </tr>
        `;
        return;}

    tabela.innerHTML = lista.map(produto => `
        <tr class="border-t">
            <td class="p-3">
                ${produto.codigo_sku}
            </td>
            <td class="p-3">
                ${produto.nome}
            </td>
            <td class="p-3">
                ${produto.categoria_nome}
            </td>
            <td class="p-3 font-semibold ${
                produto.estoque_atual <= produto.estoque_minimo
                    ? "text-red-600"
                    : "text-green-600"
            }">
                ${produto.estoque_atual}
            </td>
            <td class="p-3">
                ${produto.estoque_minimo}
            </td>
            <td class="p-3 text-center whitespace-nowrap">
                <button
                    onclick="editarProduto(${produto.id})"
                    class="text-blue-600 mr-3"
                    title="Editar">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button
                    onclick="excluirProduto(${produto.id})"
                    class="text-red-600"
                    title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

//Buscar

document.getElementById("productSearch").addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    const resultado = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termo) ||
        produto.codigo_sku.toLowerCase().includes(termo)
    );
    renderizarProdutos(resultado);
});

// Novo Produto

document.getElementById("newProductForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const produto = {
        codigo_sku: document.getElementById("productSku").value,
        nome: document.getElementById("productName").value,
        id_categoria: document.getElementById("productCategory").value,
        especificacoes: document.getElementById("productSpecifications").value,
        peso_kg: Number(document.getElementById("productWeight").value),
        estoque_atual: Number(document.getElementById("productInitialStock").value),
        estoque_minimo: Number(document.getElementById("productMinStock").value)
    };

    try {
        await api("/produtos", {
            method: "POST",
            body: JSON.stringify(produto)
        });
        alert("Produto cadastrado com sucesso!");
        document.getElementById("newProductForm").reset();
        hideProductForm();
        await carregarProdutos();
    } catch (error) {
        alert(error.message);
    }
});

// MOSTRAR / ESCONDER FORMULÁRIO
function showProductForm() {
    document.getElementById("productForm").classList.remove("hidden");
    document.getElementById("editProductSection").classList.add("hidden");
}
function hideProductForm() {
    document.getElementById("productForm").classList.add("hidden");
}

// Editar Produto

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);

    if (!produto) return;
    document.getElementById("editProductId").value = produto.id;
    document.getElementById("editProductSku").value = produto.codigo_sku;
    document.getElementById("editProductName").value = produto.nome;
    document.getElementById("editProductCategory").value = produto.id_categoria;
    document.getElementById("editProductWeight").value = produto.peso_kg;
    document.getElementById("editProductCurrentStock").value =
        produto.estoque_atual;
    document.getElementById("editProductMinStock").value =
        produto.estoque_minimo;
    document.getElementById("editProductSpecifications").value =
        produto.especificacoes || "";
    document.getElementById("editProductSection").classList.remove("hidden");
    document.getElementById("productForm").classList.add("hidden");

    document.getElementById("editProductSection")
        .scrollIntoView({ behavior: "smooth" });
}

// Salvar alteração

document.getElementById("editProductForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editProductId").value;
    const produto = {
        codigo_sku: document.getElementById("editProductSku").value,
        nome: document.getElementById("editProductName").value,
        id_categoria: document.getElementById("editProductCategory").value,
        especificacoes:
            document.getElementById("editProductSpecifications").value,
        peso_kg:
            Number(document.getElementById("editProductWeight").value),
        estoque_minimo:
            Number(document.getElementById("editProductMinStock").value)
    };try {
        await api(`/produtos/${id}`, {
            method: "PUT",
            body: JSON.stringify(produto)
        });
        alert("Produto atualizado!");
        hideEditProductForm();
        await carregarProdutos();
    } catch (error) {
        alert(error.message);
    }
});
function hideEditProductForm() {
    document.getElementById("editProductSection").classList.add("hidden");
}

// Excluir Produto
async function excluirProduto(id) {
    if (!confirm("Deseja realmente excluir este produto?")) {
        return;
    }
    try {
        await api(`/produtos/${id}`, {
            method: "DELETE"
        });
        alert("Produto excluído!");
        await carregarProdutos();
    } catch (error) {
        alert(error.message);
    }
}

// movimentações
async function carregarMovimentacoes() {
    movimentacoes = await api("/movimentacoes");
    renderizarMovimentacoes();
    atualizarDashboard();
}

function renderizarMovimentacoes() {
    const tabela = document.getElementById("movementsTable");
    if (!movimentacoes.length) {
        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="p-4 text-center">
                    Nenhuma movimentação encontrada.
                </td>
            </tr>
        `; return;}

    tabela.innerHTML = movimentacoes.map(mov => `
        <tr class="border-t">
            <td class="p-3">
                ${formatarData(mov.data_hora)}
            </td>
            <td class="p-3">
                ${mov.produto_nome}
            </td>
            <td class="p-3">
                ${mov.codigo_sku}
            </td>
            <td class="p-3 font-semibold ${
                mov.tipo === "ENTRADA"
                    ? "text-green-600"
                    : "text-red-600"
            }">
                ${mov.tipo}
            </td>
            <td class="p-3">
                ${mov.quantidade}
            </td>
            <td class="p-3">
                ${mov.usuario_nome}
            </td>
            <td class="p-3">
                ${mov.observacao || "-"}
            </td>
        </tr>
    `).join("");
}

// produtos no select de movimentação
function preencherProdutosMovimento() {

    const select = document.getElementById("movementProduct");

    if (!select) return;

    select.innerHTML = `
        <option value="">Produto</option>
    `;
    produtos.forEach(produto => {
        select.innerHTML += `
            <option value="${produto.id}">
                ${produto.codigo_sku} - ${produto.nome}
            </option>
        `;});
}
// Registrar movimentação
document.getElementById("movementForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!usuarioLogado) {
        alert("Usuário não identificado.");
        return;}
    const movimentacao = {
        id_produto:
            document.getElementById("movementProduct").value,
        id_usuario:
            usuarioLogado.id,
        tipo:
            document.getElementById("movementType").value,
        quantidade:
            Number(document.getElementById("movementQuantity").value),
        observacao:
            document.getElementById("movementObservation").value
    };
    try {
        await api("/movimentacoes", {
            method: "POST",
            body: JSON.stringify(movimentacao)
        });
        alert("Movimentação registrada!");
        document.getElementById("movementForm").reset();
        await carregarProdutos();
        await carregarMovimentacoes();
    } catch (error) {
        alert(error.message);
    }
});

// DASHBOARD
function atualizarDashboard() {
    document.getElementById("DashProdutos").textContent =
        produtos.length;
    const estoqueBaixo = produtos.filter(
        p => p.estoque_atual <= p.estoque_minimo
    ).length;
    document.getElementById("DashEstoqueBaixo").textContent =
        estoqueBaixo;

    const entradas = movimentacoes
        .filter(m => m.tipo === "ENTRADA")
        .reduce((total, m) => total + Number(m.quantidade), 0);
    const saidas = movimentacoes
        .filter(m => m.tipo === "SAIDA")
        .reduce((total, m) => total + Number(m.quantidade), 0);
    document.getElementById("DashEntradas").textContent =
        entradas;
    document.getElementById("DashSaidas").textContent =
        saidas;

    // Últimas 5 movimentações
    const recentes = movimentacoes.slice(0, 5);
    const tabela = document.getElementById("DashTableMovs");

    if (!recentes.length) {
        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="p-4 text-center">
                    Nenhuma movimentação.
                </td>
            </tr>
        `;
        return;
    }
    tabela.innerHTML = recentes.map(mov => `
        <tr class="border-t">
            <td class="p-3">
                ${mov.produto_nome}
            </td>
            <td class="p-3 ${
                mov.tipo === "ENTRADA"
                    ? "text-green-600"
                    : "text-red-600"
            }">
                ${mov.tipo}
            </td>
            <td class="p-3">
                ${mov.quantidade}
            </td>
            <td class="p-3">
                ${mov.usuario_nome}
            </td>
            <td class="p-3">
                ${formatarData(mov.data_hora)}
            </td>
        </tr>
    `).join("");
}

//data
function formatarData(data) {

    if (!data) return "-";
    const d = new Date(data.replace(" ", "T"));
    if (isNaN(d.getTime())) {
        return data;}
    return d.toLocaleString("pt-BR");
}
