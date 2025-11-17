window.onload = function() {
    carregarListasDoNavegador();

    // 2️⃣ Agora sim, os dados já estão disponíveis
    console.log(listaVendasManuais);
    console.log('Tamanho do Array: ' + (listaVendasManuais.length + 1));

    atualizarCodigoVenda();

    // Chama a função que atualiza o select de produtos
    atualizarSelectProdutosVendaManual();

    modalElement.addEventListener('shown.bs.modal', function () {
        verificaDataEntrega();
    });
};


//ABRIR MODAL AUTOMATICAMENTE
document.addEventListener("DOMContentLoaded", function() {
    const modalElement = document.getElementById('modalCadastroVenda'); // container .modal
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    atualizarSelectProdutosVendaManual();
    // garante listeners
    const selectProduto = document.getElementById("produtoVendaManual");
    if (selectProduto) {
        selectProduto.addEventListener("change", function () {
            atualizarTempoEnvioProduto(this.value);
        });
    }

    const dataVenda = document.getElementById("dataVendaManual");
    if (dataVenda) {
        dataVenda.addEventListener("change", verificaDataEntrega);
    }
});


document.getElementById("produtoVendaManual").addEventListener("change", function () {
    atualizarTempoEnvioProduto(this.value);
    atualizarPrecoUnitario(this.value);
});


document.getElementById("plataformaVendaManual").addEventListener("change", function () {
    const produto = document.getElementById("produtoVendaManual").value;
    atualizarPrecoUnitario(produto);
});

function parsePrecoBR(valor) {
    if (!valor) return 0;

    return Number(
        String(valor)
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    ) || 0;
}

/*---------------------------------------------------*/ 
//VARIAVEIS / CONSTANTES / ARRAYS

var listaVendas = [];
var tamanhoListaVendas = listaVendas.length;

var listaVendasManuais =[]
var tamanhoListaVendasManuais = listaVendasManuais.length+1;

const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];

const btnBaixarRelatorioVendas = document.getElementById("btnBaixarRelatorioVendas");
const btnSalvarVendaRealizada = document.getElementById("btnSalvarVendaRealizada");
const btnEditarVendaRealizada = document.getElementById("btnEditarVendaRealizada");
const btnSalvarProdutoCadastrado = document.getElementById("btnSalvarProdutoCadastrado");
const btnEditarProdutoCadastrado = document.getElementById("btnEditarProdutoCadastrado");

console.log(tamanhoListaVendasManuais)
/*-------------------------BADGE---------------------------------*/
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
/*---------------------------------------------------*/ 

//Atualiza Código da Venda Manual [OK]
function atualizarCodigoVenda() {
    editarVendaManual()
    limparVendaManual()
    const inputCodigo = document.getElementById("codigoVendaManual");
    const proximoCodigo = 'VM ' + (listaVendasManuais.length+1); // <-- aqui

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

//Atualiza o select de produtos em Venda Manual com todos os produtos cadastrados em listaCadastroProdutos
function atualizarSelectProdutosVendaManual() {
    const select = document.getElementById("produtoVendaManual");
    if (!select) return;

    select.innerHTML = '<option value="escolha" selected>Escolha o Produto</option>';

    const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];

    listaCadastroProdutos.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.nomeCadastroProduto;
        option.textContent = produto.nomeCadastroProduto;
        // opcional: guardar o tempo direto no option para fallback
        if (produto.tempoEnvioProdutos !== undefined) {
            option.dataset.tempo = String(produto.tempoEnvioProdutos);
        }
        select.appendChild(option);
    });
}

