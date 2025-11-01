// ================================
// LOCALSTORAGE E LISTAS INICIAIS
const listaCategoriasProdutos = JSON.parse(localStorage.getItem("listaCategoriasProdutos")) || [];
const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];
const listaCapasProdutos = JSON.parse(localStorage.getItem("ListaCapasProdutos")) || [];

// Notificações
let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 1;
const badgeNotificacao = document.getElementById("badge-notificacao");

// =====================================================
// FUNÇÕES DE NOTIFICAÇÃO
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

// =====================================================
// CÁLCULO TAXA SHOPEE
function calculaTaxas() {
    // ==========================
    // CAMPOS
    // ==========================
    const custoInsumosInput = document.getElementById('custoInsumosCadastroProdutos');

    const precoShopeeInput = document.getElementById('precoVendaShopeeCadastroProduto');
    const custoShopeeInput = document.getElementById('custoShopeeCadastroProduto');
    const lucroShopeeInput = document.getElementById('lucroLiquidoShopeeCadastroInsumo');
    const percentualShopeeInput = document.getElementById('percentualLucroShopeeCadastroInsumo');
    const btnPrecoIdealShopee = document.getElementById('btnPrecoIdealShopee');
    const btnPrecoBaixoShopee = document.getElementById('btnPrecoBaixoShopee');

    const precoElo7Input = document.getElementById('precoVendaElo7CadastroProduto');
    const custoElo7Input = document.getElementById('custoElo7CadastroProduto');
    const lucroElo7Input = document.getElementById('lucroLiquidoElo7CadastroInsumo');
    const percentualElo7Input = document.getElementById('percentualLucroElo7CadastroInsumo');
    const btnPrecoIdealElo7 = document.getElementById('btnPrecoIdealElo7');
    const btnPrecoBaixoElo7 = document.getElementById('btnPrecoBaixoElo7');

    // ==========================
    // CAPTURA E TRATAMENTO DE VALORES
    // ==========================
    let custoInsumos = parseFloat(custoInsumosInput.value.replace(',', '.')) || 0;
    let precoShopee = parseFloat(precoShopeeInput.value.replace(',', '.')) || 0;
    let precoElo7 = parseFloat(precoElo7Input.value.replace(',', '.')) || 0;

    // ==========================
    // CÁLCULO SHOPEE
    // ==========================
    if (precoShopee > 0) {
        const taxaPercentualShopee = 23.5;
        const taxaFixaShopee = 4;

        const custoShopee = (precoShopee * taxaPercentualShopee / 100) + taxaFixaShopee;
        const lucroLiquidoShopee = precoShopee - custoShopee - custoInsumos;
        const percentualLucroShopee = (lucroLiquidoShopee * 100 / precoShopee);

        custoShopeeInput.value = custoShopee.toFixed(2);
        lucroShopeeInput.value = lucroLiquidoShopee.toFixed(2);
        percentualShopeeInput.value = percentualLucroShopee.toFixed(2) + ' %';

        // Mostrar botões Shopee
        if(percentualLucroShopee >= 40){
            btnPrecoIdealShopee.classList.remove('d-none');
            btnPrecoIdealShopee.classList.add('d-block');
            btnPrecoBaixoShopee.classList.remove('d-block');
            btnPrecoBaixoShopee.classList.add('d-none');
        } else {
            btnPrecoIdealShopee.classList.remove('d-block');
            btnPrecoIdealShopee.classList.add('d-none');
            btnPrecoBaixoShopee.classList.remove('d-none');
            btnPrecoBaixoShopee.classList.add('d-block');
        }

    } else {
        custoShopeeInput.value = '';
        lucroShopeeInput.value = '';
        percentualShopeeInput.value = '';
        btnPrecoIdealShopee.classList.add('d-none');
        btnPrecoBaixoShopee.classList.add('d-none');
    }

    // ==========================
    // CÁLCULO ELO7
    // ==========================
    if (precoElo7 > 0) {
        const taxaPercentualElo7 = 18;
        const taxaFixaElo7 = 0;

        const custoElo7 = (precoElo7 * taxaPercentualElo7 / 100) + taxaFixaElo7;
        const lucroLiquidoElo7 = precoElo7 - custoElo7 - custoInsumos;
        const percentualLucroElo7 = (lucroLiquidoElo7 * 100 / precoElo7);

        custoElo7Input.value = custoElo7.toFixed(2);
        lucroElo7Input.value = lucroLiquidoElo7.toFixed(2);
        percentualElo7Input.value = percentualLucroElo7.toFixed(2) + ' %';

        // Mostrar botões Elo7
        if(percentualLucroElo7 >= 40){
            btnPrecoIdealElo7.classList.remove('d-none');
            btnPrecoIdealElo7.classList.add('d-block');
            btnPrecoBaixoElo7.classList.remove('d-block');
            btnPrecoBaixoElo7.classList.add('d-none');
        } else {
            btnPrecoIdealElo7.classList.remove('d-block');
            btnPrecoIdealElo7.classList.add('d-none');
            btnPrecoBaixoElo7.classList.remove('d-none');
            btnPrecoBaixoElo7.classList.add('d-block');
        }

    } else {
        custoElo7Input.value = '';
        lucroElo7Input.value = '';
        percentualElo7Input.value = '';
        btnPrecoIdealElo7.classList.add('d-none');
        btnPrecoBaixoElo7.classList.add('d-none');
    }
}

