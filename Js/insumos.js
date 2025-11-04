// =====================================================
// NOTIFICAÇÕES
// =====================================================
let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 1;
var badgeNotificacao = document.getElementById("badge-notificacao");

function muda_badge() {
    badgeNotificacao.textContent = notificacoes;
    notificacoes++;
    localStorage.setItem("notificacoes", notificacoes);
}

function balancarSino() {
    const sinoNotificacao = document.getElementById('sinoNotificacao');
    const valor = badgeNotificacao.textContent.trim();

    if (valor === '' || Number(valor) === 0) {
        sinoNotificacao.classList.remove('fa-shake');
    } else {
        sinoNotificacao.classList.add('fa-shake');
    }
}

// =====================================================
// INSUMOS VARIÁVEIS
// =====================================================
var listaInsumosVariaveis = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];
var listaCategoriasInsumos = JSON.parse(localStorage.getItem("listaCategoriasInsumos")) || [];

window.onload = function() {
    /*var modalElement = document.getElementById('modalCadastroInsumoVariavel');
    if (modalElement) {
        var modal = new bootstrap.Modal(modalElement);
        modal.show();
    }*/

    formatarDataCadastroInsumo();
    verificaCodigoInsumoVariavel();
    preencherSelectCategoriasInsumo();
    renderizarCategoriasInsumos(); // <--- renderiza os botões na tela
    renderizarListaCategoriasInsumos(); // <--- modal completo
    
};

function formatarDataCadastroInsumo() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();

    const dataFormatada = `${ano}-${mes}-${dia}`;
    document.getElementById('dataCadastroInsumoVariavel').value = dataFormatada;
}

function verificaCodigoInsumoVariavel() {
    const codigoCadastroInsumoVariavel = document.getElementById('codigoCadastroInsumoVariavel');

    if (!window.listaInsumosVariaveis)
        window.listaInsumosVariaveis = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    const proximoCodigoNumero = listaInsumosVariaveis.length + 1;

    const codigoFormatado = proximoCodigoNumero.toString().padStart(2, "0");

    codigoCadastroInsumoVariavel.value = `INSM_VR ${codigoFormatado}`;
}

function preencherSelectCategoriasInsumo() {
    const selectCategoria = document.getElementById('categoriaInsumoVariavel');
    selectCategoria.innerHTML = ''; // limpa opções

    const opcaoPadrao = document.createElement('option');
    opcaoPadrao.value = '';
    opcaoPadrao.textContent = '-';
    selectCategoria.appendChild(opcaoPadrao);

    listaCategoriasInsumos.forEach(categoriaObj => {
        const option = document.createElement('option');
        option.value = categoriaObj.categoria;
        option.textContent = categoriaObj.categoria;
        selectCategoria.appendChild(option);
    });
}

function calculaPrecoInsumoVariavel() {
    // Pega os inputs
    const qtdCompraInput = document.getElementById('qtdCompraCadastroInsumoVariavel');
    const precoTotalInput = document.getElementById('precoTotalCompraCadastroInsumo');
    const precoFreteInput = document.getElementById('precoFreteCompraCadastroInsumo');
    const precoAcrescimoInput = document.getElementById('precoAcrescimoCompraCadastroInsumo');
    const precoDescontoInput = document.getElementById('precoDescontoCompraCadastroInsumo');
    const precoUnitInput = document.getElementById('precoUnitarioCompraCadastroInsumo');

    // Substitui vírgula por ponto para float
    const qtdCompra = parseFloat(qtdCompraInput.value.replace(',', '.')) || 0;
    const precoTotal = parseFloat(precoTotalInput.value.replace(',', '.')) || 0;
    const precoFrete = parseFloat(precoFreteInput.value.replace(',', '.')) || 0;
    const precoAcrescimo = parseFloat(precoAcrescimoInput.value.replace(',', '.')) || 0;
    const precoDesconto = parseFloat(precoDescontoInput.value.replace(',', '.')) || 0;

    // Calcula preço unitário
    const precoTotalCompra = (precoTotal + precoFrete + precoAcrescimo) - precoDesconto;
    const precoUnitario = qtdCompra > 0 ? precoTotalCompra / qtdCompra : 0;

    // Salva no input usando **ponto para cálculo**, vírgula apenas para exibição
    precoUnitInput.value = precoUnitario.toFixed(2).replace('.', ',');
}