//Inputa o botão de acordo com o o prazo e Status de Envio [OK]
function verificarStatusEntrega() {
    const dataEntrega = document.getElementById("dataEntregaManual").value;
    const statusEntrega = document.getElementById("statusEntrega").value;

    const btnDentroPrazo = document.querySelector("#infoPrazoEntrega .btn-success");
    const btnAtrasado = document.querySelector("#infoPrazoEntrega .btn-danger");
    const btnEntregue = document.getElementById('btn-orange');

    // Função auxiliar para esconder tudo
    function esconderTodos() {
        btnDentroPrazo.classList.add("d-none");
        btnAtrasado.classList.add("d-none");
        btnEntregue.classList.add("d-none");
    }

    // GERAR DATA DE HOJE (corrigido)
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // STATUS: ENTREGUE
    if (statusEntrega === 'Entregue') {
        esconderTodos();
        btnEntregue.classList.remove("d-none");
        return;
    }

    // STATUS: A caminho ou Não escolhido
    if (statusEntrega === 'A caminho' ||
        statusEntrega === 'Sem Escolha Status Entrega') {
        esconderTodos();
        return;
    }

    // NÃO EXISTE DATA → esconde tudo
    if (!dataEntrega) {
        esconderTodos();
        return;
    }

    // CONVERTE A DATA DO INPUT
    const envio = new Date(dataEntrega);
    envio.setHours(0, 0, 0, 0);

    // NÃO ENTREGUE → VERIFICA PRAZO
    esconderTodos();

    if (envio >= hoje) {
        // Dentro do prazo
        btnDentroPrazo.classList.remove("d-none");
    } else {
        // Atrasado
        btnAtrasado.classList.remove("d-none");
    }
}

//Inputa a data de Entrega [OK]
function verificaDataEntrega() {
    const dataVendaInput = document.getElementById("dataVendaManual");
    const tempoEnvioInput = document.getElementById("tempoEnvioProduto");
    const dataEntregaInput = document.getElementById("dataEntregaManual");

    if (!dataEntregaInput) return;

    const dataVenda = dataVendaInput ? dataVendaInput.value : "";
    // pega tempo como Number; se vazio -> NaN
    const tempoEnvio = tempoEnvioInput ? Number(tempoEnvioInput.value) : NaN;

    // debug opcional: descomente se quiser ver no console
    // console.log('verificaDataEntrega()', { dataVenda, tempoEnvio });

    // validação simples
    if (!dataVenda || !Number.isFinite(tempoEnvio) || tempoEnvio <= 0) {
        dataEntregaInput.value = "";
        dataEntregaInput.disabled = true;
        return;
    }

    // Criando data de forma segura (tratando timezone)
    // dataVenda vem no formato YYYY-MM-DD
    const parts = dataVenda.split("-");
    // parts: [YYYY, MM, DD]
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1; // JS Date month é 0-based
    const day = Number(parts[2]);

    const dt = new Date(year, month, day);
    dt.setDate(dt.getDate() + Math.floor(tempoEnvio)); // adiciona dias

    // formata para YYYY-MM-DD local (ajusta timezone)
    const adjusted = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000);
    const yyyy = adjusted.getFullYear();
    const mm = String(adjusted.getMonth() + 1).padStart(2, "0");
    const dd = String(adjusted.getDate()).padStart(2, "0");
    const isoDate = `${yyyy}-${mm}-${dd}`;

    dataEntregaInput.value = isoDate;
    dataEntregaInput.disabled = false;

    verificarStatusEntrega();
}

//Inputa o valor Unitário do Produto de acordo com o cadastro no Array [OK]
function atualizarPrecoUnitarioVendaManual() {
    const plataforma = document.getElementById("plataformaVendaManual").value;
    const produtoSelecionado = document.getElementById("produtoVendaManual").value;
    const precoInput = document.getElementById("precoUnitarioVendaManual");

    const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];

    // Valores padrão
    if (produtoSelecionado === "escolha" || plataforma === "escolha") {
        precoInput.value = "R$ 0,00";
        return;
    }

    // Localiza o produto
    const produto = listaCadastroProdutos.find(p => p.nomeCadastroProduto === produtoSelecionado);

    if (!produto) {
        precoInput.value = "R$ 0,00";
        return;
    }

    let preco = 0;

    // Lógica por plataforma
    switch (plataforma) {
        case "Shopee":
            preco = produto.precoVendaShopeeCadastroProduto || 0;
            break;
        case "Elo7":
            preco = produto.precoVendaElo7CadastroProduto || 0;
            break;
        case "Venda Avulsa":
        default:
            preco = 0;
            break;
    }

    // Formata como moeda BR (mesmo se vier número ou string)
    precoInput.value = Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Listener adicionado **somente uma vez** [OK]