// CLASSE PRODUTO
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

// FUNÇÃO PARA SALVAR PRODUTO (CORRIGIDA)
// =====================================================
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

    if (!dataCadastroProduto || !codigoCadastroProduto || !nomeCadastroProduto || !plataformaCadastroProduto || !categoriaCadastroProduto || !custoInsumosCadastroProdutos || !precoVendaShopeeCadastroProduto || !precoVendaElo7CadastroProduto) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    // 🔧 Correção: formatar data sem timezone
    const partes = dataCadastroProduto.split('-');
    const dataCadastroProdutoFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

    const indexExistente = listaCadastroProdutos.findIndex(p =>
        p.codigoCadastroProduto === codigoCadastroProduto ||
        p.nomeCadastroProduto.toLowerCase() === nomeCadastroProduto.toLowerCase()
    );

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
        listaCadastroProdutos[indexExistente] = novoProduto;
        localStorage.setItem('listaCadastroProdutos', JSON.stringify(listaCadastroProdutos));
        alert(`Produto "${nomeCadastroProduto}" atualizado com sucesso!`);
    } else {
        listaCadastroProdutos.push(novoProduto);
        localStorage.setItem('listaCadastroProdutos', JSON.stringify(listaCadastroProdutos));
        alert(`Produto "${nomeCadastroProduto}" cadastrado com sucesso!`);
    }

    congelarInputs();
    renderizarProdutos();
    console.log(listaCadastroProdutos);

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastroProduto'));
    modal.hide();
}

// RENDERIZAR PRODUTOS
function renderizarProdutos() {
    const exibicaoProdutosCadastrados = document.getElementById('exibicaoProdutosCadastrados');
    exibicaoProdutosCadastrados.innerHTML = '';
    listaCadastroProdutos.forEach(produto => exibirProdutoCadastrado(produto));
}