class InsumoVariavel {
    constructor(
        dataCompraInsumoVariavel,
        codigoInsumoVariavel,
        nomeInsumoVariavel,
        fornecedorInsumoVariavel,
        categoriaInsumoVariavel,
        qtdcompraInsumoVariavel,
        precoTotalCompraInsumoVariavel,
        precoFreteInsumoVariavel,
        acrescimoInsumoVariavel,
        descontoInsumoInsumoVariavel,
        precoUnitarioInsumoVariavel
    ) {
        this.dataCompraInsumoVariavel = dataCompraInsumoVariavel;
        this.codigoInsumoVariavel = codigoInsumoVariavel;
        this.nomeInsumoVariavel = nomeInsumoVariavel;
        this.fornecedorInsumoVariavel = fornecedorInsumoVariavel;
        this.categoriaInsumoVariavel = categoriaInsumoVariavel;
        this.qtdcompraInsumoVariavel = qtdcompraInsumoVariavel;
        this.precoTotalCompraInsumoVariavel = precoTotalCompraInsumoVariavel;
        this.precoFreteInsumoVariavel = precoFreteInsumoVariavel;
        this.acrescimoInsumoVariavel = acrescimoInsumoVariavel;
        this.descontoInsumoVariavel = descontoInsumoInsumoVariavel;
        this.precoUnitarioInsumoVariavel = precoUnitarioInsumoVariavel;
    }
}

function salvarInsumoVariavel() {
    // Carrega lista existente do localStorage
    if (!window.listaInsumosVariaveis)
        window.listaInsumosVariaveis = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    // 🗓️ Captura e formata a data
    let data = document.getElementById('dataCadastroInsumoVariavel').value;
    if (data) {
        const [ano, mes, dia] = data.split("-");
        data = `${dia}/${mes}/${ano}`;
    }

    // 🧾 Captura os campos
    const codigo = document.getElementById('codigoCadastroInsumoVariavel').value.trim();
    const nome = document.getElementById('nomeCadastroInsumoVariavel').value.trim();
    const fornecedor = document.getElementById('fornecedorInsumoVariavel').value.trim();
    const categoria = document.getElementById('categoriaInsumoVariavel').value.trim();

    // Converte valores numéricos, substituindo vírgula por ponto
    const qtd = parseFloat(document.getElementById('qtdCompraCadastroInsumoVariavel').value.replace(',', '.')) || 0;
    const precoTotal = parseFloat(document.getElementById('precoTotalCompraCadastroInsumo').value.replace(',', '.')) || 0;
    const precoFrete = parseFloat(document.getElementById('precoFreteCompraCadastroInsumo').value.replace(',', '.')) || 0;
    const precoAcrescimo = parseFloat(document.getElementById('precoAcrescimoCompraCadastroInsumo').value.replace(',', '.')) || 0;
    const precoDesconto = parseFloat(document.getElementById('precoDescontoCompraCadastroInsumo').value.replace(',', '.')) || 0;
    const precoUnitario = parseFloat(document.getElementById('precoUnitarioCompraCadastroInsumo').value.replace(',', '.')) || 0;

    // 🛑 Verificação de campos obrigatórios
    if (!data || !codigo || !nome || !fornecedor || !categoria) {
        alert("⚠️ Por favor, preencha todos os campos obrigatórios antes de salvar.");
        return;
    }

    // 🆕 Cria o novo objeto
    const novoInsumo = new InsumoVariavel(
        data,
        codigo,
        nome,
        fornecedor,
        categoria,
        qtd,
        precoTotal,
        precoFrete,
        precoAcrescimo,
        precoDesconto,
        precoUnitario
    );

    // 🔍 Verifica se já existe (por código OU nome)
    const indiceExistente = listaInsumosVariaveis.findIndex(item =>
        item.codigoInsumoVariavel === codigo || item.nomeInsumoVariavel.toLowerCase() === nome.toLowerCase()
    );

    if (indiceExistente !== -1) {
        // 🔁 Atualiza o insumo existente
        listaInsumosVariaveis[indiceExistente] = novoInsumo;
        alert(`♻️ O insumo [${nome}] foi atualizado com sucesso!`);
    } else {
        // ➕ Adiciona novo insumo
        listaInsumosVariaveis.push(novoInsumo);
        alert(`✅ O insumo variável [${nome}] foi cadastrado com sucesso!`);
    }

    // 💾 Salva no localStorage
    localStorage.setItem("listaInsumosVariaveis", JSON.stringify(listaInsumosVariaveis));

    console.log("📋 Lista atualizada:", listaInsumosVariaveis);

    // 🔄 Atualiza a exibição imediatamente
    exibirInsumosVariaveisSalvos();

    // 🧹 Limpa campos e atualiza código/data
    limpaInsumoVariavel();
    verificaCodigoInsumoVariavel();
    atualizaDataInsumoVariavel();
}