document.getElementById("produtoVendaManual").addEventListener("change", function () {
    atualizarTempoEnvioProduto(this.value);
});

// Atualiza o input de Tempo de Envio conforme o produto selecionado
function atualizarTempoEnvioProduto(nomeProduto) {
    const tempoInput = document.getElementById("tempoEnvioProduto");
    const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];

    if (!tempoInput) return;

    // reset se escolha padrão
    if (!nomeProduto || nomeProduto === "escolha") {
        tempoInput.value = "";
        tempoInput.disabled = true;
        // recalcula caso já haja data
        verificaDataEntrega();
        return;
    }

    // procurar produto
    const produto = listaCadastroProdutos.find(item => item.nomeCadastroProduto === nomeProduto);

    // fallback: tentar pegar data-attribute do option
    const select = document.getElementById("produtoVendaManual");
    let tempoFallback = null;
    if (select) {
        const opt = Array.from(select.options).find(o => o.value === nomeProduto);
        if (opt && opt.dataset && opt.dataset.tempo) tempoFallback = Number(opt.dataset.tempo);
    }

    if (produto && (produto.tempoEnvioProdutos !== undefined && produto.tempoEnvioProdutos !== null && produto.tempoEnvioProdutos !== "")) {
        tempoInput.value = produto.tempoEnvioProdutos;
        tempoInput.disabled = false;
    } else if (tempoFallback !== null) {
        tempoInput.value = tempoFallback;
        tempoInput.disabled = false;
    } else {
        // se não existir tempo definido
        tempoInput.value = "";
        tempoInput.disabled = true;
    }

    // sempre que atualizamos o tempo do produto, recalculamos a data de entrega
    verificaDataEntrega();
}

//Filtra a categoria de produto selecionada
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

//Atualiza o preço Unitário conforme seleção de Produto e de acordo com o Cadastro
function atualizarPrecoUnitario(produtoNome) {
    const plataforma = document.getElementById("plataformaVendaManual").value;
    const inputPreco = document.getElementById("precoUnitarioVendaManual");

    const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];
    const produto = listaCadastroProdutos.find(item => item.nomeCadastroProduto === produtoNome);

    // Se não encontrou produto ou plataforma inválida
    if (!produto || plataforma === "escolha" || produtoNome === "escolha") {
        inputPreco.value = "0,00";
        return;
    }

    let preco = 0;

    // Seleção por plataforma
    if (plataforma === "Shopee") {
        preco = produto.precoVendaShopeeCadastroProduto;
    } 
    else if (plataforma === "Elo7") {
        preco = produto.precoVendaElo7CadastroProduto;
    }

    // ---------- BLINDAGEM COMPLETA CONTRA NaN ----------
    if (preco === undefined || preco === null) preco = 0;

    // Remove R$, pontos, vírgulas e converte para número
    preco = Number(
        String(preco)
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    );

    // Se ainda assim der NaN → vira 0
    if (isNaN(preco)) preco = 0;

    // Formata para padrão brasileiro
    inputPreco.value = preco.toFixed(2).replace(".", ",");
}