// EXIBIR PRODUTO
function exibirProdutoCadastrado(produto) {
    const exibicaoProdutosCadastrados = document.getElementById('exibicaoProdutosCadastrados');

    const row = document.createElement('div');
    row.classList.add('row', 'bg-light');

    const col = document.createElement('div');
    col.classList.add('col');

    const row2 = document.createElement('div');
    row2.classList.add('row', 'text-center', 'titulo_col');

    row2.innerHTML = `
        <!--NOME DO PRODUTO-->
        <div class="col-5">
            <div class="input-group mt-1">
                <span class="input-group-text bg-primary text-white"><i class="fa fa-tag"></i></span>
                <input type="text" class="form-control text-center" value="${produto.nomeCadastroProduto}" disabled>
            </div>
        </div>

        <!--PRECO CUSTO DO PRODUTO-->
        <div class="col-2">
            <div class="input-group mt-1 w-75">
                <span class="input-group-text bg-primary text-white"><i class="fa-solid fa-brazilian-real-sign"></i></span>
                <input type="text" class="form-control text-center" value="${produto.custoInsumosCadastroProdutos}" disabled>
            </div>
        </div>

        <!--PRECO VENDA DO PRODUTO-->
        <div class="col-2">
            <div class="input-group mt-1 w-75">
                <span class="input-group-text bg-primary text-white"><i class="fa-solid fa-brazilian-real-sign"></i></span>
                <input type="text" class="form-control text-center" value="${produto.precoVendaShopeeCadastroProduto}" disabled>
            </div>
        </div>

        <!--PERCENTUAL DE LUCRO-->
        <div class="col-2">
            <input type="text" class="form-control mt-1 text-center w-50" value="${produto.percentualLucroShopeeCadastroInsumo}" disabled>
        </div>

        <!--BOTÕES-->
        <div class="col-1">
            <button class="btn btn-sm btn-primary mt-1" onclick="abrirModalProduto('${produto.codigoCadastroProduto}')">
                <i class="fa fa-eye"></i>
            </button>
            <button class="btn btn-sm  btn-danger mt-1" onclick="deletarProduto('${produto.codigoCadastroProduto}')">
                <i class="fa fa-trash"></i>
            </button>
        </div>
    `;

    col.appendChild(row2);
    row.appendChild(col);
    exibicaoProdutosCadastrados.appendChild(row);
}

// DELETAR PRODUTO
function deletarProduto(codigoProduto) {
    const index = listaCadastroProdutos.findIndex(p => p.codigoCadastroProduto === codigoProduto);
    if (index > -1) {
        listaCadastroProdutos.splice(index, 1);
        localStorage.setItem('listaCadastroProdutos', JSON.stringify(listaCadastroProdutos));
        renderizarProdutos();
    }
}

// ABRIR MODAL PRODUTO
function abrirModalProduto(codigoProduto) {
    const produto = listaCadastroProdutos.find(p => p.codigoCadastroProduto === codigoProduto);
    if (!produto) return alert('Produto não encontrado.');

    const partesData = produto.dataCadastroProduto.split('/');
    const dataInput = partesData.length === 3 ? `${partesData[2]}-${partesData[1]}-${partesData[0]}` : produto.dataCadastroProduto;

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

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalCadastroProduto'));
    modal.show();

    // ⚡ Chamar cálculo imediatamente
    calculaTaxas();
}


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================
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
    document.getElementById('codigoCadastroProduto').value = 'PRD ' + proximoCodigo;
}

