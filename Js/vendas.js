const listaCadastroProdutos = JSON.parse(localStorage.getItem("listaCadastroProdutos")) || [];

const minhasVendas = [];
localStorage.setItem("minhasVendas", JSON.stringify(minhasVendas));

const codigoVendaManual = document.getElementById('codigoVendaManual');
var tamArrayVendas = minhasVendas.length;

window.onload = function(){
    const modalOriginal = document.getElementById('modalCadastroVenda');
    const modalAbre = new bootstrap.Modal(modalOriginal);
    modalAbre.show();

    geraCodigoVendaManual();
    populaSelectProdutosCadastrados('produtoVendaManual_1');
}

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

let numeroLinhas = 1;
function insereNovoProdutoCadastro() {

    const linhaId = numeroLinhas + 1;
    const tabelaCadastroVenda = document.getElementById('tabelaCadastroVenda');

    tabelaCadastroVenda.insertAdjacentHTML("beforeend", 
    `
        <tr>
            <!--PRODUTO-->
            <td id="1">
                <select name="" id="produtoVendaManual_${numeroLinhas+1}" 
                    class="form-select text-center"
                    onchange="recuperaPrecoUnitarioLinha(${numeroLinhas+1}), 
                    calculoBrutoLinha(${numeroLinhas+1}),
                    onclick="calcularLucro()">
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
                verificaQtdProdutos()">
            </td>

            <!--P.UNITARIO-->
            <td>
                <input type="text" 
                    id="precoUnitarioVendaManual_${numeroLinhas+1}"
                    class="form-control text-center" 
                    placeholder="R$ 0,00"
                    oninput="calculoBrutoLinha(${numeroLinhas+1})">
            </td>

            <!--ACRESCIMO-->
            <td>
                <input type="text" 
                    id="descontoAcrescimoVendaManual_${numeroLinhas+1}"
                    class="form-control text-center" 
                    placeholder="R$ 0,00"
                    value="0,00"
                    oninput="calculoBrutoLinha(${numeroLinhas+1})">
            </td>

            <!--P.total venda-->
            <td>
                <input type="text" 
                    id="totalVendaManual_${numeroLinhas+1}"
                    class="form-control text-center" 
                    placeholder="R$ 0,00">
            </td>

            <!--P.total insumos-->
            <td>
                <input type="text" 
                    id="insumosVendaManual_${numeroLinhas+1}"
                    class="form-control text-center" 
                    placeholder="R$ 0,00">
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
                onclick="removeNovoProdutoCadastro()"
                id="btnRemoveLinha_1">
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
    const qtd = parseFloat(document.getElementById(`qtdVendaManual_${linhaId}`).value) || 1;

    const totalInsumos = document.getElementById(`insumosVendaManual_${linhaId}`);

    if (produtoEscolhido === "escolha") {
        precoUnitario.value = "";
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

        console.log("Total insumos:", valor.toFixed(2));

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