function calcularTotalBrutoVendaManual() {
    const precoUnitario = document.getElementById('precoUnitarioVendaManual').value;
    const quantidade = document.getElementById('qtdVendaManual').value;
    const acrescimoDesconto = document.getElementById('descontoAcrescimoVendaManual').value;
    const totalVendaManual = document.getElementById('totalVendaManual');

    // Converte valores
    const preco = parseFloat(precoUnitario.replace(",", "."));
    const qtd = parseFloat(quantidade);
    const adcDesc = parseFloat(acrescimoDesconto.replace(",", "."));

    // Evita erro se valores inválidos
    if (isNaN(preco) || isNaN(qtd)) {
        totalVendaManual.value = "";
        return;
    }

    const total = (preco * qtd) + (isNaN(adcDesc) ? 0 : adcDesc);

    // Formata padrão BR
    totalVendaManual.value = total.toFixed(2).replace(".", ",");

    console.log(totalVendaManual.value);
}


//Exibe Status Atual da Data de Entrega
function verificaStatusEntrega() {
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera horas para comparar só datas

    var statusEntrega = document.getElementById("statusEntrega");
    var dataEntregaManual = document.getElementById("dataEntregaManual").value;

    if (!dataEntregaManual) {
        console.log("Sem data de entrega preenchida");
        return;
    }

    // Converte a string do input para um objeto Date
    var dataEntrega = new Date(dataEntregaManual);
    dataEntrega.setHours(0, 0, 0, 0);

    // 🔹 Formata a data de hoje no formato dd/mm/aaaa
    var diaHoje = String(hoje.getDate()).padStart(2, '0');
    var mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
    var anoHoje = hoje.getFullYear();
    var dataHojeFormatada = `${diaHoje}/${mesHoje}/${anoHoje}`;

    console.log("Data de hoje:", dataHojeFormatada);

    // 🔹 Formata também a data de entrega (opcional, pra mostrar no console)
    var diaEntrega = String(dataEntrega.getDate()).padStart(2, '0');
    var mesEntrega = String(dataEntrega.getMonth() + 1).padStart(2, '0');
    var anoEntrega = dataEntrega.getFullYear();
    var dataEntregaFormatada = `${diaEntrega}/${mesEntrega}/${anoEntrega}`;

    console.log("Data de entrega:", dataEntregaFormatada);

    // 🔹 Verifica se está atrasado ou em tempo

    //Data de Envio a frente
    var statusEntrega = document.getElementById('statusEntrega');
    var statusProducao = document.getElementById('statusProducaoVendaManual').value;

    // Remove classes antigas
    statusEntrega.classList.remove('bg-success','bg-warning','bg-danger','text-white');

    if (dataEntrega <= hoje) { // Data já passou
        if (statusProducao === 'Em Produção') {
            statusEntrega.value = 'Envio Atrasado';
            statusEntrega.classList.add('bg-danger','text-white');
        } else if (statusProducao === 'Enviado') {
            statusEntrega.value = 'Enviado';
            statusEntrega.classList.add('bg-warning');
        } else {
            statusEntrega.value = '-';
        }
    } else { // Data ainda não passou
        if (statusProducao === 'Em Produção') {
            statusEntrega.value = 'Em tempo';
            statusEntrega.classList.add('bg-success','text-white');
        } else if (statusProducao === 'Enviado') {
            statusEntrega.value = 'Enviado';
            statusEntrega.classList.add('bg-warning');
        } else {
            statusEntrega.value = 'Em tempo';
            statusEntrega.classList.add('bg-success','text-white');
        }
    }
}
    
