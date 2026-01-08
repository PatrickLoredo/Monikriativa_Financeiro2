const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];

let minhasVendas = JSON.parse(localStorage.getItem("minhasVendas")) || [];
localStorage.setItem("minhasVendas", JSON.stringify(minhasVendas));
var tamArrayVendas = minhasVendas.length;

const codigoVendaManual = document.getElementById('codigoVendaManual');

let vendasPorPagina = 3;
let paginaAtual = 1;

// Lista de feriados (formato DD/MM/YYYY)
const feriados = [
    "01/01/2025","03/03/2025","04/03/2025","18/04/2025","21/04/2025",
    "01/05/2025","19/06/2025","07/09/2025","12/10/2025","02/11/2025",
    "15/11/2025","20/11/2025","25/12/2025","01/01/2026","16/02/2026",
    "17/02/2026","03/04/2026","21/04/2026","01/05/2026","04/06/2026",
    "07/09/2026","12/10/2026","02/11/2026","15/11/2026","20/11/2026",
    "25/12/2026","01/01/2027","08/02/2027","09/02/2027","26/03/2027",
    "21/04/2027","01/05/2027","27/05/2027","07/09/2027","12/10/2027",
    "02/11/2027","15/11/2027","20/11/2027","25/12/2027","01/01/2028",
    "28/02/2028","29/02/2028","14/04/2028","21/04/2028","01/05/2028",
    "15/06/2028","07/09/2028","12/10/2028","02/11/2028","15/11/2028",
    "20/11/2028","25/12/2028","01/01/2029","12/02/2029","13/02/2029",
    "30/03/2029","21/04/2029","01/05/2029","31/05/2029","07/09/2029",
    "12/10/2029","02/11/2029","15/11/2029","20/11/2029","25/12/2029",
    "01/01/2030","04/03/2030","05/03/2030","19/04/2030","21/04/2030",
    "01/05/2030","20/06/2030","07/09/2030","12/10/2030","02/11/2030",
    "15/11/2030","20/11/2030","25/12/2030"
];

window.vendas = JSON.parse(localStorage.getItem("minhasVendas")) || [];

window.onload = function(){
    /*const modalOriginal = document.getElementById('XXXX');
    const modalAbre = new bootstrap.Modal(modalOriginal);
    modalAbre.show();*/

    geraCodigoVendaManual();
    populaSelectProdutosCadastrados('produtoVendaManual_1');
    calcularDataEnvioUtil();
    defineDataSelect();
    verificaDiaSemana();
    verificaStatusProducao();
    exibirVendas();
}

