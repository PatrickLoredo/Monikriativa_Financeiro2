// CARREGA AS CONTAS DO NAVEGADOR
let listaContasFinanceiras = JSON.parse(
    localStorage.getItem("listaContasFinanceiras")
) || [];

let meses = ['','Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',]
let mesBaseTabela = new Date().getMonth() + 1; // 1 a 12
let anoBaseTabela = new Date().getFullYear();


const data = new Date();

const dia = String(data.getDate()).padStart(2, '0');
const mes = data.getMonth() + 1;
const mesCorrigido = String(data.getMonth() + 1).padStart(2, '0');
const ano = data.getFullYear();

const horas = String(data.getHours()).padStart(2, '0');
const minutos = String(data.getMinutes()).padStart(2, '0');
const segundos = String(data.getSeconds()).padStart(2, '0');

function mostraDataHora() {
    const data = new Date();

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');

    document.getElementById('buttonTime').innerText =
        `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
}


mostraDataHora();
setInterval(mostraDataHora, 1000);

// AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', function () {
    geraProximoCodigoContaFinanceira();
    exibeContaFinanceiraSalva();
    gerarTabelaReceitasCasa();
    gerarTabelaDespesasCasa();
    atualizaMesesTabela();

});

// GERA O PRÓXIMO CÓDIGO DA CONTA
function geraProximoCodigoContaFinanceira() {
    let totalReceita = 0;
    let totalDespesa = 0;

    for (let i = 0; i < listaContasFinanceiras.length; i++) {
        if (listaContasFinanceiras[i].tipo === 'receita') {
            totalReceita++;
        } else if (listaContasFinanceiras[i].tipo === 'despesa') {
            totalDespesa++;
        }
    }

    const tipoSelecionado = document.getElementById('selectTipoConta').value;
    const inputCodigo = document.getElementById('inputProximoCodigoConta');

    if (tipoSelecionado === 'receita') {
        inputCodigo.value = totalReceita + 1;
    } else {
        inputCodigo.value = totalDespesa + 1;
    }
}

// MUDA A COR DO TIPO DE CONTA
function mudaCorTipoConta(){
    const spanTipoConta = document.getElementById('inputGroupTipoConta');
    const selectTipoConta = document.getElementById('selectTipoConta').value;

    if (selectTipoConta === 'receita') {
        spanTipoConta.classList.remove('bg-danger');
        spanTipoConta.classList.add('bg-success');
    } else {
        spanTipoConta.classList.remove('bg-success');
        spanTipoConta.classList.add('bg-danger');
    }
}

// SALVA NOVA CONTA FINANCEIRA
function salvarNovaContaFinanceira(){
    const codigo = document.getElementById('inputProximoCodigoConta').value;
    const tipo = document.getElementById('selectTipoConta').value;
    const nome = document.getElementById('nomeNovaContaFinanceira').value;
    const saldoInicial = document.getElementById('saldoInicialNovaContaFinanceira').value;

    if (
        tipo.trim() === '' ||
        nome.trim() === '' ||
        saldoInicial.trim() === ''
    ) {
        alert('Preencha todos os campos antes de Salvar!');
        return;
    }

    const contaExiste = listaContasFinanceiras.some(
        conta => conta.nome === nome
    );

    if (contaExiste) {
        alert('Conta já cadastrada anteriormente!');
        document.getElementById('nomeNovaContaFinanceira').value = '';
        return;
    }

    const novaConta = {
        codigo: codigo,
        tipo: tipo,
        nome: nome,
        saldoInicial: saldoInicial
    };

    listaContasFinanceiras.push(novaConta);

    // SALVA NO LOCALSTORAGE
    localStorage.setItem(
        "listaContasFinanceiras",
        JSON.stringify(listaContasFinanceiras)
    );

    alert(`Nova conta ${nome} salva com sucesso!`);

    exibeContaFinanceiraSalva();
    limparCadastroNovaContaFinanceira();
}

// LIMPA O FORMULÁRIO
function limparCadastroNovaContaFinanceira(){
    document.getElementById('selectTipoConta').value = 'receita';
    document.getElementById('nomeNovaContaFinanceira').value = '';
    document.getElementById('saldoInicialNovaContaFinanceira').value = '0,00';

    mudaCorTipoConta();
    geraProximoCodigoContaFinanceira();
}

// EXIBE AS CONTAS SALVAS
function exibeContaFinanceiraSalva() {
    const exibicaoReceita = document.getElementById('exibeCategoriasFinanceirasReceitas');
    const exibicaoDespesa = document.getElementById('exibeCategoriasFinanceirasDespesas');

    exibicaoReceita.innerHTML = '';
    exibicaoDespesa.innerHTML = '';

    listaContasFinanceiras.forEach((conta, index) => {

        if (conta.tipo === 'receita') {
            exibicaoReceita.innerHTML += `
            <div class="row mt-1">
                <div class="col">
                    <button class="btn btn-outline-success uppercase letra w-100" style="font-size: 0.8rem">
                        ${conta.nome}
                    </button>
                </div>
                <div class="col-1">
                    <button 
                        class="btn btn-danger uppercase letra" 
                        style="font-size: 0.8rem"
                        onclick="excluirConta(${index})"
                    >
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                <div class="col-1"></div>
            </div>`;
        } else {
            exibicaoDespesa.innerHTML += `
            <div class="row mt-1">
                <div class="col">
                    <button class="btn btn-outline-danger uppercase letra w-100" style="font-size: 0.8rem">
                        ${conta.nome}
                    </button>
                </div>
                <div class="col-1">
                    <button 
                        class="btn btn-danger uppercase letra" 
                        style="font-size: 0.8rem"
                        onclick="excluirConta(${index})"
                    >
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                <div class="col-1"></div>
            </div>`;
        }
    });
}

//EXCLUI A CATEGORIA REGISTRADA
function excluirConta(index) {

    const confirmar = confirm('Deseja realmente excluir esta conta?');
    if (!confirmar) return;

    listaContasFinanceiras.splice(index, 1);

    localStorage.setItem(
        'listaContasFinanceiras',
        JSON.stringify(listaContasFinanceiras)
    );

    exibeContaFinanceiraSalva();
    geraProximoCodigoContaFinanceira();
}

//GERA FINAMICAMENTE A TABELA DE CATEGORIAS DE RECEITA CONFORME AS CATEGORIAS CADASTRADAS 
function gerarTabelaReceitasCasa() {

    const tbody = document.getElementById('receitasCasaTabelaTBody');
    tbody.innerHTML = '';

    listaContasFinanceiras
        .filter(conta => conta.tipo === 'receita')
        .forEach(conta => {

            let linha = `
                <tr>
                    <td class="tdUppercase td-titulo">
                        ${conta.nome}
                    </td>
            `;

            // Quantidade de meses (ajuste se quiser)
            for (let i = 0; i < 5; i++) {
                linha += `
                    <td class="tdUppercase">
                        <div class="row">
                            <div class="input-group">
                                <input class="form-control">
                            </div>
                        </div>
                    </td>
                `;
            }
            linha += `</tr>`;

            tbody.innerHTML += linha;
        });

    // Linha TOTAL RECEITAS
    let linhaTotal = `
        <tr>
            <td class="tdUppercase" style="background-color: purple; color: white;">
                Total Receitas
            </td>
    `;

    for (let i = 0; i < 5; i++) {
        linhaTotal += `
            <td class="tdUppercase">
                <input class="form-control" disabled>
            </td>
        `;
    }

    let linhaSalvarReceita = `
        <tr>
            <td></td>
            <td>
                <button class="btn uppercase btn-primary" style="font-size: 0.8rem;">
                    <i class="fa fa-save"></i>
                    <span>Salvar</span>
                </button>
            </td>
            <td>
                <button class="btn uppercase btn-primary" style="font-size: 0.8rem;">
                    <i class="fa fa-save"></i>
                    <span>Salvar</span>
                </button>
            </td>
            <td>
                <button class="btn uppercase btn-primary" style="font-size: 0.8rem;">
                    <i class="fa fa-save"></i>
                    <span>Salvar</span>
                </button>
            </td>
            <td>
                <button class="btn uppercase btn-primary" style="font-size: 0.8rem;">
                    <i class="fa fa-save"></i>
                    <span>Salvar</span>
                </button>
            </td>
            <td>
                <button class="btn uppercase btn-primary" style="font-size: 0.8rem;">
                    <i class="fa fa-save"></i>
                    <span>Salvar</span>
                </button>
            </td>

        </tr>
    `

    linhaTotal += `</tr>`;

    tbody.innerHTML += linhaTotal + linhaSalvarReceita;
}

//GERA FINAMICAMENTE A TABELA DE CATEGORIAS DE DESPESAS CONFORME AS CATEGORIAS CADASTRADAS 
function gerarTabelaDespesasCasa() {

    const tbody = document.getElementById('despesasCasaTabelaTBody');
    tbody.innerHTML = '';

    listaContasFinanceiras
        .filter(conta => conta.tipo === 'despesa')
        .forEach(conta => {

            let linha = `
                <tr>
                    <td class="tdUppercase td-titulo">
                        ${conta.nome}
                    </td>
            `;

            // quantidade de meses (ajuste se necessário)
            for (let i = 0; i < 5; i++) {
                linha += `
                    <td class="tdUppercase">
                        <input type="text" class="form-control">
                    </td>
                `;
            }

            linha += `</tr>`;

            tbody.innerHTML += linha;
        });

    // Linha TOTAL DESPESAS
    let linhaTotal = `
        <tr>
            <td class="tdUppercase" style="background-color: purple; color: white;">
                Total Despesas
            </td>
    `;

    for (let i = 0; i < 5; i++) {
        linhaTotal += `
            <td class="tdUppercase">
                <input type="text" class="form-control">
            </td>
        `;
    }

    linhaTotal += `</tr>`;

    tbody.innerHTML += linhaTotal;
}

function selecionaMesAtualTabela() {
    const mesAtual = mes;
    const anoAtual = ano;

    const inputsReceitas = [
        document.getElementById('mes01Receita'),
        document.getElementById('mes02Receita'),
        document.getElementById('mes03Receita'),
        document.getElementById('mes04Receita'),
        document.getElementById('mes05Receita')
    ];

    for (let i = 0; i < inputsReceitas.length; i++) {
        let indiceMes = mesAtual + i;
        let anoExibido = anoAtual;

        if (indiceMes > 12) {
            indiceMes -= 12;
            anoExibido++;
        }

        inputsReceitas[i].innerText = `${meses[indiceMes]} / ${anoExibido}`;
    }
}
let deslocamentoMes = 0;

function atualizaMesesTabela() {

    const idsReceita = [
        'mes01Receita',
        'mes02Receita',
        'mes03Receita',
        'mes04Receita',
        'mes05Receita'
    ];

    const idsDespesa = [
        'mes01Despesa',
        'mes02Despesa',
        'mes03Despesa',
        'mes04Despesa',
        'mes05Despesa'
    ];

    const dataBase = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + deslocamentoMes,
        1
    );

    idsReceita.forEach((id, index) => {
        const d = new Date(
            dataBase.getFullYear(),
            dataBase.getMonth() + index,
            1
        );

        document.getElementById(id).innerText =
            `${meses[d.getMonth() + 1]} / ${d.getFullYear()}`;
    });

    idsDespesa.forEach((id, index) => {
        const d = new Date(
            dataBase.getFullYear(),
            dataBase.getMonth() + index,
            1
        );

        document.getElementById(id).innerText =
            `${meses[d.getMonth() + 1]} / ${d.getFullYear()}`;
    });
}

function voltarMesTabela() {
    deslocamentoMes--;
    atualizaMesesTabela();
}

function avancarMesTabela() {
    deslocamentoMes++;
    atualizaMesesTabela();
}

function salvarValor(tipo, categoria, ano, mes, valor) {

  if (!financeiro[ano]) financeiro[ano] = {};
  if (!financeiro[ano][mes]) {
    financeiro[ano][mes] = { receitas: {}, despesas: {} };
  }

  financeiro[ano][mes][tipo][categoria] = {
    valor: valor
  };

  localStorage.setItem("financeiro", JSON.stringify(financeiro));
}

function totalMes(ano, mes, tipo) {
  let total = 0;

  const categorias = financeiro?.[ano]?.[mes]?.[tipo] || {};

  Object.values(categorias).forEach(item => {
    total += item.valor;
  });

  return total;
}




