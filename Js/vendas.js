window.onload = function() {
    // Seleciona o modal pelo ID
    var modalElement = document.getElementById('modalCadastroVenda');
    
    var modal = new bootstrap.Modal(modalElement);
    
    // Mostra o modal automaticamente
    modal.show();

    // Atualiza badge e código da venda
    muda_badge();
    atualizarCodigoVenda();

    // Quando o modal abrir, calcula a data de entrega
    modalElement.addEventListener('shown.bs.modal', function () {
        verificaDataEntrega();  // Calcula automaticamente a data de entrega
    });
};
/*---------------------------------------------------*/ 
//VARIAVEIS / CONSTANTES / ARRAYS

var listaVendas = [];
var tamanhoListaVendas = listaVendas.length;

var listaVendasManuais =[]
var tamanhoListaVendasManuais = listaVendasManuais.length+1;

const btnBaixarRelatorioVendas = document.getElementById("btnBaixarRelatorioVendas");
const btnSalvarVendaRealizada = document.getElementById("btnSalvarVendaRealizada");
const btnEditarVendaRealizada = document.getElementById("btnEditarVendaRealizada");
const btnSalvarProdutoCadastrado = document.getElementById("btnSalvarProdutoCadastrado");
const btnEditarProdutoCadastrado = document.getElementById("btnEditarProdutoCadastrado");

console.log(tamanhoListaVendasManuais)
/*-------------------------BADGE---------------------------------*/
let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 0;
var badgeNotificacao = document.getElementById("badge-notificacao");

//Teste de Badge [OK]
function muda_badge(){
    badgeNotificacao.textContent = notificacoes;
    notificacoes++;
}