function mostraDataHora() {
    const data = new Date();

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');

    const dataHoraFormatada = `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;

    document.getElementById('buttonTime').innerText = dataHoraFormatada;
}

mostraDataHora();
setInterval(mostraDataHora, 1000);

//================================================ MODAL CADASTRO DE VENDA MANUAL ================================================
//GERA O CODIGO AUTOMATICO DA VENDA MANUAL
function geraCodigoVendaManual(){
    if(tamArrayVendas<10){
        codigoVendaManual.value = `VND_MN 0${minhasVendas.length+1}`;
    }
    else{
        codigoVendaManual.value = `VND_MN ${minhasVendas.length+1}`;
    }
}

//POPULA O SELECT COM OS PRODUTOS CADASTRADOS NO ARRAY DE PRODUTOS
function populaSelectProdutosCadastrados(id) {
    const select = document.getElementById(id);

    // limpa antes
    select.innerHTML = '<option value="escolha" selected>Escolha o Produto</option>';

    listaCadastroProdutos.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.nomeCadastroProduto;   // precisa ser igual ao que você usa na função
        option.textContent = produto.nomeCadastroProduto;
        select.appendChild(option);
    });
}

function defineDataSelect() {
    const hoje = new Date();
    const campoVenda = document.getElementById('dataVendaManual');

    const diaHoje = String(hoje.getDate()).padStart(2, '0');
    const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
    const anoHoje = hoje.getFullYear();

    const dataFormatada = `${diaHoje}/${mesHoje}/${anoHoje}`;

    if (campoVenda) {
        campoVenda.value = `${anoHoje}-${mesHoje}-${diaHoje}`; // define o input type="date"
    }
}

let numeroLinhas = 1;
function insereNovoProdutoCadastro() {

    const linhaId = numeroLinhas + 1;
    const tabelaCadastroVenda = document.getElementById('tabelaCadastroVenda');

    tabelaCadastroVenda.insertAdjacentHTML("beforeend", 
    `
        <tr>
            <!--PRODUTO-->
            <td id="${numeroLinhas+1}">
                <select name="" id="produtoVendaManual_${numeroLinhas+1}" 
                    class="form-select text-center"
                    onchange="recuperaPrecoUnitarioLinha(${numeroLinhas+1}), 
                    calculoBrutoLinha(${numeroLinhas+1}),
                    calcularLucro(),
                    calcularDataEnvioUtil()">
                    <option value="escolha" selected>
                        Escolha o Produto
                    </option>
                </select>
            </td>

            <!--SEXO-->
            <td>
                <select name="" id="sexoVendaManual_${numeroLinhas+1}" 
                class="form-select text-center">
                    <option value="nao escolhido">-</option>
                    <option value="Fem">Feminino</option>
                    <option value="Masc">Masculino</option>
                </select>
            </td>

            <!--QTD-->
            <td>
                <input type="number" 
                id="qtdVendaManual_${numeroLinhas+1}"
                class="form-control text-center" 
                placeholder="qtd"
                value="1"
                oninput="recuperaPrecoUnitarioLinha(${numeroLinhas+1});
                calculoBrutoLinha(${numeroLinhas+1});
                verificaQtdProdutos(),
                calcularLucro()"
                onchange="calcularLucro()">
            </td>

            <!--P.UNITARIO-->
            <td>
                <input type="text" 
                    id="precoUnitarioVendaManual_${numeroLinhas+1}"
                    class="form-control text-center" 
                    placeholder="R$ 0,00"
                    oninput="calculoBrutoLinha(${numeroLinhas+1})"
                    onchange="calcularLucro()"                                                                        >
            </td>

            <!--ACRESCIMO-->
            <td>
                <input type="text" 
                    id="descontoAcrescimoVendaManual_${numeroLinhas+1}"
                    class="form-control text-center" 
                    placeholder="R$ 0,00"
                    value="0,00"
                    oninput="calculoBrutoLinha(${numeroLinhas+1}),
                    calcularLucro()">
            </td>

            <!--P.total venda-->
            <td>
                <input type="text" 
                    id="totalVendaManual_${numeroLinhas+1}"
                    class="form-control text-center" 
                    placeholder="R$ 0,00"
                    onchange="calcularLucro()">
            </td>

            <!--P.total insumos-->
            <td>
                <input type="text" 
                    id="insumosVendaManual_${numeroLinhas+1}"
                    class="form-control text-center" 
                    placeholder="R$ 0,00" disabled>
            </td>

            <!--Modelo Capa-->
            <td>
                <input type="number" 
                id="modeloCapaVendaManual_${numeroLinhas+1}"
                class="form-control text-center" 
                placeholder="Nº Capa">
            </td>

            <!--personalização-->
            <td>
                <input type="text" 
                id="nomePersonalizadoVendaManual_${numeroLinhas+1}"
                class="form-control text-center" 
                placeholder="Nome Personalizado" 
                value="">
            </td>

            <td>
                <button class="btn btn-danger btn-sm"
                    onclick="removeNovoProdutoCadastro(this)">
                    <i class="fa fa-trash"></i>
                </button>
            </td>

        </tr>
    `);

    // agora popula corretamente o select da linha
    populaSelectProdutosCadastrados(`produtoVendaManual_${linhaId}`);

    numeroLinhas++;
}

function removeLinha(id) {
    const linha = document.getElementById(`linha_${id}`);
    if (linha) linha.remove();
}

// Recupera preço unitário específico por linha
function recuperaPrecoUnitarioLinha(linhaId) {
    const produtoEscolhido = document.getElementById(`produtoVendaManual_${linhaId}`).value;
    const precoUnitario = document.getElementById(`precoUnitarioVendaManual_${linhaId}`);
    const insumosVendaManual = document.getElementById(`insumosVendaManual_${linhaId}`);
    const qtd = parseFloat(document.getElementById(`qtdVendaManual_${linhaId}`).value) || 1;

    const totalInsumos = document.getElementById(`insumosVendaManual_${linhaId}`);

    if (produtoEscolhido === "escolha") {
        precoUnitario.value = "";
        insumosVendaManual.value = '';
        return;
    }

    const produto = listaCadastroProdutos.find(p => p.nomeCadastroProduto === produtoEscolhido);

    if (produto) {

        // PREÇO UNITÁRIO
        const preco = parseFloat(String(produto.precoVendaShopeeCadastroProduto).replace(',', '.')) || 0;
        precoUnitario.value = preco.toFixed(2).replace('.', ',');

        // INSUMOS POR ITEM x QTD
        const custoBase = parseFloat(String(produto.custoTotalInsumosProdutos).replace(',', '.')) || 0;
        const insumosCalc = custoBase * qtd;
        totalInsumos.value = insumosCalc.toFixed(2).replace('.', ',');

        // ---- SOMA DOS INSUMOS DE TODAS AS LINHAS ----
        let valor = 0;
        for (let i = 1; i <= numeroLinhas; i++) {
            const campo = document.getElementById(`insumosVendaManual_${i}`);
            if (!campo) continue;

            const insumoLinha = parseFloat(campo.value.replace(',', '.')) || 0;
            valor += insumoLinha;
        }

        lucroLiquidoRealEmpresa.value = valor.toFixed(2).replace('.', ',');
    } else {
        precoUnitario.value = "";
    }
}

// Calcula total específico por linha
function calculoBrutoLinha(linhaId) {
    const precoUnitario = parseFloat(document.getElementById(`precoUnitarioVendaManual_${linhaId}`).value.replace(',', '.')) || 0;
    const qtd = parseFloat(document.getElementById(`qtdVendaManual_${linhaId}`).value) || 1;
    const acrescimo = parseFloat(document.getElementById(`descontoAcrescimoVendaManual_${linhaId}`).value.replace(',', '.')) || 0;
    const total = document.getElementById(`totalVendaManual_${linhaId}`);
    //const totalInsumos = document.getElementById(`insumosVendaManual_${linhaId}`);

    total.value = ((precoUnitario * qtd) + acrescimo).toFixed(2).replace('.', ',');

    calculoTotalBrutoCompra();
}

function calculoTotalBrutoCompra() {
    let total = 0;
    let totalProdutosComprados = 0;
    let taxaShopee = 25;
    let taxaFixa = 4;

    for (let i = 1; i <= numeroLinhas; i++) {
        const campo = document.getElementById(`totalVendaManual_${i}`);
        const qtd = document.getElementById(`qtdVendaManual_${i}`);

        if (!campo) continue;

        const valor = parseFloat(campo.value.replace(',', '.')) || 0;
        const numeroProdutos = parseFloat(qtd.value.replace(',', '.')) || 0;

        total += valor;
        totalProdutosComprados += numeroProdutos;
    }

    const campoTotal = document.getElementById("totalBrutoCompra");
    const totalReceberShopee = document.getElementById("totalReceberShopee");

    if (campoTotal) {
        campoTotal.value = total.toFixed(2).replace('.', ',');

        const valorLiquido = total - (((total * taxaShopee) / 100) + (totalProdutosComprados * taxaFixa));

        totalReceberShopee.value = valorLiquido.toFixed(2).replace('.', ',');

        // --- Cálculo lucro ---
        const lucroLiquidoReal = document.getElementById('lucroLiquidoReal');
        const custoInsumos = parseFloat(document.getElementById('lucroLiquidoRealEmpresa').value.replace(',', '.')) || 0;

        const lucro = valorLiquido - custoInsumos;

        lucroLiquidoReal.value = lucro.toFixed(2).replace('.', ',');
    }

    return total;
}

function calcularLucro() {
    let precoTotal = parseFloat(document.getElementById('totalBrutoCompra').value.replace(',', '.')) || 0;
    const taxaPercentual = 25;
    const taxaFixa = 4;

    let qtd = 0;

    const insumos = parseFloat(document.getElementById('lucroLiquidoRealEmpresa').value.replace(',', '.')) || 0;

    for (let i = 1; i <= numeroLinhas; i++) {
        const campoQtd = document.getElementById(`qtdVendaManual_${i}`);
        if (!campoQtd) continue;

        const qtdLinha = parseFloat(campoQtd.value.replace(',', '.')) || 0;
        qtd += qtdLinha;
    }

    const taxaPlataforma = (precoTotal * (taxaPercentual / 100)) + (taxaFixa * qtd);
    const lucroBruto = precoTotal - taxaPlataforma;
    const lucroLiquido = lucroBruto - insumos;

    const percentualLucro = precoTotal > 0 
        ? (lucroLiquido / precoTotal) * 100 
        : 0;

    // === Atualizando o SPAN certo ===
    const resultadoLucroLiquidoVenda = document.getElementById('resultadoLucroLiquidoVenda');
    if (resultadoLucroLiquidoVenda) {
        resultadoLucroLiquidoVenda.textContent = percentualLucro.toFixed(2).replace('.', ',');
    }

    return {
        taxaPlataforma: taxaPlataforma.toFixed(2).replace('.', ','),
        lucroBruto: lucroBruto.toFixed(2).replace('.', ','),
        lucroLiquido: lucroLiquido.toFixed(2).replace('.', ','),
        percentualLucro: percentualLucro.toFixed(2).replace('.', ',') + "%"
    };
}

function verificaDiaSemana() {
    const diasSemana = ['Domingo','Segunda-Feira','Terça-Feira','Quarta-Feira','Quinta-Feira','Sexta-Feira','Sábado'];

    const inputDataVenda = document.getElementById('dataVendaManual').value;
    const tipDiaSemana = document.getElementById('diaSemanaVenda');

    if (!inputDataVenda) return;

    const [ano, mes, dia] = inputDataVenda.split('-');
    const data = new Date(ano, mes - 1, dia);

    const diaSemana = data.getDay();
    const dataFormatada = `${String(dia).padStart(2,'0')}/${String(mes).padStart(2,'0')}/${ano}`;

    // Verifica se é sábado, domingo ou feriado
    const isFeriadoOuFimDeSemana = diaSemana === 0 || diaSemana === 6 || feriados.includes(dataFormatada);

    if (isFeriadoOuFimDeSemana) {
        tipDiaSemana.style.backgroundColor = '#dc3545'; // vermelho
    } else {
        tipDiaSemana.style.backgroundColor = '#198754'; // verde
    }

    tipDiaSemana.classList.remove('d-none');
    tipDiaSemana.classList.add('d-block');
    tipDiaSemana.innerText = diasSemana[diaSemana];

}

let tempoMaxEnvio = 0;
function calcularDataEnvioUtil() {
    tempoMaxEnvio = 0; // reseta toda vez que recalcula

    // Verifica maior tempo de envio entre os produtos
    for (let i = 1; i <= numeroLinhas; i++) {
        const inputProduto = document.getElementById(`produtoVendaManual_${i}`);
        if (!inputProduto) continue;

        const valorProduto = inputProduto.value;
        if (valorProduto === "escolha") continue;

        const produto = listaCadastroProdutos.find(p => p.nomeCadastroProduto === valorProduto);
        if (!produto) continue;

        const diasEntrega = parseInt(produto.tempoEnvioProdutos) || 0;
        tempoMaxEnvio = Math.max(tempoMaxEnvio, diasEntrega);

    }

    const dataVendaManual = document.getElementById('dataVendaManual').value;
    if (!dataVendaManual) return;

    const partes = dataVendaManual.split('-'); // "YYYY-MM-DD"
    const ano = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1;
    const dia = parseInt(partes[2]);

    let data = new Date(ano, mes, dia);

    let diasAdicionados = 0;
    while (diasAdicionados < tempoMaxEnvio) {
        data.setDate(data.getDate() + 1);

        const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado
        const dataFormatadaCheck = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2,'0')}/${data.getFullYear()}`;

        // Só conta o dia se não for sábado, domingo ou feriado
        if (diaSemana !== 0 && diaSemana !== 6 && !feriados.includes(dataFormatadaCheck)) {
            diasAdicionados++;
        }
    }

    const diaFinal = String(data.getDate()).padStart(2, '0');
    const mesFinal = String(data.getMonth() + 1).padStart(2, '0');
    const anoFinal = data.getFullYear();

    const dataEntregaManualInput = document.getElementById('dataEntregaManual');
    if (dataEntregaManualInput) {
        dataEntregaManualInput.value = `${anoFinal}-${mesFinal}-${diaFinal}`; // preenche o input
    }

    const mostraMaiorTempoEnvio = document.getElementById('mostraMaiorTempoEnvio');
    if (mostraMaiorTempoEnvio) {
        mostraMaiorTempoEnvio.innerText = `${tempoMaxEnvio}`;
    }
}

