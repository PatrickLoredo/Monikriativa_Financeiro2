// =====================================================
// PRODUTOS.JS
// =====================================================

// Carrega categorias do localStorage (ou inicia vazio)
const listaCategoriasProdutos = JSON.parse(localStorage.getItem("listaCategoriasProdutos")) || [];

// Carrega cadastro Produtos do localStorage (ou inicia vazio)
const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];

// Notificações
let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 1;
const badgeNotificacao = document.getElementById("badge-notificacao");

// =====================================================
// FUNÇÕES DE NOTIFICAÇÃO
// =====================================================
function muda_badge() {
    badgeNotificacao.textContent = notificacoes;
    notificacoes++;
    localStorage.setItem("notificacoes", notificacoes);
}

function balancarSino() {
    const valor = badgeNotificacao.textContent.trim();
    const sino = document.getElementById('sinoNotificacao');
    if (!valor || Number(valor) === 0) {
        sino.classList.remove('fa-shake');
    } else {
        sino.classList.add('fa-shake');
    }
}

// =====================================================
// FUNÇÕES DE PRODUTOS
// =====================================================
function alternarModoEdicao(botao) {
    const icone = botao.querySelector('i');

    // Sobe até a linha completa (que contém inputs e selects)
    const linhaProduto = botao.closest('.row.text-center');

    if (!linhaProduto) return;

    // Seleciona os inputs e selects da linha
    const campos = linhaProduto.querySelectorAll('input, select');

    // Verifica se está em modo de edição
    const estaEditando = botao.classList.contains('btn-success');

    if (estaEditando) {
        // 🔒 DESATIVA
        campos.forEach(campo => campo.disabled = true);
        botao.classList.replace('btn-success', 'btn-primary');
        icone.classList.replace('fa-save', 'fa-edit');
    } else {
        // ✏️ ATIVA
        campos.forEach(campo => campo.disabled = false);
        botao.classList.replace('btn-primary', 'btn-success');
        icone.classList.replace('fa-edit', 'fa-save');
    }
}


// =====================================================
// CATEGORIAS DE PRODUTOS
// =====================================================
function adicionarNovaCategoriaProduto() {
    const input = document.getElementById("inputNovaCategoriaProduto");
    const btnAdicionar = document.getElementById('btnAdicionarNovaCategoriaProduto');
    const btnSalvar = document.getElementById('btnSalvarNovaCategoriaProduto');

    input.disabled = false;
    input.value = '';
    btnAdicionar.classList.add('d-none');
    btnSalvar.classList.remove('d-none');
}

class CategoriaProduto {
    constructor(categoria) {
        this.categoria = categoria;
        this.dataCadastro = new Date().toLocaleDateString();
    }
}

function salvarNovaCategoriaProduto() {
    const input = document.getElementById("inputNovaCategoriaProduto");
    const valor = input.value.trim();

    if (!valor) {
        alert("Informe o nome da categoria!");
        return;
    }

    const novaCategoria = new CategoriaProduto(valor);

    listaCategoriasProdutos.push(novaCategoria);
    localStorage.setItem("listaCategoriasProdutos", JSON.stringify(listaCategoriasProdutos));

    renderizarCategorias();
    atualizarSelectCategorias();
    redenrizarListaCompletaCategorias();

    input.disabled = true;
    input.value = '';
    document.getElementById('btnAdicionarNovaCategoriaProduto').classList.remove('d-none');
    document.getElementById('btnSalvarNovaCategoriaProduto').classList.add('d-none');

    alert(`Categoria "${valor}" adicionada com sucesso!`);
}

function renderizarCategorias() {
    const container = document.getElementById('amostradeCategorias');
    container.innerHTML = '';

    if (!listaCategoriasProdutos.length) {
        container.innerHTML = '<p class="text-muted">Nenhuma categoria cadastrada.</p>';
        return;
    }

    const row = document.createElement('div');
    row.classList.add('row', 'g-2');

    listaCategoriasProdutos.forEach((categoria, index) => {
        const col = document.createElement('div');
        col.classList.add('col-auto');

        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center px-3 py-1';
        btn.textContent = categoria.categoria;
        btn.onclick = () => mostraCategoriaCadastradaProduto(index);

        col.appendChild(btn);
        row.appendChild(col);
    });

    container.appendChild(row);
}

function mostraCategoriaCadastradaProduto(indice) {
    const categoria = listaCategoriasProdutos[indice];
    if (categoria) alert(`Índice: ${indice}\nCategoria: ${categoria.categoria}`);
    else alert('Categoria não encontrada.');
}

function atualizarSelectCategorias() {
    const select = document.getElementById("selectCategoriaProduto");
    if (!select) return;

    select.innerHTML = '<option value="">-</option>';
    listaCategoriasProdutos.forEach(c => {
        const option = document.createElement("option");
        option.value = c.categoria;
        option.textContent = c.categoria;
        select.appendChild(option);
    });
}