/*---------------------------------------------------*/ 
//Atualiza Código da Venda Manual [OK]
function atualizarCodigoVenda() {
  const inputCodigo = document.getElementById("codigoVendaManual");
  const proximoCodigo = 'VM ' + (listaVendasManuais.length + 1); // <-- aqui

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

function localizaProduto() {
    const produtoVendaManual = document.getElementById('produtoVendaManual').value;
    let resultadoEscolhaProduto = '';  // Use "let" em vez de "const" aqui para permitir a reatribuição.

    // Verificação correta com operadores lógicos
    if (produtoVendaManual === 'Caderneta de Vacina - Completa' ||
        produtoVendaManual === 'Caderneta de Vacina - Apenas Elástico' ||
        produtoVendaManual === 'Caderneta de Vacina - Sem Acessórios') {
        resultadoEscolhaProduto = 'caderneta';
        console.log(resultadoEscolhaProduto);
    }
    else if (produtoVendaManual === 'Capa de Caderneta - Completa' ||
        produtoVendaManual === 'Capa de Caderneta - Apenas Elástico' ||
        produtoVendaManual === 'Capa de Caderneta - Sem Acessórios') {
        resultadoEscolhaProduto = 'capa';
        console.log(resultadoEscolhaProduto);
    }
    else {
        resultadoEscolhaProduto = '';
        console.log(resultadoEscolhaProduto);
    }

    return resultadoEscolhaProduto; // Retorna o valor para uso posterior
}

function verificaDataEntrega() {
    const tipoProduto = localizaProduto(); // Armazena o valor retornado de localizaProduto
    const dataVendaManual = document.getElementById("dataVendaManual");

    console.log(dataEntregaManual)

    if(dataEntregaManual.length<8){
        console.log('Data preenchida incorretamente')
    }
    else{
        if(dataVendaManual.value.length <8){
            console.log('Data Incompleta');
        }
        else{
            if (tipoProduto === 'caderneta') {
            verificaDataEntrega15dias();
            } else if (tipoProduto === 'capa') {
                verificaDataEntrega7dias();
            }
            else {
                console.log("Produto não identificado");
            }
        }

    }
    
}

function verificaDataEntrega7dias() {
    // Pega o valor do input de data da venda
    const dataVenda = document.getElementById("dataVendaManual").value;

    // Se não tiver preenchido, não faz nada
    if (!dataVenda) {
        console.log("Data da venda não preenchida");
        return;
    }

    // Cria objeto Date a partir da string yyyy-mm-dd
    const data = new Date(dataVenda);

    // Soma 8 dias
    data.setDate(data.getDate() + 8);

    // Formata para dd/mm/aaaa
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
    const ano = data.getFullYear();
    const dataEntregaFormatada = `${dia}/${mes}/${ano}`;

    // Atualiza o input type="date" com yyyy-mm-dd
    const inputEntrega = document.getElementById("dataEntregaManual");

    inputEntrega.value = `${ano}-${mes}-${dia}`;

    console.log("Data de entrega:", dataEntregaFormatada);
}

function verificaDataEntrega15dias() {
    // Pega o valor do input de data da venda
    const dataVenda = document.getElementById("dataVendaManual").value;

    // Se não tiver preenchido, não faz nada
    if (!dataVenda) {
        console.log("Data da venda não preenchida");
        return;
    }

    // Cria objeto Date a partir da string yyyy-mm-dd
    const data = new Date(dataVenda);

    // Soma 8 dias
    data.setDate(data.getDate() + 16);

    // Formata para dd/mm/aaaa
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
    const ano = data.getFullYear();
    const dataEntregaFormatada = `${dia}/${mes}/${ano}`;

    // Atualiza o input type="date" com yyyy-mm-dd
    const inputEntrega = document.getElementById("dataEntregaManual");
    inputEntrega.value = `${ano}-${mes}-${dia}`;

    console.log("Data de entrega:", dataEntregaFormatada);
}

//Cria Objeto de Venda Manual [OK]
class VendaManual {
    constructor(codigo, dataVenda, dataEntrega, plataforma, cliente, produto, preco, qtd, desconto, totalm, sexo, modeloCapa, NomePersonalizado, observacao) {
        this.codigo = codigo;
        this.dataVenda = dataVenda;
        this.dataEntrega = dataEntrega;
        this.plataforma = plataforma;
        this.cliente = cliente;
        this.produto = produto;
        this.preco = preco;
        this.qtd = qtd;
        this.desconto = desconto;
        this.totalm = totalm;
        this.sexo = sexo;
        this.modeloCapa = modeloCapa;
        this.nomePersonalizado = NomePersonalizado;
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

//Adiciona o objeto cadastrado na listaVendasManuais
function atualizarTabelaVendas() {
    const tabela = document.getElementById("bodyTabelaVendas");
    tabela.innerHTML = ""; // limpa o conteúdo atual

    listaVendasManuais.forEach((venda, index) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td class="bg-${venda.plataforma.toLowerCase()} rounded-pill d-flex align-items-center justify-content-center mt-1">
                ${venda.plataforma}
            </td>
            <td>${venda.cliente}</td>
            <td>
                <select name="produtoVenda" class="form-select text-center" disabled>
                    <option selected>${venda.produto}</option>
                </select>
            </td>
            <td>
                <select class="form-select text-center" disabled>
                    <option selected>${venda.sexo}</option>
                </select>
            </td>
            <td>${venda.qtd}</td>
            <td>R$ ${venda.totalm.toFixed(2).replace('.', ',')}</td>
            <td>
                <select class="form-select text-center">
                    <option selected>Produção</option>
                    <option>Enviado</option>
                    <option>Entregue</option>
                </select>
            </td>
            <td class="btn-container">
                <button class="btn btn-primary" onclick="visualizarVendaManualPorId('${venda.codigo}')">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn btn-danger" onclick="excluirVenda(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

//Visualizar a venda manual no modal
function visualizarVendaManualPorId(idVenda) {
    // 1️⃣ Busca a venda no array
    const venda = listaVendasManuais.find(v => v.codigo == idVenda);

    if (!venda) {
        alert("Venda não encontrada!");
        return;
    }

    // 2️⃣ Preenche todos os campos do modal
    document.getElementById("codigoVendaManual").value = venda.codigo || "";
    document.getElementById("dataVendaManual").value = venda.dataVenda || "";
    document.getElementById("plataformaVendaManual").value = venda.plataforma || "escolha";
    document.getElementById("clienteVendaManual").value = venda.cliente || "";
    document.getElementById("produtoVendaManual").value = venda.produto || "escolha";
    document.getElementById("precoUnitarioVendaManual").value = venda.precoUnitario ? venda.precoUnitario.toFixed(2) : "";
    document.getElementById("qtdVendaManual").value = venda.qtd || 1;
    document.getElementById("descontoAcrescimoVendaManual").value = venda.descontoAcrescimo || "0,00";
    document.getElementById("totalVendaManual").value = venda.totalm ? venda.totalm.toFixed(2) : "0,00";
    document.getElementById("sexoVendaManual").value = venda.sexo || "nao escolhido";
    document.getElementById("modeloCapaVendaManual").value = venda.modeloCapa || "";
    document.getElementById("nomePersonalizadoVendaManual").value = venda.nomePersonalizado || "";
    document.getElementById("observacoesVendaManual").value = venda.observacoes || "";
    document.getElementById("dataEntregaManual").value = venda.dataEntrega || "";

    // 3️⃣ (Opcional) Desabilita campos para visualização
    congelarVendaManual(); // se você já tiver essa função

    // 4️⃣ Abre o modal do Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('modalCadastroVenda'));
    modal.show();
}

//Salva Objeto de Venda Manual no Array e congela campos [OK]
function salvarVendaManual() {
    var codigo = document.getElementById("codigoVendaManual").value;
    var dataVenda = document.getElementById("dataVendaManual").value;
    var dataEntrega = document.getElementById("dataEntregaManual").value;
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
        codigo, dataVenda, dataEntrega, plataforma, cliente, produto, preco, qtd, desconto, total,
        sexo, modeloCapa, NomePersonalizado, observacao);

    if(cliente === '' || 
        produto === '' || 
        qtd === '' || 
        qtd <=0 || 
        sexo === 'escolha' || 
        modeloCapa === '' || 
        modeloCapa <=0 || 
        NomePersonalizado === ''){
        alert("Verifique se os campos abaixo foram preenchidos: \n\n* NOME CLIENTE\n* PRODUTO\n* QUANTIDADE\n* SEXO\n* MODELO DA CAPA\n* NOME PERSONALIZADO\n")
    }
else {
    listaVendasManuais.push(NovaVenda);
    console.log(listaVendasManuais);
    
    // Atualiza tabela na tela
    atualizarTabelaVendas();

    // Congela os campos depois de salvar
    congelarVendaManual();
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

//Controle de Collapse de Pesquisa Vendas [OK]
document.addEventListener("DOMContentLoaded", function () {
    // Exibir modal automaticamente, se existir
    const modalElement = document.getElementById('modalCadastroInsumo');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }

    // Controle do collapse
    const collapse = document.getElementById('campo');
    const button = document.getElementById('button-esconde-collapse');
    const buttonIcon = button.querySelector('i');

    // Atualiza o ícone conforme o estado do collapse
    collapse.addEventListener('show.bs.collapse', () => {
        buttonIcon.classList.remove('fa-angle-down');
        buttonIcon.classList.add('fa-angle-up');
    });

    collapse.addEventListener('hide.bs.collapse', () => {
        buttonIcon.classList.remove('fa-angle-up');
        buttonIcon.classList.add('fa-angle-down');
    });

    // Corrige o bug: garante que o clique sempre funcione
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

    // Se o botão estiver no modo "editar"
    if (botao.classList.contains('btn-primary')) {
        // muda para modo "salvar"
        botao.classList.remove('btn-primary');
        botao.classList.add('btn-success');

        icone.classList.remove('fa-edit');
        icone.classList.add('fa-save');

        console.log('Entrou no modo de edição');
    } 
    else {
        // volta para modo "editar"
        botao.classList.remove('btn-success');
        botao.classList.add('btn-primary');

        icone.classList.remove('fa-save');
        icone.classList.add('fa-edit');

        console.log('Saiu do modo de edição');
    }
}

