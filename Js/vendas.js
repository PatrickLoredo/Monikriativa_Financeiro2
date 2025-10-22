/*window.onload = function() {
    // Seleciona o modal pelo ID
    var modalElement = document.getElementById('modalCadastroVenda');
    
    if(modalElement){
        var modal = new bootstrap.Modal(modalElement);
        // Mostra o modal automaticamente
        modal.show();
    }

    muda_badge();
    atualizarCodigoVenda();
};*/

/*---------------------------------------------------*/ 
//FUNÇÃO PARA CRIAR ARRAYS PERSISTENTES AUTOMATICAMENTE
function criarArrayPersistente(nomeChave, arrayInicial) {
    return new Proxy(arrayInicial, {
        set(target, property, value) {
            target[property] = value;
            localStorage.setItem(nomeChave, JSON.stringify(target));
            return true;
        },
        deleteProperty(target, property) {
            delete target[property];
            localStorage.setItem(nomeChave, JSON.stringify(target));
            return true;
        }
    });
}

function preencherTabelaVendasManuais() {
    const tbody = document.getElementById("bodyTabelaVendas");
    tbody.innerHTML = ""; // limpa tabela antes de preencher

    listaVendasManuais.forEach((venda, index) => {
        adicionarVendaNaTabela(venda, index);
    });
}

// Chame esta função quando a página carregar
document.addEventListener("DOMContentLoaded", function() {
    preencherTabelaVendasManuais();
});

/*---------------------------------------------------*/ 
//VARIÁVEIS / ARRAYS
var listaVendas = criarArrayPersistente("listaVendas", JSON.parse(localStorage.getItem("listaVendas")) || []);
var listaVendasManuais = criarArrayPersistente("listaVendasManuais", JSON.parse(localStorage.getItem("listaVendasManuais")) || []);

var tamanhoListaVendas = listaVendas.length;
var tamanhoListaVendasManuais = listaVendasManuais.length;

const btnBaixarRelatorioVendas = document.getElementById("btnBaixarRelatorioVendas");
const btnSalvarVendaRealizada = document.getElementById("btnSalvarVendaRealizada");
const btnEditarVendaRealizada = document.getElementById("btnEditarVendaRealizada");
const btnSalvarProdutoCadastrado = document.getElementById("btnSalvarProdutoCadastrado");
const btnEditarProdutoCadastrado = document.getElementById("btnEditarProdutoCadastrado");

console.log(tamanhoListaVendasManuais)

/*-------------------------BADGE---------------------------------*/
let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 0;
var badgeNotificacao = document.getElementById("badge-notificacao");

//Atualiza Badge [OK]
function muda_badge(){
    badgeNotificacao.textContent = notificacoes;
    notificacoes++;
    localStorage.setItem("notificacoes", notificacoes); // persiste o valor
}

/*---------------------------------------------------*/ 
//Atualiza Código da Venda Manual [OK]
function atualizarCodigoVenda() {
  const inputCodigo = document.getElementById("codigoVendaManual");
  const proximoCodigo = 'VM ' + (listaVendasManuais.length + 1);
  inputCodigo.value = proximoCodigo;

  const inputDataVenda = document.getElementById("dataVendaManual");
  const inputPesquisaDataVenda = document.getElementById("pesquisaDataVenda");
  const hoje = new Date();

  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();

  const dataFormatada = `${ano}-${mes}-${dia}`;
  inputDataVenda.value = dataFormatada;
  inputPesquisaDataVenda.value = dataFormatada;
}

//Cria Objeto de Venda Manual [OK]
class VendaManual {
    constructor(codigo, data, plataforma, cliente, produto, preco, qtd, desconto, totalm, sexo, modeloCapa, NomePersonalizado, observacao) {
        this.codigo = codigo;
        this.data = data;
        this.plataforma = plataforma;
        this.cliente = cliente;
        this.produto = produto;
        this.preco = preco;
        this.qtd = qtd;
        this.desconto = desconto;
        this.totalm = totalm;
        this.sexo = sexo;
        this.modeloCapa = modeloCapa;
        this.NomePersonalizado = NomePersonalizado;
        this.observacao = observacao;
    }
}