// =====================================================
// LISTA COMPLETA DE CATEGORIAS
// =====================================================
function redenrizarListaCompletaCategorias() {
    const campo = document.getElementById('campoListaCompletaCategorias');
    campo.innerHTML = '';

    if (!listaCategoriasProdutos.length) {
        campo.innerHTML = '<p class="text-muted">Nenhuma categoria cadastrada.</p>';
        return;
    }

    // Cabeçalho
    const cabecalho = document.createElement('div');
    cabecalho.classList.add('row', 'fw-bold', 'mb-2');
    cabecalho.innerHTML = `
        <div class="col-4 label-format">DATA CADASTRO</div>
        <div class="col-4 label-format">CATEGORIA</div>
        <div class="col-4 label-format">AÇÕES</div>
    `;
    campo.appendChild(cabecalho);

    // Linhas de categorias
    listaCategoriasProdutos.forEach((c, index) => {
        const linha = document.createElement('div');
        linha.classList.add('row', 'mb-1', 'align-items-center');

        linha.innerHTML = `
            <div class="col-4 text-center">${c.dataCadastro}</div>
            <div class="col-4 text-center">${c.categoria}</div>
            <div class="col-4 text-center">
                <button class="btn btn-sm btn-primary me-2" onclick="editarCategoria(${index})"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="excluirCategoria(${index})"><i class="fa fa-trash"></i></button>
            </div>
        `;
        campo.appendChild(linha);
    });
}

// =====================================================
// LISTA COMPLETA DE CATEGORIAS
// =====================================================

class CadastroProduto {
    constructor(codigoProduto, dataCadastroProduto, nomeProduto, categoriaProduto, variacaoProduto, precoCusto, precoVenda, estoque) {
        this.codigoProduto = codigoProduto;
        this.dataCadastroProduto = dataCadastroProduto;
        this.nomeProduto = nomeProduto;
        this.categoriaProduto = categoriaProduto;
        this.variacaoProduto = variacaoProduto;
        this.precoCusto = precoCusto;
        this.precoVenda = precoVenda;
        this.estoque = estoque;
    }
}

// =====================================================
// FUNÇÕES EDITAR / EXCLUIR
// =====================================================
function editarCategoria(indice) {
    const novaCategoria = prompt("Edite o nome da categoria:", listaCategoriasProdutos[indice].categoria);
    if (novaCategoria && novaCategoria.trim() !== '') {
        listaCategoriasProdutos[indice].categoria = novaCategoria.trim();
        localStorage.setItem("listaCategoriasProdutos", JSON.stringify(listaCategoriasProdutos));
        renderizarCategorias();
        atualizarSelectCategorias();
        redenrizarListaCompletaCategorias();
    }
}

function excluirCategoria(indice) {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;

    listaCategoriasProdutos.splice(indice, 1);
    localStorage.setItem("listaCategoriasProdutos", JSON.stringify(listaCategoriasProdutos));

    renderizarCategorias();
    atualizarSelectCategorias();
    redenrizarListaCompletaCategorias();
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================
window.addEventListener('load', () => {
    renderizarCategorias();
    atualizarSelectCategorias();
    redenrizarListaCompletaCategorias();
    muda_badge();
    balancarSino();
    atualizaDataCadastroProduto();

    const ModalReal = document.getElementById('modalCadastroCapasProduto');
    const modal = new bootstrap.Modal(ModalReal);
    modal.show();
});

function atualizaDataCadastroProduto(){
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();

    const dataFormatada = `${ano}-${mes}-${dia}`;
    document.getElementById('dataCadastroProduto').value = dataFormatada;
    document.getElementById('dataCadastroCapas').value = dataFormatada;
    atualizarCodigoCadastroProduto();
}
function atualizarCodigoCadastroProduto() {
    const proximoCodigo = (listaCadastroProdutos.length + 1).toString().padStart(2, '0');
    const codigoCadastroProduto = document.getElementById('codigoCadastroProduto');
    codigoCadastroProduto.value = 'PRD ' + proximoCodigo;
}

function CadastrarCapaProduto(){
    const campoExibicaoCadastroCapas = document.getElementById('campoExibicaoCadastroCapas');
    const novaLinha = document.createElement('row');
    const novaColuna = document.createElement('col');
}

// Função genérica para preview de imagem
function configurarPreviewImagem(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!input || !preview) return;

    input.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            preview.style.display = 'none';
        }
    });
}

// Ativa o preview para todas as três imagens
window.addEventListener('DOMContentLoaded', () => {
    configurarPreviewImagem('imagemProduto1', 'previewImagemProduto1');
    configurarPreviewImagem('imagemProduto2', 'previewImagemProduto2');
    configurarPreviewImagem('imagemProduto3', 'previewImagemProduto3');
});
