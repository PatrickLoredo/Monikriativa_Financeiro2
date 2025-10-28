window.onload = function() {
    carregarListasSalvas();
};

let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 1;
var badgeNotificacao = document.getElementById("badge-notificacao");


function muda_badge(){
    badgeNotificacao.textContent = notificacoes;
    notificacoes++;
}

function balancarSino(){
    const badgeNotificacao = document.getElementById('badge-notificacao');
    const sinoNotificacao = document.getElementById('sinoNotificacao');
    const valor = badgeNotificacao.textContent.trim();

    if (valor === '' || Number(valor) === 0) {
        // Remove animação caso não haja notificações
        sinoNotificacao.classList.remove('fa-shake');
    } else {
        // Adiciona animação ao sino
        sinoNotificacao.classList.add('fa-shake');
    }
}

// ARRAYS GLOBAIS
var listaFuncoesJS = JSON.parse(localStorage.getItem('listaFuncoesJS')) || [];
var listaElementosJS = JSON.parse(localStorage.getItem('listaElementosJS')) || [];
var codigoEditando = null;

// DECLARAÇÕES GLOBAIS
const apelidoCodigoDev = document.getElementById('apelidoCodigoDev');
const categoriaCodigoDev = document.getElementById('categoriaCodigoDev');
const descricaoCodigoDev = document.getElementById('descricaoCodigoDev');
const codigoDev = document.getElementById('codigoDev');
const accordionFuncoes = document.getElementById('accordionFuncoes');
const accordionElementos = document.getElementById('accordionElementos');

// CLASSE PRINCIPAL
class CodigoDev {
    constructor(apelidoCodigoDev, categoriaCodigoDev, descricaoCodigoDev, codigoDev) {
        this.apelidoCodigoDev = apelidoCodigoDev;
        this.categoriaCodigoDev = categoriaCodigoDev;
        this.descricaoCodigoDev = descricaoCodigoDev;
        this.codigoDev = codigoDev;
    }
}

// MAPA PARA LIGAR CATEGORIA -> ARRAY E ACCORDION
const mapCategoria = {
    "Funções Javascript": { lista: listaFuncoesJS, tipo: 'Funcoes' },
    "Estilização de Elementos": { lista: listaElementosJS, tipo: 'Elementos' }
};

// SALVAR NOVO CÓDIGO/ ELEMENTO
function salvarAtalhoCodigoDev() {
    if (!apelidoCodigoDev.value || !categoriaCodigoDev.value || !codigoDev.value || categoriaCodigoDev.value === '-') {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const novoCodigo = new CodigoDev(
        apelidoCodigoDev.value,
        categoriaCodigoDev.value,
        descricaoCodigoDev.value,
        codigoDev.value
    );

    const categoriaSelecionada = mapCategoria[categoriaCodigoDev.value];
    if (!categoriaSelecionada) {
        alert('Categoria inválida!');
        return;
    }

    let listaAtual = categoriaSelecionada.lista;

    // Remove do array antigo se estiver editando
    if (codigoEditando) {
        const listaAntiga = codigoEditando.tipo === 'Funcoes' ? listaFuncoesJS : listaElementosJS;
        listaAntiga.splice(codigoEditando.index, 1);
    }

    // Verifica se já existe apelido na lista atual
    const existenteIndex = listaAtual.findIndex(c => c.apelidoCodigoDev === novoCodigo.apelidoCodigoDev);
    if (existenteIndex >= 0) {
        listaAtual[existenteIndex] = novoCodigo; // sobrescreve
    } else {
        listaAtual.push(novoCodigo); // adiciona novo
    }

    // Atualiza localStorage
    localStorage.setItem('listaFuncoesJS', JSON.stringify(listaFuncoesJS));
    localStorage.setItem('listaElementosJS', JSON.stringify(listaElementosJS));

    // Atualiza accordions
    carregarListasSalvas();

    // Limpa modal
    apelidoCodigoDev.value = '';
    categoriaCodigoDev.value = '-';
    descricaoCodigoDev.value = '';
    codigoDev.value = '';
    codigoEditando = null;

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastroDev'));
    modal.hide();
}

// CRIAR ITEM DO ACCORDION
function criarAccordionItem(codigo, index, tipo) {
    const accordionContainer = tipo === 'Funcoes' ? accordionFuncoes : accordionElementos;
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    accordionItem.id = `accordion${tipo}Item${index}`;

    accordionItem.innerHTML = `
        <h2 class="accordion-header" id="heading${tipo}${index}">
            <div class="d-flex justify-content-between align-items-center">
                <button class="accordion-button collapsed flex-grow-1" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#collapse${tipo}${index}" aria-expanded="false" aria-controls="collapse${tipo}${index}">
                    ${codigo.apelidoCodigoDev}
                </button>
                <button class="btn btn-primary btn-sm ms-2" onclick="abrirModalCadastroDev(${index}, '${tipo}')">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm ms-2" onclick="removerCodigo(${index}, '${tipo}')">
                    <i class="fa fa-x"></i>
                </button>
            </div>
        </h2>
        <div id="collapse${tipo}${index}" class="accordion-collapse collapse" aria-labelledby="heading${tipo}${index}" data-bs-parent="#accordion${tipo}">
            <div class="accordion-body">
                <strong>${codigo.descricaoCodigoDev}</strong>
                <pre class="mt-2"><code>${codigo.codigoDev}</code></pre>
            </div>
        </div>
    `;

    accordionContainer.appendChild(accordionItem);
}

// ABRIR MODAL
function abrirModalCadastroDev(index, tipo) {
    const codigo = tipo === 'Funcoes' ? listaFuncoesJS[index] : listaElementosJS[index];

    apelidoCodigoDev.value = codigo.apelidoCodigoDev;
    categoriaCodigoDev.value = codigo.categoriaCodigoDev || '-';
    descricaoCodigoDev.value = codigo.descricaoCodigoDev;
    codigoDev.value = codigo.codigoDev;

    codigoEditando = { index, tipo };

    const modal = new bootstrap.Modal(document.getElementById('modalCadastroDev'));
    modal.show();
}

// REMOVER ITEM
function removerCodigo(index, tipo) {
    if (tipo === 'Funcoes') {
        listaFuncoesJS.splice(index, 1);
        localStorage.setItem('listaFuncoesJS', JSON.stringify(listaFuncoesJS));
    } else {
        listaElementosJS.splice(index, 1);
        localStorage.setItem('listaElementosJS', JSON.stringify(listaElementosJS));
    }

    carregarListasSalvas();
}

// CARREGAR LISTAS SALVAS
function carregarListasSalvas() {
    accordionFuncoes.innerHTML = '';
    accordionElementos.innerHTML = '';

    listaFuncoesJS.forEach((codigo, index) => criarAccordionItem(codigo, index, 'Funcoes'));
    listaElementosJS.forEach((codigo, index) => criarAccordionItem(codigo, index, 'Elementos'));
}