//Limpar campos de Venda Manual [OK]
function limparVendaManual() {
    if(document.getElementById("clienteVendaManual").disabled == true){
        alert("Não é permitido LIMPAR os campos quando eles estão congelados. \n\nPara limpar clique no botão EDITAR e depois LIMPAR");
    }
    else{
        document.getElementById("clienteVendaManual").value = "";
        document.getElementById("precoUnitarioVendaManual").value = "";
        document.getElementById("produtoVendaManual").value = "escolha";
        document.getElementById("qtdVendaManual").value = 1;
        document.getElementById("descontoAcrescimoVendaManual").value = "0,00";
        document.getElementById("totalVendaManual").value = "0,00";
        document.getElementById("sexoVendaManual").value = "nao escolhido";
        document.getElementById("modeloCapaVendaManual").value = "";
        document.getElementById("nomePersonalizadoVendaManual").value = "";
        document.getElementById("observacoesVendaManual").value = "";
    }
}

//Descongela campos venda Manual para EDITAR [OK]
function editarVendaManual(){
    document.getElementById("dataVendaManual").disabled = false;
    document.getElementById("plataformaVendaManual").disabled = false;
    document.getElementById("clienteVendaManual").disabled = false;
    document.getElementById("produtoVendaManual").disabled = false;
    document.getElementById("qtdVendaManual").disabled = false;
    document.getElementById("descontoAcrescimoVendaManual").disabled = false;
    document.getElementById("sexoVendaManual").disabled = false;
    document.getElementById("modeloCapaVendaManual").disabled = false;
    document.getElementById("nomePersonalizadoVendaManual").disabled = false;
    document.getElementById("observacoesVendaManual").disabled = false;
}

//Desativa campos de Venda Manual [OK]
function congelarVendaManual(){
    document.getElementById("codigoVendaManual").disabled = true;
    document.getElementById("dataVendaManual").disabled = true;
    document.getElementById("plataformaVendaManual").disabled = true;
    document.getElementById("clienteVendaManual").disabled = true;
    document.getElementById("produtoVendaManual").disabled = true;
    document.getElementById("qtdVendaManual").disabled = true;
    document.getElementById("descontoAcrescimoVendaManual").disabled = true;
    document.getElementById("sexoVendaManual").disabled = true;
    document.getElementById("modeloCapaVendaManual").disabled = true;
    document.getElementById("nomePersonalizadoVendaManual").disabled = true;
    document.getElementById("observacoesVendaManual").disabled = true;
}