function verificaStatusProducao() {
    const inputDataEnvioEl = document.getElementById('dataEntregaManual');
    const statusProducaoEl = document.getElementById('statusProducaoVendaManual');

    const btnDentroPrazo = document.getElementById('btnPedidoDentroPrazo');
    const btnAtrasado = document.getElementById('btnPedidoAtrasado');
    const btnEnviado = document.getElementById('btnPedidoEnviado');

    // Esconde todos os botões primeiro
    [btnDentroPrazo, btnAtrasado, btnEnviado].forEach(btn => {
        if (btn) {
            btn.classList.remove('d-block', 'd-flex');
            btn.classList.add('d-none');
        }
    });

    if (!inputDataEnvioEl?.value || !statusProducaoEl?.value) return;

    const statusProducao = statusProducaoEl.value;
    const partes = inputDataEnvioEl.value.split('-'); // "YYYY-MM-DD"
    let dataEntrega = new Date(partes[0], partes[1] - 1, partes[2]);
    const hoje = new Date();

    // Zera horas para comparação correta
    hoje.setHours(0, 0, 0, 0);
    dataEntrega.setHours(0, 0, 0, 0);

    // Função para verificar fim de semana ou feriado
    const isFimDeSemanaOuFeriado = (data) => {
        const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;
        return diaSemana === 0 || diaSemana === 6 || feriados.includes(dataFormatada);
    };

    // Ajusta data de entrega se for fim de semana ou feriado
    while (isFimDeSemanaOuFeriado(dataEntrega)) {
        dataEntrega.setDate(dataEntrega.getDate() + 1);
    }

    // Exibe botão correto
    if (statusProducao === "Enviado") {
        if (btnEnviado) btnEnviado.classList.replace('d-none', 'd-block');
    } else if (statusProducao === "Em Produção") {
        if (hoje >= dataEntrega) {
            if (btnAtrasado) btnAtrasado.classList.replace('d-none', 'd-block');
        } else {
            if (btnDentroPrazo) btnDentroPrazo.classList.replace('d-none', 'd-block');
        }
    }

}

