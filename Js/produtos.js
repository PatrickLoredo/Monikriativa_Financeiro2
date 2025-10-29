// =====================================================
// PRODUTOS.JS
// =====================================================

// Carrega categorias do localStorage (ou inicia vazio)
const listaCategoriasProdutos = JSON.parse(localStorage.getItem("listaCategoriasProdutos")) || [];

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
    if (botao.classList.contains('btn-primary')) {
        botao.classList.replace('btn-primary', 'btn-success');
        icone.classList.replace('fa-edit', 'fa-save');
    } else {
        botao.classList.replace('btn-success', 'btn-primary');
        icone.classList.replace('fa-save', 'fa-edit');
    }
}

function calculaPrecificacaoCorreta() {
    const custoProduto = parseFloat(document.getElementById("custoProduto").value.replace(',', '.')) || 0;
    const taxaPercentual = parseFloat(document.getElementById("taxaPlataforma").value) / 100 || 0;
    const taxaFixa = parseFloat(document.getElementById("taxaFixaPlataforma").value) || 0;
    const precoVenda = parseFloat(document.getElementById("precoVenda").value.replace(',', '.')) || 0;

    const LucroLiquido = document.getElementById("LucroLiquido");
    const LucroReal = document.getElementById("LucroReal");
    const shopeeCustos = document.getElementById("custoRealShopee");
    const custosTotais = document.getElementById("custosTotais");

    const obsprecificacaoideal = document.getElementById("obsprecificacaoideal");
    const obsprecificacaoabaixo = document.getElementById("obsprecificacaoabaixo");

    const valorTaxaShopee = precoVenda * taxaPercentual;
    const totalCustos = custoProduto + valorTaxaShopee + taxaFixa;
    const lucroLiquido = precoVenda - totalCustos;
    const margemFinal = (lucroLiquido * 100) / totalCustos;

    shopeeCustos.value = (totalCustos - custoProduto).toFixed(2);
    custosTotais.value = totalCustos.toFixed(2);

    LucroLiquido.value = lucroLiquido.toFixed(2);
    LucroReal.value = margemFinal.toFixed(1);

    if (isNaN(margemFinal)) {
        obsprecificacaoideal.classList.add('d-none');
        obsprecificacaoabaixo.classList.add('d-none');
    } else if (margemFinal >= 40) {
        obsprecificacaoideal.classList.remove('d-none');
        obsprecificacaoabaixo.classList.add('d-none');
    } else {
        obsprecificacaoideal.classList.add('d-none');
        obsprecificacaoabaixo.classList.remove('d-none');
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
});
