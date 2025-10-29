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
    mostraCodigoInsumoVariavel();
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

function mostraCodigoInsumoVariavel() {
    const codigoCadastroInsumoVariavel = document.getElementById('codigoCadastroInsumoVariavel');
    let proximoCodigo = 1;

    if (listaInsumosVariaveis.length > 0) {
        const codigos = listaInsumosVariaveis.map(insumo => parseInt(insumo.codigo) || 0);
        proximoCodigo = Math.max(...codigos) + 1;
    }

    codigoCadastroInsumoVariavel.value = " INSM_VR " + proximoCodigo;
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
});