function removeNovoProdutoCadastro(botao) {
    const linha = botao.closest('tr'); // pega o <tr> pai do botão
    if (linha) {
        linha.remove(); // remove do DOM
        numeroLinhas--; // opcional, se quiser manter a contagem de linhas
    }

    // Atualiza cálculos e status
    calcularLucro();
    calcularDataEnvioUtil();
    verificaStatusProducao();
}
// Carrega vendas já existentes
window.vendas = JSON.parse(localStorage.getItem("minhasVendas")) || [];

// MODELO DE OBJETO DA VENDA MANUAL
class VendaManual{
    constructor(
        codigoInterno,
        codigoPlatforma,
        dataVenda,
        diaSemanaVenda,
        inputDataEnvio,
        plataforma,
        cliente,
        informacoesProduto,
        tempoEnvio,
        lucroLiquidoVenda,
        totalBruto,
        receberPlataforma,
        saldoCasa,
        saldoEmpresa,
        statusProducao,
        obsercoesImportantes
    ){
        this.codigoInterno = codigoInterno;
        this.codigoPlatforma = codigoPlatforma;
        this.dataVenda = dataVenda;
        this.diaSemanaVenda = diaSemanaVenda;
        this.inputDataEnvio = inputDataEnvio;
        this.plataforma = plataforma;
        this.cliente = cliente;
        this.informacoesProduto = informacoesProduto;
        this.tempoEnvio = tempoEnvio;
        this.lucroLiquidoVenda = lucroLiquidoVenda;
        this.totalBruto = totalBruto;
        this.receberPlataforma = receberPlataforma;
        this.saldoEmpresa = saldoEmpresa;
        this.saldoCasa = saldoCasa;
        this.statusProducao = statusProducao;
        this.obsercoesImportantes = obsercoesImportantes;
    }
}

