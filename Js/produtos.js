// =====================================================
// PRODUTOS.JS - ATUALIZADO
// =====================================================

// ================================
// LOCALSTORAGE E LISTAS INICIAIS
// ================================
const listaCategoriasProdutos = JSON.parse(localStorage.getItem("listaCategoriasProdutos")) || [];
const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];
const listaCapasProdutos = JSON.parse(localStorage.getItem("ListaCapasProdutos")) || [];

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
    const linhaProduto = botao.closest('.row.text-center');
    if (!linhaProduto) return;

    const campos = linhaProduto.querySelectorAll('input, select');
    const estaEditando = botao.classList.contains('btn-success');

    if (estaEditando) {
        campos.forEach(campo => campo.disabled = true);
        botao.classList.replace('btn-success', 'btn-primary');
        icone.classList.replace('fa-save', 'fa-edit');
    } else {
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
    renderizarListaCompletaCategorias();

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
    const select = document.getElementById("categoriaCadastroProduto");
    if (!select) return;

    select.innerHTML = '<option value="">-</option>';
    listaCategoriasProdutos.forEach(c => {
        const option = document.createElement("option");
        option.value = c.categoria;
        option.textContent = c.categoria;
        select.appendChild(option);
    });
}

function renderizarListaCompletaCategorias() {
    const campo = document.getElementById('campoListaCompletaCategorias');
    campo.innerHTML = '';

    if (!listaCategoriasProdutos.length) {
        campo.innerHTML = '<p class="text-muted">Nenhuma categoria cadastrada.</p>';
        return;
    }

    const cabecalho = document.createElement('div');
    cabecalho.classList.add('row', 'fw-bold', 'mb-2');
    cabecalho.innerHTML = `
        <div class="col-4 text-center">DATA CADASTRO</div>
        <div class="col-4 text-center">CATEGORIA</div>
        <div class="col-4 text-center">AÇÕES</div>
    `;
    campo.appendChild(cabecalho);

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

function editarCategoria(indice) {
    const novaCategoria = prompt("Edite o nome da categoria:", listaCategoriasProdutos[indice].categoria);
    if (novaCategoria && novaCategoria.trim() !== '') {
        listaCategoriasProdutos[indice].categoria = novaCategoria.trim();
        localStorage.setItem("listaCategoriasProdutos", JSON.stringify(listaCategoriasProdutos));
        renderizarCategorias();
        atualizarSelectCategorias();
        renderizarListaCompletaCategorias();
    }
}

function excluirCategoria(indice) {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;

    listaCategoriasProdutos.splice(indice, 1);
    localStorage.setItem("listaCategoriasProdutos", JSON.stringify(listaCategoriasProdutos));
    renderizarCategorias();
    atualizarSelectCategorias();
    renderizarListaCompletaCategorias();
}

function calculaTaxaShopee() {
    const precoInput = document.getElementById('precoVendaShopeeCadastroProduto');
    const custoShopeeInput = document.getElementById('custoShopeeCadastroProduto');
    const lucroInput = document.getElementById('lucroLiquidoShopeeCadastroInsumo');
    const custoInsumosInput = document.getElementById('custoInsumosCadastroProdutos');
    const percentualInput = document.getElementById('percentualLucroShopeeCadastroInsumo');

    let preco = precoInput.value.replace(',', '.').trim();
    let custoInsumos = custoInsumosInput.value.replace(',', '.').trim();

    preco = parseFloat(preco);
    custoInsumos = parseFloat(custoInsumos) || 0; // se vazio = 0

    if (isNaN(preco)) {
        custoShopeeInput.value = '';
        lucroInput.value = '';
        percentualInput.value = '';
        return;
    }

    const taxaPercentual = 23.5;
    const taxaFixa = 4;

    const custoShopee = (preco * taxaPercentual / 100) + taxaFixa;
    const lucroLiquido = preco - custoShopee - custoInsumos;
    const percentualLucro = (lucroLiquido * 100 / preco);

    custoShopeeInput.value = custoShopee.toFixed(2);
    lucroInput.value = lucroLiquido.toFixed(2);
    percentualInput.value = percentualLucro.toFixed(2) + ' %';
}




// =====================================================
// DATAS E CÓDIGOS DE PRODUTOS
// =====================================================
class NovoProduto {
    constructor(
        dataCadastroProduto, 
        codigoCadastroProduto, 
        nomeCadastroProduto,
        plataformaCadastroProduto,
        categoriaCadastroProduto,
        custoInsumosCadastroProdutos,
        estoqueCadastroProdutos,
        precoVendaShopeeCadastroProduto,
        custoShopeeCadastroProduto,
        lucroLiquidoShopeeCadastroInsumo,
        percentualLucroShopeeCadastroInsumo,
        precoVendaElo7CadastroProduto,
        custoElo7CadastroProduto,
        lucroLiquidoElo7CadastroInsumo,
        percentualLucroElo7CadastroInsumo
    ) {
        this.dataCadastroProduto = dataCadastroProduto;
        this.codigoCadastroProduto = codigoCadastroProduto;
        this.nomeCadastroProduto = nomeCadastroProduto;
        this.plataformaCadastroProduto = plataformaCadastroProduto;
        this.categoriaCadastroProduto = categoriaCadastroProduto;
        this.custoInsumosCadastroProdutos = custoInsumosCadastroProdutos;
        this.estoqueCadastroProdutos = estoqueCadastroProdutos;
        this.precoVendaShopeeCadastroProduto = precoVendaShopeeCadastroProduto;
        this.custoShopeeCadastroProduto = custoShopeeCadastroProduto;
        this.lucroLiquidoShopeeCadastroInsumo = lucroLiquidoShopeeCadastroInsumo;
        this.percentualLucroShopeeCadastroInsumo = percentualLucroShopeeCadastroInsumo;
        this.precoVendaElo7CadastroProduto = precoVendaElo7CadastroProduto;
        this.custoElo7CadastroProduto = custoElo7CadastroProduto;
        this.lucroLiquidoElo7CadastroInsumo = lucroLiquidoElo7CadastroInsumo;
        this.percentualLucroElo7CadastroInsumo = percentualLucroElo7CadastroInsumo;
    }
}

// ======================================
//  FUNÇÃO PARA SALVAR PRODUTO
// ======================================
function salvarCadastroProduto() {
   
    const dataCadastroProduto = document.getElementById('dataCadastroProduto').value;
    const codigoCadastroProduto = document.getElementById('codigoCadastroProduto').value.trim();
    const nomeCadastroProduto = document.getElementById('nomeCadastroProduto').value.trim();
    const plataformaCadastroProduto = document.getElementById('plataformaCadastroProduto').value.trim();
    const categoriaCadastroProduto = document.getElementById('categoriaCadastroProduto').value.trim();
    const custoInsumosCadastroProdutos = document.getElementById('custoInsumosCadastroProdutos').value.trim();
    const estoqueCadastroProdutos = document.getElementById('estoqueCadastroProdutos').value.trim();
    const precoVendaShopeeCadastroProduto = document.getElementById('precoVendaShopeeCadastroProduto').value.trim();
    const custoShopeeCadastroProduto = document.getElementById('custoShopeeCadastroProduto').value.trim();
    const lucroLiquidoShopeeCadastroInsumo = document.getElementById('lucroLiquidoShopeeCadastroInsumo').value.trim();
    const percentualLucroShopeeCadastroInsumo = document.getElementById('percentualLucroShopeeCadastroInsumo').value.trim();
    const precoVendaElo7CadastroProduto = document.getElementById('precoVendaElo7CadastroProduto').value.trim();
    const custoElo7CadastroProduto = document.getElementById('custoElo7CadastroProduto').value.trim();
    const lucroLiquidoElo7CadastroInsumo = document.getElementById('lucroLiquidoElo7CadastroInsumo').value.trim();
    const percentualLucroElo7CadastroInsumo = document.getElementById('percentualLucroElo7CadastroInsumo').value.trim();

    // Campos obrigatórios
    if (!dataCadastroProduto || !codigoCadastroProduto || !nomeCadastroProduto || !plataformaCadastroProduto || !categoriaCadastroProduto || !custoInsumosCadastroProdutos || !precoVendaShopeeCadastroProduto || !precoVendaElo7CadastroProduto) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    // Formatando a data
    const datacadastroProdutoObj = new Date(dataCadastroProduto);
    const dia = String(datacadastroProdutoObj.getDate()).padStart(2,'0');
    const mes = String(datacadastroProdutoObj.getMonth() + 1).padStart(2,'0');
    const ano = datacadastroProdutoObj.getFullYear();
    const dataCadastroProdutoFormatada = `${dia}/${mes}/${ano}`;

    // Verifica se já existe pelo código ou nome
    const indexExistente = listaCadastroProdutos.findIndex(p => p.codigoCadastroProduto === codigoCadastroProduto || p.nomeCadastroProduto.toLowerCase() === nomeCadastroProduto.toLowerCase());

    const novoProduto = new NovoProduto(
        dataCadastroProdutoFormatada,
        codigoCadastroProduto,
        nomeCadastroProduto,
        plataformaCadastroProduto,
        categoriaCadastroProduto,
        custoInsumosCadastroProdutos,
        estoqueCadastroProdutos,
        precoVendaShopeeCadastroProduto,
        custoShopeeCadastroProduto,
        lucroLiquidoShopeeCadastroInsumo,
        percentualLucroShopeeCadastroInsumo,
        precoVendaElo7CadastroProduto,
        custoElo7CadastroProduto,
        lucroLiquidoElo7CadastroInsumo,
        percentualLucroElo7CadastroInsumo
    );

    if (indexExistente > -1) {
        // Sobrescreve
        listaCadastroProdutos[indexExistente] = novoProduto;
        localStorage.setItem('listaCadastroProdutos', JSON.stringify(listaCadastroProdutos));
        alert(`Produto "${nomeCadastroProduto}" atualizado com sucesso!`);
    } else {
        // Novo produto
        listaCadastroProdutos.push(novoProduto);
        localStorage.setItem('listaCadastroProdutos', JSON.stringify(listaCadastroProdutos));
        alert(`Produto "${nomeCadastroProduto}" cadastrado com sucesso!`);
    }

    renderizarProdutos();
    console.log(listaCadastroProdutos)
}


// ======================================
//  FUNÇÃO PARA RENDERIZAR PRODUTOS
// ======================================
function renderizarProdutos() {
    const exibicaoProdutosCadastrados = document.getElementById('exibicaoProdutosCadastrados');
    exibicaoProdutosCadastrados.innerHTML = '';
    listaCadastroProdutos.forEach(produto => exibirProdutoCadastrado(produto));
}

// ======================================
//  FUNÇÃO PARA EXIBIR UM PRODUTO
// ======================================
function exibirProdutoCadastrado(produto) {
    const exibicaoProdutosCadastrados = document.getElementById('exibicaoProdutosCadastrados');

    const row = document.createElement('div');
    row.classList.add('row','bg-light');

    const col = document.createElement('div');
    col.classList.add('col');

    const row2 = document.createElement('div');
    row2.classList.add('row', 'text-center', 'titulo_col');

    row2.innerHTML = `
        <!--NOME DO PRODUTO-->
        <div class="col-5">
            <div class="input-group mt-1">
                <span class="input-group-text bg-primary text-white">
                    <i class="fa fa-tag"></i>
                </span>
                <input type="text" class="form-control text-center" value="${produto.nomeCadastroProduto}" disabled>
            </div>
        </div>

        <!-- CUSTO DE INSUMOS -->
        <div class="col-2">
            <div class="input-group mt-1">
                <span class="input-group-text bg-primary text-white">
                    <i class="fa-solid fa-brazilian-real-sign"></i>
                </span>
                <input type="text" class="form-control text-center" value="${produto.custoInsumosCadastroProdutos}" disabled>
            </div>
        </div>

        <!--PREÇO DE VENDA-->
        <div class="col-2">
            <div class="input-group mt-1">
                <span class="input-group-text bg-primary text-white">
                    <i class="fa-solid fa-brazilian-real-sign"></i>
                </span>
                <input type="text" class="form-control text-center" value="${produto.precoVendaShopeeCadastroProduto}" disabled>
            </div>
        </div>

        <!--LUCRO DE VENDA-->
        <div class="col-1">
            <input type="text" class="form-control text-center mt-1" value="${produto.percentualLucroShopeeCadastroInsumo}" disabled>
        </div>

        <!--AÇÕES E BUTTONS-->
        <div class="col">
            <button class="btn btn-primary mt-1" onclick="abrirModalProduto('${produto.codigoCadastroProduto}')">
                <i class="fa fa-eye"></i>
            </button>

            <button class="btn btn-danger mt-1" onclick="deletarProduto('${produto.codigoCadastroProduto}')">
                <i class="fa fa-trash"></i>
            </button>
        </div>
    `;

    col.appendChild(row2);
    row.appendChild(col);
    exibicaoProdutosCadastrados.appendChild(row);
}

// ======================================
//  FUNÇÃO PARA DELETAR PRODUTO
// ======================================
function deletarProduto(codigoProduto) {
    const index = listaCadastroProdutos.findIndex(p => p.codigoCadastroProduto === codigoProduto);
    if(index > -1) {
        listaCadastroProdutos.splice(index, 1);
        localStorage.setItem('listaCadastroProdutos', JSON.stringify(listaCadastroProdutos));
        renderizarProdutos();
    }
}

// ======================================
//  FUNÇÃO PARA ABRIR MODAL PRODUTO
// ======================================
function abrirModalProduto(codigoProduto) {
    console.log(listaCadastroProdutos)

    const produto = listaCadastroProdutos.find(p => p.codigoCadastroProduto === codigoProduto);
    if(!produto) return alert('Produto não encontrado.');

    // Converte dd/mm/yyyy → yyyy-mm-dd
    const partesData = produto.dataCadastroProduto.split('/');
    const dataInput = partesData.length === 3 
        ? `${partesData[2]}-${partesData[1]}-${partesData[0]}` 
        : produto.dataCadastroProduto;

    document.getElementById('dataCadastroProduto').value = dataInput;
    document.getElementById('codigoCadastroProduto').value = produto.codigoCadastroProduto;
    document.getElementById('nomeCadastroProduto').value = produto.nomeCadastroProduto;
    document.getElementById('plataformaCadastroProduto').value = produto.plataformaCadastroProduto;
    document.getElementById('categoriaCadastroProduto').value = produto.categoriaCadastroProduto;
    document.getElementById('custoInsumosCadastroProdutos').value = produto.custoInsumosCadastroProdutos;
    document.getElementById('estoqueCadastroProdutos').value = produto.estoqueCadastroProdutos;
    document.getElementById('precoVendaShopeeCadastroProduto').value = produto.precoVendaShopeeCadastroProduto;
    document.getElementById('custoShopeeCadastroProduto').value = produto.custoShopeeCadastroProduto;
    document.getElementById('lucroLiquidoShopeeCadastroInsumo').value = produto.lucroLiquidoShopeeCadastroInsumo;
    document.getElementById('percentualLucroShopeeCadastroInsumo').value = produto.percentualLucroShopeeCadastroInsumo;
    document.getElementById('precoVendaElo7CadastroProduto').value = produto.precoVendaElo7CadastroProduto;
    document.getElementById('custoElo7CadastroProduto').value = produto.custoElo7CadastroProduto;
    document.getElementById('lucroLiquidoElo7CadastroInsumo').value = produto.lucroLiquidoElo7CadastroInsumo;
    document.getElementById('percentualLucroElo7CadastroInsumo').value = produto.percentualLucroElo7CadastroInsumo;

    congelarInputs();

    const modal = new bootstrap.Modal(document.getElementById('modalCadastroProduto'));
    modal.show();

    calculaTaxaShopee();
}

// ======================================
//  FUNÇÕES AUXILIARES (DATA E CÓDIGO)
// ======================================
function atualizaDataCadastroProduto() {
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

function limparCadastroProduto(){
    document.getElementById('nomeCadastroProduto').value = '';
    document.getElementById('plataformaCadastroProduto').value = 'Todas Plataformas';
    document.getElementById('categoriaCadastroProduto').value = '';
    document.getElementById('custoInsumosCadastroProdutos').value = '';
    document.getElementById('precoVendaShopeeCadastroProduto').value = '';
    document.getElementById('custoShopeeCadastroProduto').value = '';
    document.getElementById('lucroLiquidoShopeeCadastroInsumo').value = '';
    document.getElementById('percentualLucroShopeeCadastroInsumo').value = '';
    document.getElementById('precoVendaElo7CadastroProduto').value = '';
    document.getElementById('custoElo7CadastroProduto').value = '';
    document.getElementById('lucroLiquidoElo7CadastroInsumo').value = '';
    document.getElementById('percentualLucroElo7CadastroInsumo').value = '';
}

function congelarInputs(){
    document.getElementById('dataCadastroProduto').disabled = true;
    document.getElementById('codigoCadastroProduto').disabled = true;
    document.getElementById('nomeCadastroProduto').disabled = true;
    document.getElementById('plataformaCadastroProduto').disabled = true;
    document.getElementById('categoriaCadastroProduto').disabled = true;
    document.getElementById('custoInsumosCadastroProdutos').disabled = true;
    document.getElementById('estoqueCadastroProdutos').disabled = true;
    document.getElementById('precoVendaShopeeCadastroProduto').disabled = true;
    document.getElementById('custoShopeeCadastroProduto').disabled = true;
    document.getElementById('lucroLiquidoShopeeCadastroInsumo').disabled = true;
    document.getElementById('percentualLucroShopeeCadastroInsumo').disabled = true;
    document.getElementById('precoVendaElo7CadastroProduto').disabled = true;
    document.getElementById('custoElo7CadastroProduto').disabled = true;
    document.getElementById('lucroLiquidoElo7CadastroInsumo').disabled = true;
    document.getElementById('percentualLucroElo7CadastroInsumo').disabled = true;
}

function descongelarInputs(){
    document.getElementById('dataCadastroProduto').disabled = false;
    document.getElementById('nomeCadastroProduto').disabled = false;
    document.getElementById('plataformaCadastroProduto').disabled = false;
    document.getElementById('categoriaCadastroProduto').disabled = false;
    document.getElementById('custoInsumosCadastroProdutos').disabled = false;
    document.getElementById('estoqueCadastroProdutos').disabled = false;
    document.getElementById('precoVendaShopeeCadastroProduto').disabled = false;
    document.getElementById('precoVendaElo7CadastroProduto').disabled = false;
}

// =====================================================
// INICIALIZAÇÃO AO CARREGAR A PÁGINA
// =====================================================
window.addEventListener('load', () => {
    renderizarCategorias();
    atualizarSelectCategorias();
    renderizarListaCompletaCategorias();
    renderizarProdutos();
    muda_badge();
    balancarSino();
    atualizaDataCadastroProduto();
});
