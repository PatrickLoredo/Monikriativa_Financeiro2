// CARREGA AS CONTAS DO NAVEGADOR
let listaContasFinanceiras = JSON.parse(
    localStorage.getItem("listaContasFinanceiras")
) || [];

// AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', function () {
    geraProximoCodigoContaFinanceira();
    exibeContaFinanceiraSalva();
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