function salvarVendaManual() {

    var codigoVendaManual = document.getElementById('codigoVendaManual');
    var codigoPlataformaVendaManual = document.getElementById('codigoPlataformaVendaManual');
    var dataVendaManual = document.getElementById('dataVendaManual');
    var diaSemanaVenda = document.getElementById('diaSemanaVenda');
    var dataEntregaManual = document.getElementById('dataEntregaManual');
    var plataformaVendaManual = document.getElementById('plataformaVendaManual');
    var clienteVendaManual = document.getElementById('clienteVendaManual');
    var mostraMaiorTempoEnvio = document.getElementById('mostraMaiorTempoEnvio');
    var resultadoLucroLiquidoVenda = document.getElementById('resultadoLucroLiquidoVenda');
    var totalBrutoCompra = document.getElementById('totalBrutoCompra');
    var totalReceberShopee = document.getElementById('totalReceberShopee');
    var lucroLiquidoReal = document.getElementById('lucroLiquidoReal');
    var lucroLiquidoRealEmpresa = document.getElementById('lucroLiquidoRealEmpresa');
    var statusProducaoVendaManual = document.getElementById('statusProducaoVendaManual');
    var observacoesVendaManual = document.getElementById('observacoesVendaManual');
    
    var informacoesProduto = [];

    const linhas = document.querySelectorAll('[id^="produtoVendaManual_"]');

    for(let i = 0; i < linhas.length; i++){
        let index = i + 1;

        informacoesProduto.push({
            item_Pedido: index,
            valor_ProdutoLinha: document.getElementById(`produtoVendaManual_${index}`).value,
            sexo_ProdutoLinha: document.getElementById(`sexoVendaManual_${index}`).value,
            qtd_ProdutoLinha: document.getElementById(`qtdVendaManual_${index}`).value,
            precoUnitario_ProdutoLinha: document.getElementById(`precoUnitarioVendaManual_${index}`).value,
            descontos_ProdutoLinha: document.getElementById(`descontoAcrescimoVendaManual_${index}`).value,
            precoTotal_ProdutoLinha: document.getElementById(`totalVendaManual_${index}`).value,
            precoInsumos_ProdutoLinha: document.getElementById(`insumosVendaManual_${index}`).value,
            modeloCapa_ProdutoLinha: document.getElementById(`modeloCapaVendaManual_${index}`).value,
            nomePersonalizado_ProdutoLinha: document.getElementById(`nomePersonalizadoVendaManual_${index}`).value
        });
    }

    const novaVenda = new VendaManual(
        codigoVendaManual.value,
        codigoPlataformaVendaManual.value,
        dataVendaManual.value,
        diaSemanaVenda.innerText,
        dataEntregaManual.value,
        plataformaVendaManual.value,
        clienteVendaManual.value,
        informacoesProduto,
        mostraMaiorTempoEnvio.innerText,
        resultadoLucroLiquidoVenda.innerText,
        totalBrutoCompra.value,
        totalReceberShopee.value,
        lucroLiquidoReal.value,
        lucroLiquidoRealEmpresa.value,
        statusProducaoVendaManual.value,
        observacoesVendaManual.value
    );

    minhasVendas.push(novaVenda);

    localStorage.setItem("minhasVendas", JSON.stringify(minhasVendas));

    exibirVendas();
    limparVendaManual();
}