function adicionarVendaNaTabela(venda, index) {
    const tbody = document.getElementById("bodyTabelaVendas");

    const novaLinha = document.createElement("tr");
    novaLinha.id = `venda${index}`;
    novaLinha.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td class="bg-${venda.plataforma.toLowerCase()} rounded-pill d-flex align-items-center justify-content-center mt-1">
            ${venda.plataforma}
        </td>
        <td>${venda.cliente}</td>
        <td>
            <select name="produtoVenda" class="form-select text-center">
                <option selected>${venda.produto}</option>
            </select>
        </td>
        <td>
            <select class="form-select text-center">
                <option value="">Feminino</option>
                <option value="">Masculino</option>
            </select>
        </td>
        <td>${venda.qtd}</td>
        <td>R$ ${venda.preco.toFixed(2).replace('.', ',')}</td>
        <td>
            <select class="form-select text-center">
                <option value="">Produção</option>
                <option value="">Enviado</option>
                <option value="">Entregue</option>
            </select>
        </td>
        <td class="btn-container">
            <button class="btn btn-primary">
                <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-danger" onclick="excluirVenda(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    tbody.appendChild(novaLinha);
}



//Salva Objeto de Venda Manual no Array e congela campos [OK]
function salvarVendaManual() {
    var codigo = document.getElementById("codigoVendaManual").value;
    var data = document.getElementById("dataVendaManual").value;
    var plataforma = document.getElementById("plataformaVendaManual").value;
    var cliente = document.getElementById("clienteVendaManual").value;
    var produto = document.getElementById("produtoVendaManual").value;
    var preco = parseFloat(document.getElementById("precoUnitarioVendaManual").value) || 0;
    var qtd = parseInt(document.getElementById("qtdVendaManual").value) || 0;
    var desconto = parseFloat(document.getElementById("descontoAcrescimoVendaManual").value) || 0;
    var total = parseFloat(document.getElementById("totalVendaManual").value) || 0;
    var sexo = document.getElementById("sexoVendaManual").value;
    var modeloCapa = document.getElementById("modeloCapaVendaManual").value;
    var NomePersonalizado = document.getElementById("nomePersonalizadoVendaManual").value;
    var observacao = document.getElementById("observacoesVendaManual").value;

    const NovaVenda = new VendaManual(
        codigo, data, plataforma, cliente, produto, preco, qtd, desconto, total,
        sexo, modeloCapa, NomePersonalizado, observacao
    );

    if(cliente == ''|| produto == 'escolha' || qtd <=0 || modeloCapa == '' || modeloCapa <1 || NomePersonalizado == ''){
        alert('Confira se os campos abaixo foram preenchidos:\n\n* NOME CLIENTE\n* NOME PRODUTO\n* QUANTIDADE\n* MODELO DA CAPA\n* NOME PARA PERSONALIZAR\n')
        editarVendaManual();
    }
    else{
        listaVendasManuais.push(NovaVenda); // Proxy salva automaticamente
        congelarVendaManual();
        console.log(listaVendasManuais)
        const indice = listaVendasManuais.length - 1;

        // Passa a venda e o índice
        adicionarVendaNaTabela(NovaVenda, indice);    
    }
}

function adicionarVendaManual(){
    console.log(tamanhoListaVendasManuais);
    if(document.getElementById("clienteVendaManual").disabled == false){
        alert("O cadastro atual não foi concluído.\n Para inserir uma nova Venda termine o cadastro Atual.")
    }
    else{
        editarVendaManual();
        limparVendaManual();
        atualizarCodigoVenda();
    }
}

/*---------------------------------------------------*/ 
//Controle de Collapse de Pesquisa Vendas [OK]
document.addEventListener("DOMContentLoaded", function () {
    const modalElement = document.getElementById('modalCadastroInsumo');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }

    const collapse = document.getElementById('campo');
    const button = document.getElementById('button-esconde-collapse');
    const buttonIcon = button.querySelector('i');

    collapse.addEventListener('show.bs.collapse', () => {
        buttonIcon.classList.remove('fa-angle-down');
        buttonIcon.classList.add('fa-angle-up');
    });

    collapse.addEventListener('hide.bs.collapse', () => {
        buttonIcon.classList.remove('fa-angle-up');
        buttonIcon.classList.add('fa-angle-down');
    });

    button.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
        bsCollapse.toggle();
    });
});

//Validador de Tipo de Busca de Venda [OK]
function validaTipoFiltroVenda(){
    var tipoFiltro = document.getElementById("selectFiltroVenda").value;
    var inputDataVenda = document.getElementById("FiltrovendaData");
    var inputCodigoVenda = document.getElementById("FiltrovendaCodigo");
    var inputNomeCliente = document.getElementById("FiltrovendaCliente");

    if(tipoFiltro === "filtro-data-Venda"){
        inputDataVenda.classList.remove("d-none");
        inputCodigoVenda.classList.add("d-none");
        inputNomeCliente.classList.add("d-none");
    } else if(tipoFiltro === "filtro-codigo-Venda"){
        inputCodigoVenda.classList.remove("d-none");
        inputDataVenda.classList.add("d-none");
        inputNomeCliente.classList.add("d-none");
    } else if(tipoFiltro === "filtro-cliente-Venda"){
        inputNomeCliente.classList.remove("d-none");
        inputDataVenda.classList.add("d-none");
        inputCodigoVenda.classList.add("d-none");
    } else {
        inputDataVenda.classList.add("d-none");
        inputCodigoVenda.classList.add("d-none");
        inputNomeCliente.classList.add("d-none");
    }
}

//Mostra BTN de baixar relatório de Pesquisa de Venda [OK]
function verificaVenda(){
    const verificador = true;
    if(verificador){
        btnBaixarRelatorioVendas.classList.remove("d-none");
    } else {
        btnBaixarRelatorioVendas.classList.add("d-none");
    }
}

//Alterna BTN Editar e Salvar [OK]
function alternarModoEdicao(botao) {
    const icone = botao.querySelector('i');

    if (botao.classList.contains('btn-primary')) {
        botao.classList.remove('btn-primary');
        botao.classList.add('btn-success');

        icone.classList.remove('fa-edit');
        icone.classList.add('fa-save');

        console.log('Entrou no modo de edição');
    } 
    else {
        botao.classList.remove('btn-success');
        botao.classList.add('btn-primary');

        icone.classList.remove('fa-save');
        icone.classList.add('fa-edit');

        console.log('Saiu do modo de edição');
    }
}