function limpaInsumoVariavel(){
    document.getElementById('nomeCadastroInsumoVariavel').value = '';
    document.getElementById('fornecedorInsumoVariavel').value  = '';
    document.getElementById('categoriaInsumoVariavel').value  = '';
    document.getElementById('qtdCompraCadastroInsumoVariavel').value = '';
    document.getElementById('precoTotalCompraCadastroInsumo').value = '';
    document.getElementById('precoFreteCompraCadastroInsumo').value = "0,00";
    document.getElementById('precoAcrescimoCompraCadastroInsumo').value = "0,00"
    document.getElementById('precoDescontoCompraCadastroInsumo').value = "0,00";
    document.getElementById('precoUnitarioCompraCadastroInsumo').value = '';

    calculaPrecoInsumoVariavel();

}

function editarInsumosVariavel(){
    document.getElementById('dataCadastroInsumoVariavel').disabled = false;
    document.getElementById('nomeCadastroInsumoVariavel').disabled = false;
    document.getElementById('fornecedorInsumoVariavel').disabled = false;
    document.getElementById('categoriaInsumoVariavel').disabled = false;
    document.getElementById('qtdCompraCadastroInsumoVariavel').disabled = false;
    document.getElementById('precoTotalCompraCadastroInsumo').disabled = false;
    document.getElementById('precoFreteCompraCadastroInsumo').disabled = false;
    document.getElementById('precoAcrescimoCompraCadastroInsumo').disabled = false;
    document.getElementById('precoDescontoCompraCadastroInsumo').disabled = false;
}