function limparVendaManual(){
    location.reload();
    geraCodigoVendaManual();
}

function formatarData(dataISO) {
    if (!dataISO) return "";
    const partes = dataISO.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function exibirVendas() {
    const campoExibicaoVendas = document.getElementById('campoExibicaoVendas');
    campoExibicaoVendas.innerHTML = "";

    const minhasVendas = JSON.parse(localStorage.getItem("minhasVendas")) || [];
    const totalPaginas = Math.ceil(minhasVendas.length / vendasPorPagina);

    if (totalPaginas === 0) return;

    // Garantir página atual válida
    if (paginaAtual < 1) paginaAtual = 1;
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    // Exibir os mais recentes primeiro
    const startIndex = minhasVendas.length - (paginaAtual * vendasPorPagina);
    const endIndex = startIndex + vendasPorPagina;

    for (let i = endIndex - 1; i >= startIndex; i--) {
        if (i < 0) continue;
        const venda = minhasVendas[i];
        const classePlataforma = venda.plataforma === "Shopee" ? "plataformaShopee" : "plataformaElo7";

        campoExibicaoVendas.innerHTML += `
            <div class="row my-1">
                <div class="col">
                    <div class="alert alert-primary fade show" role="alert">
                        <div class="row">
                            <div class="col-1 ${classePlataforma}">
                                <span>${venda.plataforma}</span>
                            </div>
                            <div class="col-2 statusProducao_${venda.statusProducao}">
                                <span>Status do Pedido: &nbsp;&nbsp;${venda.statusProducao}</span>
                            </div>
                            <div class="col"></div>
                            <div class="col-2 gap-2">
                                <button class="btn btn-sm btn-primary">
                                    <i class="fa fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-danger"
                                 onclick="removerVenda(${i})">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-2">
                                <label class="uppercase fw-bold d-flex justify-content-center">data venda:</label>
                                <span class="uppercase letra d-flex justify-content-center">${formatarData(venda.dataVenda)}</span>
                            </div>
                            <div class="col-2">
                                <label class="uppercase fw-bold d-flex justify-content-center">data envio:</label>
                                <span class="uppercase letra d-flex justify-content-center">${venda.inputDataEnvio ? formatarData(venda.inputDataEnvio) : '--/--/----'}</span>
                            </div>
                            <div class="col-2">
                                <label class="uppercase fw-bold d-flex justify-content-center">id venda:</label>
                                <span class="uppercase letra d-flex justify-content-center">${venda.codigoPlatforma || '---'}</span>
                            </div>
                            <div class="col-4">
                                <label class="uppercase fw-bold d-flex justify-content-center">Cliente:</label>
                                <span class="uppercase letra d-flex justify-content-center text-center">${venda.cliente}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    atualizarPaginacao(totalPaginas);
}

function removerVenda(index) {
    let minhasVendas = JSON.parse(localStorage.getItem("minhasVendas")) || [];

    // segurança extra
    if (index < 0 || index >= minhasVendas.length) {
        console.warn("Índice inválido para remoção:", index);
        return;
    }

    // remove do array
    minhasVendas.splice(index, 1);

    // salva novamente
    localStorage.setItem("minhasVendas", JSON.stringify(minhasVendas));

    // corrige pagina atual se necessário
    const totalPaginas = Math.ceil(minhasVendas.length / vendasPorPagina);
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    // reexibe
    exibirVendas();
}


function atualizarPaginacao(totalPaginas) {
    const paginacao = document.getElementById('paginacao');
    paginacao.innerHTML = "";

    if (totalPaginas === 0) return;

    const maxBotoes = 3;
    const startPage = Math.max(totalPaginas - maxBotoes + 1, 1);
    const endPage = totalPaginas;

    // Botão INÍCIO
    const btnInicio = document.createElement('button');
    btnInicio.className = 'btn btn-danger btn-sm';
    btnInicio.innerText = 'primeira';
    btnInicio.classList.add('uppercase','letra', 'px-2');
    btnInicio.style.fontSize = '0.7rem';
    btnInicio.disabled = paginaAtual === 1;
    btnInicio.onclick = () => { paginaAtual = 1; exibirVendas(); };
    paginacao.appendChild(btnInicio);

    // Botões das páginas
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm ' + (i === paginaAtual ? 'btn-primary' : 'btn-secondary');
        btn.innerText = i;
        btn.onclick = () => { paginaAtual = i; exibirVendas(); };
        paginacao.appendChild(btn);
    }

    // Botão ÚLTIMA
    const btnUltima = document.createElement('button');
    btnUltima.className = 'btn btn-danger btn-sm';
    btnUltima.innerText = 'Última';
    btnUltima.classList.add('uppercase','letra', 'px-2');
    btnUltima.style.fontSize = '0.7rem';
    btnUltima.disabled = paginaAtual === totalPaginas;
    btnUltima.onclick = () => { paginaAtual = totalPaginas; exibirVendas(); };
    paginacao.appendChild(btnUltima);
}

// Inicialização
window.onload = function() {
    exibirVendas();
}