function limparCadastroProduto() {
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

function congelarInputs() {
    const ids = [
        'dataCadastroProduto', 'codigoCadastroProduto', 'nomeCadastroProduto',
        'plataformaCadastroProduto', 'categoriaCadastroProduto', 'custoInsumosCadastroProdutos',
        'estoqueCadastroProdutos', 'precoVendaShopeeCadastroProduto', 'custoShopeeCadastroProduto',
        'lucroLiquidoShopeeCadastroInsumo', 'percentualLucroShopeeCadastroInsumo',
        'precoVendaElo7CadastroProduto', 'custoElo7CadastroProduto', 'lucroLiquidoElo7CadastroInsumo',
        'percentualLucroElo7CadastroInsumo'
    ];
    ids.forEach(id => document.getElementById(id).disabled = true);
}

function descongelarInputs() {
    const ids = [
        'dataCadastroProduto', 'nomeCadastroProduto', 'plataformaCadastroProduto',
        'categoriaCadastroProduto', 'custoInsumosCadastroProdutos',
        'estoqueCadastroProdutos', 'precoVendaShopeeCadastroProduto',
        'precoVendaElo7CadastroProduto'
    ];
    ids.forEach(id => document.getElementById(id).disabled = false);
}

// =====================================================
// CAPAS
// Chama a função ao carregar a página
window.onload = function() {
    carregarCapasMasculinas();
    carregarCapasFemininas();
};

// Adicionando a chamada da função de pré-visualização de imagem
document.getElementById("imagemProduto1").addEventListener('change', () => previewImagemCard(1));
document.getElementById("imagemProduto2").addEventListener('change', () => previewImagemCard(2));
document.getElementById("imagemProduto3").addEventListener('change', () => previewImagemCard(3));

// Função para atualizar os números das capas com base na variação
function atualizarNumerosCapas() {
    const variacaoCapa = document.getElementById("variacaoCapa").value.trim();
    console.log("Variação selecionada:", variacaoCapa); // Cheque aqui se a variação é capturada corretamente

    if (!variacaoCapa || variacaoCapa === '-') {
        console.log("Variação não selecionada.");
        return;
    }

    // Recuperando a lista do LocalStorage
    const listaCapasProduto = JSON.parse(localStorage.getItem("ListaCapasProdutos"));
    if (!listaCapasProduto) {
        console.log("LocalStorage está vazio ou não contém 'ListaCapasProdutos'.");
    } else {
        console.log("Lista de capas no LocalStorage:", listaCapasProduto);
    }

    const capasExistentes = listaCapasProduto ? listaCapasProduto.filter(capa => capa.variacaoCapa === variacaoCapa) : [];
    console.log("Capas existentes para a variação:", capasExistentes);

    const numCapas = capasExistentes.length;
    console.log("Número de capas existentes para a variação:", numCapas);

    // Atualizando os campos de números de capa
    for (let i = 1; i <= 3; i++) {
        const inputNumeroCapa = document.getElementById(`inputNumeroCapa${i}`);
        if (inputNumeroCapa) {
            inputNumeroCapa.value = numCapas + i;
            console.log(`Capa ${i} Número atualizado para:`, numCapas + i);
        } else {
            console.log(`Elemento inputNumeroCapa${i} não encontrado.`);
        }
    }
}

// Função para pré-visualizar a imagem
function previewImagemCard(cardNumber) {
    const inputFile = document.getElementById(`imagemProduto${cardNumber}`);
    const previewImage = document.getElementById(`previewImagemProduto${cardNumber}`);

    const file = inputFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            previewImage.src = event.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = 'none';
    }
}

// Função para resetar os campos após salvar
function resetarCamposCapas() {
    document.getElementById('variacaoCapa').value = '';

    document.getElementById("imagemProduto1").value = '';
    document.getElementById("imagemProduto2").value = '';
    document.getElementById("imagemProduto3").value = '';

    document.getElementById("inputNumeroCapa1").value = '';
    document.getElementById("inputNumeroCapa2").value = '';
    document.getElementById("inputNumeroCapa3").value = '';

    document.getElementById("previewImagemProduto1").style.display = 'none';
    document.getElementById("previewImagemProduto2").style.display = 'none';
    document.getElementById("previewImagemProduto3").style.display = 'none';
}

// Função para limpar os campos de cada card individualmente
function limparCamposCard(cardNumber) {
    const imagemInput = document.getElementById(`imagemProduto${cardNumber}`);
    imagemInput.value = '';

    const previewImagem = document.getElementById(`previewImagemProduto${cardNumber}`);
    previewImagem.style.display = 'none';  
    previewImagem.src = '';  
}