//Cria Objeto de Venda Manual [OK]
class VendaManual {
    constructor(codigo, 
        codigoPlataforma, 
        dataVenda, 
        dataEntrega, 
        statusProducao, 
        statusEntrega, 
        plataforma, 
        cliente, 
        produto, 
        preco, 
        qtd, 
        desconto, 
        totalm, 
        sexo, 
        modeloCapa, 
        NomePersonalizado, 
        observacao) {
        this.codigo = codigo;
        this.codigoPlataforma = codigoPlataforma;
        this.dataVenda = dataVenda;
        this.dataEntrega = dataEntrega;
        this.statusProducao = statusProducao;
        this.statusEntrega = statusEntrega;
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

// Salva Objeto de Venda Manual no Array e congela campos [OK]
function salvarVendaManual() {
    var codigo = document.getElementById("codigoVendaManual").value;
    var codigoPlataforma = document.getElementById("codigoPlataformaVendaManual").value;
    var dataVenda = document.getElementById("dataVendaManual").value;
    var dataEntrega = document.getElementById("dataEntregaManual").value;
    var statusProducao = document.getElementById("statusProducaoVendaManual").value;
    var statusEntrega = document.getElementById("statusEntrega").value;
    var plataforma = document.getElementById("plataformaVendaManual").value;
    var cliente = document.getElementById("clienteVendaManual").value;
    var produto = document.getElementById("produtoVendaManual").value;
    var preco = parseFloat(document.getElementById("precoUnitarioVendaManual").value) || 0;
    var desconto = parseFloat(document.getElementById("descontoAcrescimoVendaManual").value) || 0;
    var total = parseFloat(document.getElementById("totalVendaManual").value) || 0;
    var qtd = parseInt(document.getElementById("qtdVendaManual").value) || 0;
    var total = parseFloat(document.getElementById("totalVendaManual").value) || 0;
    var sexo = document.getElementById("sexoVendaManual").value;
    var modeloCapa = document.getElementById("modeloCapaVendaManual").value;
    var nomePersonalizado = document.getElementById("nomePersonalizadoVendaManual").value;
    var observacao = document.getElementById("observacoesVendaManual").value;

    console.log(listaVendasManuais);

    // 🧩 Validação básica
    if (
        codigoPlataforma == '' ||
        cliente === '' ||
        produto === '' ||
        qtd <= 0 ||
        sexo === 'escolha' ||
        modeloCapa === '' ||
        nomePersonalizado === ''
    ) {
        alert("Verifique se os campos abaixo foram preenchidos:\n\nCÓDIGO PLATAFORMA \n* NOME CLIENTE\n* PRODUTO\n* QUANTIDADE\n* SEXO\n* MODELO DA CAPA\n* NOME PERSONALIZADO\n");
        return;
    }

    // 🚨 Verifica se já existe venda com o mesmo código de plataforma
    const indicePlataforma = listaVendasManuais.findIndex(venda => venda.codigoPlataforma === codigoPlataforma);
    
    if (indicePlataforma !== -1) {
        alert("⚠️ Já existe uma venda cadastrada com este CÓDIGO DE VENDA DA PLATAFORMA!");
        return; // ❌ Interrompe o processo de salvamento
    }

    // ✅ Cria o objeto da venda
    const novaVenda = new VendaManual(
        codigo, codigoPlataforma, dataVenda, dataEntrega, statusProducao, statusEntrega,
        plataforma, cliente, produto, preco, qtd, desconto, total,
        sexo, modeloCapa, nomePersonalizado, observacao
    );

    // ✅ Verifica se já existe venda com o mesmo código interno
    const indiceExistente = listaVendasManuais.findIndex(venda => venda.codigo === codigo);

    if (indiceExistente !== -1) {
        // Se já existe → substitui os dados da venda no mesmo índice
        listaVendasManuais[indiceExistente] = novaVenda;
        console.log(`Venda ${codigo} atualizada com sucesso!`);
    } else {
        // Se não existe → adiciona uma nova venda
        listaVendasManuais.push(novaVenda);
        console.log(`Nova venda ${codigo} adicionada com sucesso!`);
    }

    // 🧱 Atualiza tabela na tela
    atualizarTabelaVendas();

    // 🔒 Congela os campos depois de salvar
    congelarVendaManual();

    // 💾 Salva no navegador
    salvarListasNoNavegador();

    // 🔄 Atualiza tabela novamente (reforço)
    atualizarTabelaVendas();

    console.log(listaVendasManuais);
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
    document.getElementById("statusProducaoVendaManual").disabled = false;
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
    document.getElementById("codigoPlataformaVendaManual").disabled = true;
    document.getElementById("dataVendaManual").disabled = true;
    document.getElementById("plataformaVendaManual").disabled = true;
    document.getElementById("statusProducaoVendaManual").disabled = true;
    document.getElementById("clienteVendaManual").disabled = true;
    document.getElementById("produtoVendaManual").disabled = true;
    document.getElementById("qtdVendaManual").disabled = true;
    document.getElementById("descontoAcrescimoVendaManual").disabled = true;
    document.getElementById("sexoVendaManual").disabled = true;
    document.getElementById("modeloCapaVendaManual").disabled = true;
    document.getElementById("nomePersonalizadoVendaManual").disabled = true;
    document.getElementById("observacoesVendaManual").disabled = true;
}

//Visualizar a venda manual no modal [OK]
function visualizarVendaManualPorId(idVenda) {
    // 1️⃣ Busca a venda no array
    const venda = listaVendasManuais.find(v => v.codigo == idVenda);

    if (!venda) {
        alert("Venda não encontrada!");
        return;
    }

    // 2️⃣ Preenche todos os campos do modal
    document.getElementById("codigoVendaManual").value = venda.codigo || "";
    document.getElementById("codigoPlataformaVendaManual").value = venda.codigoPlataforma || "";
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

//Funcoes ao abrir o Modal VendaManual [OK]
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

//Adiciona o objeto cadastrado na listaVendasManuais [OK]
function atualizarTabelaVendas() {
    const tabela = document.getElementById("bodyTabelaVendas");
    tabela.innerHTML = "";

    const totalPaginas = Math.ceil(listaVendasManuais.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const vendasPaginadas = listaVendasManuais.slice(inicio, fim);

    vendasPaginadas.forEach((venda, index) => {
        const linha = document.createElement("tr");

        // ✅ Formata a data de entrega
        let dataEntregaFormatada = "";
        if (venda.dataEntrega && venda.dataEntrega.includes("-")) {
            const [ano, mes, dia] = venda.dataEntrega.split("-");
            dataEntregaFormatada = `${dia}/${mes}/${ano}`;
        } else {
            dataEntregaFormatada = venda.dataEntrega || "";
        }

        // ✅ Formata a data da venda (corrigido!)
        let dataVendaFormatada = "";
        if (venda.dataVenda && venda.dataVenda.includes("-")) {
            const [ano, mes, dia] = venda.dataVenda.split("-");
            dataVendaFormatada = `${dia}/${mes}/${ano}`;
        } else {
            dataVendaFormatada = venda.dataVenda || "";
        }

        // ✅ Pega apenas os 3 últimos caracteres do código da plataforma
        const codigoPlataformaFinal = venda.codigoPlataforma
            ? venda.codigoPlataforma.slice(-3)
            : "—"; // mostra um traço se estiver vazio

        // ✅ Estilos por status
        if (venda.statusEntrega === "Envio Atrasado" || venda.statusEntrega === "Atrasado") {
            linha.classList.add("linha-atrasada");
        }
        if (venda.statusEntrega === "Enviado") {
            linha.classList.add("linha-enviado");
        }

        linha.innerHTML = `
            <th scope="row">${venda.codigo}</th>
            <th scope="row">${codigoPlataformaFinal}</th>
            <td class="bg-${venda.plataforma.toLowerCase()} rounded-pill d-flex align-items-center justify-content-center mt-1">
                ${venda.plataforma}
            </td>
            <td>${dataVendaFormatada}</td> <!-- ✅ Corrigido -->
            <td>${dataEntregaFormatada}</td>
            <td>${venda.cliente}</td>
            <td>${venda.produto}</td>
            <td>${venda.sexo}</td>
            <td>${venda.qtd}</td>
            <td>R$ ${venda.totalm.toFixed(2).replace('.', ',')}</td>
            <td>${venda.statusProducao}</td>
            <td class="btn-container">
                <button class="btn btn-primary" onclick="visualizarVendaManualPorId('${venda.codigo}')">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="btn btn-danger" onclick="excluirVenda(${inicio + index})">
                    <i class="fa-solid fa-circle-xmark"></i>
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });

    renderizarPaginacao(totalPaginas);

    // ✅ Faz o scroll focar no final da página quando troca de página
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
}

const itensPorPagina = 5;
let paginaAtual = 1;

// Renderiza a paginação na lista de Vendas Manuais
function renderizarPaginacao(totalPaginas) {
    const paginacao = document.getElementById("paginationVendasRealizadas");
    paginacao.innerHTML = "";

    const maxPaginasVisiveis = 3;
    let inicioPagina = Math.max(paginaAtual - 1, 1);
    let fimPagina = inicioPagina + maxPaginasVisiveis - 1;

    if (fimPagina > totalPaginas) {
        fimPagina = totalPaginas;
        inicioPagina = Math.max(fimPagina - maxPaginasVisiveis + 1, 1);
    }

    // Função para criar botões de navegação
    function criarBotao(classe, conteudo, disabled, onClick, cor = "bg-dark") {
        const li = document.createElement("li");
        li.classList.add("page-item");
        if (disabled) li.classList.add("disabled");

        const botao = document.createElement("button");
        botao.classList.add("page-link", cor, "text-white", "border-0");
        botao.type = "button";
        botao.innerHTML = conteudo;

        botao.addEventListener("click", () => {
            if (!disabled) {
                onClick();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        });

        li.appendChild(botao);
        paginacao.appendChild(li);
    }

    // Botão Início
    criarBotao("inicio", '<i class="fa-solid fa-angles-left"></i>', paginaAtual === 1, () => {
        paginaAtual = 1;
        atualizarTabelaVendas();
    }, "bg-dark");

    // Botão Anterior
    criarBotao("anterior", '<i class="fa-solid fa-arrow-left"></i>', paginaAtual === 1, () => {
        paginaAtual--;
        atualizarTabelaVendas();
    }, "bg-dark");

    // Números de página (3 visíveis)
    for (let i = inicioPagina; i <= fimPagina; i++) {
        const li = document.createElement("li");
        li.classList.add("page-item");
        if (i === paginaAtual) li.classList.add("active");

        const botao = document.createElement("button");
        botao.classList.add("page-link", "border-0");
        botao.type = "button";
        botao.innerText = i;

        botao.addEventListener("click", () => {
            paginaAtual = i;
            atualizarTabelaVendas();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });

        li.appendChild(botao);
        paginacao.appendChild(li);
    }

    // Botão Próximo
    criarBotao("proximo", '<i class="fa-solid fa-arrow-right"></i>', paginaAtual === totalPaginas, () => {
        paginaAtual++;
        atualizarTabelaVendas();
    }, "bg-dark");

    // Botão Final
    criarBotao("fim", '<i class="fa-solid fa-angles-right"></i>', paginaAtual === totalPaginas, () => {
        paginaAtual = totalPaginas;
        atualizarTabelaVendas();
    }, "bg-dark");
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

// Salva os arrays no localStorage [OK]
function salvarListasNoNavegador() {
    localStorage.setItem("listaVendasManuais", JSON.stringify(listaVendasManuais));
    console.log("✅ Vendas manuais salvas no navegador.");
}

// Carrega os arrays do localStorage [OK]
function carregarListasDoNavegador() {
    const vendasSalvas = localStorage.getItem("listaVendasManuais");

    if (vendasSalvas) {
        listaVendasManuais = JSON.parse(vendasSalvas);
        console.log("📦 Vendas manuais carregadas do navegador:", listaVendasManuais);
        atualizarTabelaVendas(); // Atualiza a tabela automaticamente
    } else {
        console.log("Nenhuma venda manual encontrada no navegador.");
    }
}