function exibirInsumosVariaveisSalvos() {
    const exibicao = document.getElementById('exibicaoInsumosVariaveis');

    // Limpa o conteúdo antes de preencher
    exibicao.innerHTML = "";

    // Carrega a lista do localStorage
    const lista = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    // Se não houver dados, mostra uma mensagem
    if (lista.length === 0) {
        exibicao.innerHTML = `
            <div class="alert alert-secondary mt-3" role="alert">
                Nenhum insumo variável cadastrado ainda.
            </div>`;
        return;
    }

    // Cria dinamicamente os blocos de cada insumo
    lista.forEach(insumo => {
        exibicao.innerHTML += `
            <div class="row mt-2 mb-1">
                <div class="col-2">
                    <input type="text" class="form-control text-center" value="${insumo.codigoInsumoVariavel}" disabled>
                </div>
                <div class="col-4">
                    <input type="text" class="form-control text-center" value="${insumo.nomeInsumoVariavel}" disabled>
                </div>
                <div class="col-2">
                    <input type="text" class="form-control text-center" value="${insumo.fornecedorInsumoVariavel}" disabled>
                </div>
                <div class="col-1">
                    <input type="text" class="form-control text-center" value="${parseFloat(insumo.precoTotalCompraInsumoVariavel).toFixed(2)}" disabled>
                </div>
                <div class="col-1">
                    <input type="text" class="form-control text-center" value="${parseFloat(insumo.precoUnitarioInsumoVariavel).toFixed(2)}" disabled>
                </div>
                <div class="col">
                    <button class="btn btn-primary" onclick="visualizarCadastroInsumoVariavel('${insumo.codigoInsumoVariavel}')">
                        <i class="fa fa-eye"></i>
                    </button>
                    <button class="btn btn-danger" onclick="excluirInsumoVariavel('${insumo.codigoInsumoVariavel}')">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

function visualizarCadastroInsumoVariavel(codigo) {
    // Recupera a lista do localStorage
    const lista = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    // Procura o insumo com o código clicado
    const insumo = lista.find(item => item.codigoInsumoVariavel === codigo);

    if (!insumo) {
        alert("❌ Erro: insumo não encontrado!");
        return;
    }

    // Preenche os campos do modal com os dados do insumo
    document.getElementById('dataCadastroInsumoVariavel').value = insumo.dataCompraInsumoVariavel;
    document.getElementById('codigoCadastroInsumoVariavel').value = insumo.codigoInsumoVariavel;
    document.getElementById('nomeCadastroInsumoVariavel').value = insumo.nomeInsumoVariavel;
    document.getElementById('fornecedorInsumoVariavel').value = insumo.fornecedorInsumoVariavel;
    document.getElementById('categoriaInsumoVariavel').value = insumo.categoriaInsumoVariavel;

    document.getElementById('dataCadastroInsumoVariavel').disabled = true;
    document.getElementById('codigoCadastroInsumoVariavel').disabled = true;
    document.getElementById('nomeCadastroInsumoVariavel').disabled = true;
    document.getElementById('fornecedorInsumoVariavel').disabled = true;
    document.getElementById('categoriaInsumoVariavel').disabled = true;
    document.getElementById('qtdCompraCadastroInsumoVariavel').disabled = true;
    document.getElementById('precoTotalCompraCadastroInsumo').disabled = true;
    document.getElementById('precoFreteCompraCadastroInsumo').disabled = true;
    document.getElementById('precoAcrescimoCompraCadastroInsumo').disabled = true;
    document.getElementById('precoDescontoCompraCadastroInsumo').disabled = true;
    document.getElementById('precoUnitarioCompraCadastroInsumo').disabled = true;

    // Converte a data de dd/mm/aaaa para aaaa-mm-dd para mostrar no input[type=date]
    if (insumo.dataCompraInsumoVariavel) {
        const [dia, mes, ano] = insumo.dataCompraInsumoVariavel.split("/");
        document.getElementById('dataCadastroInsumoVariavel').value = `${ano}-${mes}-${dia}`;
    }

    document.getElementById('qtdCompraCadastroInsumoVariavel').value = insumo.qtdcompraInsumoVariavel;
    document.getElementById('precoTotalCompraCadastroInsumo').value = insumo.precoTotalCompraInsumoVariavel;
    document.getElementById('precoFreteCompraCadastroInsumo').value = insumo.precoFreteInsumoVariavel;
    document.getElementById('precoAcrescimoCompraCadastroInsumo').value = insumo.acrescimoInsumoVariavel;
    document.getElementById('precoDescontoCompraCadastroInsumo').value = insumo.descontoInsumoVariavel;
    document.getElementById('precoUnitarioCompraCadastroInsumo').value = insumo.precoUnitarioInsumoVariavel;

    // Abre o modal do Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('modalCadastroInsumoVariavel'));
    modal.show();
}

function excluirInsumoVariavel(codigo) {
    if (!confirm("❗ Deseja realmente excluir este insumo?")) return;

    // Carrega lista do localStorage
    let lista = JSON.parse(localStorage.getItem("listaInsumosVariaveis")) || [];

    // Filtra removendo o item com o código selecionado
    lista = lista.filter(item => item.codigoInsumoVariavel !== codigo);

    // Atualiza o localStorage
    localStorage.setItem("listaInsumosVariaveis", JSON.stringify(lista));

    // Atualiza a exibição
    exibirInsumosVariaveisSalvos();

    console.log(`🗑️ Insumo ${codigo} excluído com sucesso!`);
}

// Função genérica para abrir/fechar qualquer collapse com ícone
function toggleCollapse(collapseId, iconeId) {
    const collapseElement = document.getElementById(collapseId);
    const icone = document.getElementById(iconeId);

    if (!collapseElement || !icone) return;

    const isClosed = icone.classList.contains('fa-chevron-down');

    // Pega instância do Bootstrap Collapse ou cria se não existir
    const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) || 
        new bootstrap.Collapse(collapseElement, { toggle: false });

    if (isClosed) {
        bsCollapse.show();
        icone.classList.remove('fa-chevron-down');
        icone.classList.add('fa-chevron-up');
    } else {
        bsCollapse.hide();
        icone.classList.remove('fa-chevron-up');
        icone.classList.add('fa-chevron-down');
    }
}

// Opcional: força que todos os collapses iniciem fechados
window.addEventListener("DOMContentLoaded", () => {
    ['infoCadastroInsumosVariaveis', 'infoCadastroInsumosFixos'].forEach(id => {
        const collapseEl = document.getElementById(id);
        const iconeEl = document.getElementById(id.replace('info', 'icone'));
        if (!collapseEl || !iconeEl) return;

        collapseEl.classList.remove('show');
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
        bsCollapse.hide();

        iconeEl.classList.remove('fa-chevron-up');
        iconeEl.classList.add('fa-chevron-down');
    });
});


// =====================================================
// FUNÇÕES DE CATEGORIA DE INSUMOS VARIÁVEIS
// =====================================================
class CategoriaInsumo {
    constructor(categoria) {
        this.categoria = categoria;
        this.dataCadastro = new Date().toLocaleDateString();
    }
}

function adicionarNovaCategoriaInsumo() {
    const input = document.getElementById("inputNovaCategoriaInsumo");
    const btnAdicionar = document.getElementById('btnAdicionarNovaCategoriaInsumo');
    const btnSalvar = document.getElementById('btnSalvarNovaCategoriaInsumo');

    input.disabled = false;
    input.value = '';
    btnAdicionar.classList.add('d-none');
    btnSalvar.classList.remove('d-none');
}

function salvarNovaCategoriaInsumo() {
    const input = document.getElementById("inputNovaCategoriaInsumo");

    if (input.value.trim() === '') {
        alert('Informe o nome da Categoria do Insumo');
        return;
    }

    const novaCategoria = new CategoriaInsumo(input.value.trim());
    listaCategoriasInsumos.push(novaCategoria);
    localStorage.setItem("listaCategoriasInsumos", JSON.stringify(listaCategoriasInsumos));

    preencherSelectCategoriasInsumo();
    renderizarCategoriasInsumos();
    renderizarListaCategoriasInsumos();

    input.value = '';
    input.disabled = true;
    document.getElementById('btnAdicionarNovaCategoriaInsumo').classList.remove('d-none');
    document.getElementById('btnSalvarNovaCategoriaInsumo').classList.add('d-none');

    alert(`Categoria "${novaCategoria.categoria}" adicionada com sucesso!`);
}

// =====================================================
// RENDERIZAÇÃO DOS BOTÕES NA TELA
// =====================================================
function renderizarCategoriasInsumos() {
    const container = document.getElementById('amostradeCategoriasInsumos');
    container.innerHTML = '';

    if (!listaCategoriasInsumos.length) {
        container.innerHTML = '<p class="text-muted">Nenhuma categoria cadastrada.</p>';
        return;
    }

    const row = document.createElement('div');
    row.classList.add('row', 'g-2');

    listaCategoriasInsumos.forEach((categoria, index) => {
        const col = document.createElement('div');
        col.classList.add('col-auto');

        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center px-3 py-1';
        btn.textContent = categoria.categoria;
        btn.onclick = () => editarCategoriaInsumo(index); // ao clicar edita

        col.appendChild(btn);
        row.appendChild(col);
    });

    container.appendChild(row);
}

// =====================================================
// RENDERIZAÇÃO DA LISTA COMPLETA DE CATEGORIAS (MODAL)
// =====================================================
function renderizarListaCategoriasInsumos() {
    const container = document.getElementById('campoListaCompletaCategorias');
    container.innerHTML = '';

    if (!listaCategoriasInsumos.length) {
        container.innerHTML = '<p class="text-muted MT-2">Nenhuma categoria cadastrada.</p>';
        return;
    }

    // Cabeçalho
    const header = document.createElement('div');
    header.classList.add('row', 'fw-bold', 'mb-2');
    header.innerHTML = `
        <div class="col-4 label-format">DATA CADASTRO</div>
        <div class="col-4 label-format">CATEGORIA</div>
        <div class="col-4 label-format">AÇÕES</div>
    `;
    container.appendChild(header);

    // Linhas
    listaCategoriasInsumos.forEach((c, i) => {
        const row = document.createElement('div');
        row.classList.add('row', 'mb-1', 'align-items-center');

        row.innerHTML = `
            <div class="col-4 text-center">${c.dataCadastro}</div>
            <div class="col-4 text-center">${c.categoria}</div>
            <div class="col-4 text-center">
                <button class="btn btn-sm btn-primary me-2" onclick="editarCategoriaInsumo(${i})"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="excluirCategoriaInsumo(${i})"><i class="fa fa-trash"></i></button>
            </div>
        `;

        container.appendChild(row);
    });
}

// =====================================================
// FUNÇÕES EDITAR / EXCLUIR
// =====================================================
function editarCategoriaInsumo(indice) {
    const novaCategoria = prompt("Edite o nome da categoria:", listaCategoriasInsumos[indice].categoria);
    if (novaCategoria && novaCategoria.trim() !== '') {
        listaCategoriasInsumos[indice].categoria = novaCategoria.trim();
        localStorage.setItem("listaCategoriasInsumos", JSON.stringify(listaCategoriasInsumos));
        preencherSelectCategoriasInsumo();
        renderizarCategoriasInsumos();
        renderizarListaCategoriasInsumos();
    }
}

function excluirCategoriaInsumo(indice) {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;

    listaCategoriasInsumos.splice(indice, 1);
    localStorage.setItem("listaCategoriasInsumos", JSON.stringify(listaCategoriasInsumos));

    preencherSelectCategoriasInsumo();
    renderizarCategoriasInsumos();
    renderizarListaCategoriasInsumos();
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================
window.addEventListener('load', () => {
    preencherSelectCategoriasInsumo();
    renderizarCategoriasInsumos();
    renderizarListaCategoriasInsumos();
    muda_badge();
    balancarSino();
    exibirInsumosVariaveisSalvos();

});