// Função para Salvar o Cadastro da Capa
function adicionarCadastroCapasProduto() {
    const nomeProduto = "Todos";
    const variacaoCapa = document.getElementById("variacaoCapa").value.trim();

    if (!variacaoCapa || variacaoCapa === '-' || variacaoCapa === '') {
        alert("Por favor, selecione uma variação da capa.");
        return;
    }

    const imagensSelecionadas = [
        { input: document.getElementById("imagemProduto1").files[0], card: 1 },
        { input: document.getElementById("imagemProduto2").files[0], card: 2 },
        { input: document.getElementById("imagemProduto3").files[0], card: 3 }
    ];

    const imagensPreenchidas = imagensSelecionadas.filter(imagem => imagem.input);

    if (imagensPreenchidas.length === 0) {
        alert("Por favor, selecione pelo menos uma imagem nos cards.");
        return;
    }

    const primeirosCards = imagensPreenchidas.map(imagem => imagem.card);
    const cardsSequenciais = [1, 2, 3];
    const isSequencial = primeirosCards.every((value, index) => value === cardsSequenciais[index]);

    if (!isSequencial) {
        alert("Por favor, insira as imagens de forma sequencial nos cards (Card 1, 2, 3).");
        return;
    }

    // Processa todas as imagens e salva
    const listaCapasProdutos = JSON.parse(localStorage.getItem("ListaCapasProdutos")) || [];

    let imagensConvertidas = 0;

    imagensPreenchidas.forEach(imagem => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const capa = {
                nomeProduto: nomeProduto,
                variacaoCapa: variacaoCapa,
                numeroCapa: document.getElementById(`inputNumeroCapa${imagem.card}`).value,
                imagem: event.target.result // 🔥 Base64 armazenado aqui
            };

            listaCapasProdutos.push(capa);
            imagensConvertidas++;

            // Quando todas as imagens terminarem de ser lidas
            if (imagensConvertidas === imagensPreenchidas.length) {
                localStorage.setItem("ListaCapasProdutos", JSON.stringify(listaCapasProdutos));
                alert("Capas salvas com sucesso!");

                // Fecha o modal
                const modal = new bootstrap.Modal(document.getElementById('modalCadastroCapasProduto'));
                modal.hide();

                resetarCamposCapas();
            }
        };

        reader.readAsDataURL(imagem.input); // 👈 converte para Base64
    });
}

function irParaGaleriaCapas() {
    window.location.href = "/MONIKRIATIVA/html/galeriaCapas.html";
}

//==================================================
//CARREGAR CAPAS FEMININAS E MASCULINAS

function carregarCapasFemininas() {
    // Garante que a lista exista
    const listaCapasProdutos = JSON.parse(localStorage.getItem("ListaCapasProdutos")) || [];
    const capasFemininas = listaCapasProdutos.filter(capa => capa.variacaoCapa === "Feminino");

    console.log("Total de capas femininas:", capasFemininas.length);

    const campoExibicaoCapasFemininas = document.getElementById('campoExibicaoCapasFemininas');
    if (!campoExibicaoCapasFemininas) {
        console.error("Elemento #campoExibicaoCapasFemininas não encontrado no HTML!");
        return;
    }

    // Limpa antes de adicionar novas
    campoExibicaoCapasFemininas.innerHTML = "";

    // Adiciona a classe de grid do Bootstrap
    campoExibicaoCapasFemininas.classList.add("row", "g-3");

    // Loop para renderizar os cards
    for (let i = 0; i < capasFemininas.length; i++) {
        const capa = capasFemininas[i];

        // Cria a coluna
        const divCol = document.createElement("div");
        divCol.classList.add("col-12", "col-sm-6", "col-md-3"); // 3 por linha em telas médias

        // Cria o card
        const divCard = document.createElement("div");
        divCard.classList.add("card", "h-100", "shadow-sm");

        // Monta o conteúdo
        divCard.innerHTML = `
            <div class="card-header text-center">
                <span class="label-format fw-bold">
                    MODELO ${capa.numeroCapa || i + 1}
                </span>
            </div>
            <div class="card-body d-flex align-items-center justify-content-center">
                <img src="${capa.imagem || 'https://via.placeholder.com/150'}"
                    alt="Imagem da capa"
                    class="card-img-top"
                    style="max-height: 350px; object-fit: contain;
                    border-radius: 40px">
            </div>
            <div class="card-footer d-flex justify-content-center gap-2 py-3">
                <button class="btn btn-sm btn-secondary"><i class="fa fa-eye"></i></button>
                <button class="btn btn-sm btn-primary"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button>
            </div>
        `;

        // Adiciona o card dentro da coluna e depois ao container
        divCol.appendChild(divCard);
        campoExibicaoCapasFemininas.appendChild(divCol);
    }
}
function carregarCapasMasculinas() {
    // Garante que a lista exista
    const listaCapasProdutos = JSON.parse(localStorage.getItem("ListaCapasProdutos")) || [];
    const capasMasculinas = listaCapasProdutos.filter(capa => capa.variacaoCapa === "Masculino");

    console.log("Total de capas Masculinas:", capasMasculinas.length);

    const campoExibicaoCapasMasculinas = document.getElementById('campoExibicaoCapasMasculinas');
    if (!campoExibicaoCapasMasculinas) {
        console.error("Elemento #campoExibicaoCapasMasculinas não encontrado no HTML!");
        return;
    }

    // Limpa antes de adicionar novas
    campoExibicaoCapasMasculinas.innerHTML = "";

    // Adiciona a classe de grid do Bootstrap
    campoExibicaoCapasMasculinas.classList.add("row", "g-3");

    // Loop para renderizar os cards
    for (let i = 0; i < capasMasculinas.length; i++) {
        const capa = capasMasculinas[i];

        // Cria a coluna
        const divCol = document.createElement("div");
        divCol.classList.add("col-12", "col-sm-6", "col-md-3"); // 3 por linha em telas médias

        // Cria o card
        const divCard = document.createElement("div");
        divCard.classList.add("card", "h-100", "shadow-sm");

        // Monta o conteúdo
        divCard.innerHTML = `
            <div class="card-header text-center">
                <span class="label-format fw-bold">
                    MODELO ${capa.numeroCapa || i + 1}
                </span>
            </div>
            <div class="card-body d-flex align-items-center justify-content-center">
                <img src="${capa.imagem || 'https://via.placeholder.com/150'}"
                    alt="Imagem da capa"
                    class="card-img-top"
                    style="max-height: 350px; object-fit: contain;
                    border-radius: 40px">
            </div>
            <div class="card-footer d-flex justify-content-center gap-2 py-3">
                <button class="btn btn-sm btn-secondary"><i class="fa fa-eye"></i></button>
                <button class="btn btn-sm btn-primary"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button>
            </div>
        `;

        // Adiciona o card dentro da coluna e depois ao container
        divCol.appendChild(divCard);
        campoExibicaoCapasMasculinas.appendChild(divCol);
    }
}

function rolarPara(idDestino) {
    const destino = document.getElementById(idDestino);
    if (!destino) return;

    // Calcula a posição com deslocamento de 150px acima
    const offset = destino.getBoundingClientRect().top + window.scrollY - 70;

    // Rola suavemente até a posição calculada
    window.scrollTo({
        top: offset,
        behavior: 'smooth'
    });
}
//==================================================



// INICIALIZAÇÃO
window.addEventListener('load', () => {
    renderizarCategorias();
    atualizarSelectCategorias();
    renderizarListaCompletaCategorias();
    renderizarProdutos();
    muda_badge();
    balancarSino();
    atualizaDataCadastroProduto();
    atualizarSelectProdutosCapas();

    /*const ModalReal = document.getElementById('modalCadastroCapasProduto');
    const Modal = new bootstrap.Modal(ModalReal);
    Modal.show();*/
});
