const listaContasFinanceiras = JSON.parse(localStorage.getItem("listaContasFinanceiras")) || [];

/*GERA O CODIGO DA PROXIMA CONTA A SER CADASTRADA*/
function geraProximoCodigoContaFinanceira () {
    var tamanhoArrayContasFinanceiras = listaContasFinanceiras.length;
    var proximoCodigoContaFinanceira = tamanhoArrayContasFinanceiras + 1;
    var inputProximoCodigoConta = document.getElementById('inputProximoCodigoConta');

    inputProximoCodigoConta.value = proximoCodigoContaFinanceira;
}

/*MUDA A COR DO INPUT-GROUP-TEXT CONFORME VALUE DO TIPO DE CONTA*/
function mudaCorTipoConta(){
    var spanTipoConta = document.getElementById('inputGroupTipoConta');
    var selectTipoConta = document.getElementById('selectTipoConta').value;

    if (selectTipoConta === 'receita') {
        spanTipoConta.classList.remove('bg-danger');
        spanTipoConta.classList.add('bg-success');
    } else {
        spanTipoConta.classList.remove('bg-success');
        spanTipoConta.classList.add('bg-danger');
    }
}

/*SALVA A NOVA CONTA FINANCEIRA NO ARRAY*/
function salvarNovaContaFinanceira(){
    const codigoNovaContaFinanceira = document.getElementById('inputProximoCodigoConta').value;
    const tipoNovaContaFinanceira = document.getElementById('selectTipoConta').value;
    const nomeNovaContaFinanceira = document.getElementById('nomeNovaContaFinanceira').value;
    const saldoInicialNovaContaFinanceira = document.getElementById('saldoInicialNovaContaFinanceira').value;

    if(
        tipoNovaContaFinanceira.trim() === '' ||
        nomeNovaContaFinanceira.trim() === '' ||
        saldoInicialNovaContaFinanceira.trim() === ''
    ){
        alert('Preencha todos os campos antes de Salvar!');
        return;
    }

    const contaExiste = listaContasFinanceiras.some(
        conta => conta.nome === nomeNovaContaFinanceira
    );

    if(contaExiste){
        alert('Conta já cadastrada anteriormente!');
        document.getElementById('nomeNovaContaFinanceira').value = '';
        return;
    }

    const novaConta = {
        codigo: codigoNovaContaFinanceira,
        tipo: tipoNovaContaFinanceira,
        nome: nomeNovaContaFinanceira,
        saldoInicial: saldoInicialNovaContaFinanceira
    };

    listaContasFinanceiras.push(novaConta);

    // ✅ SALVA NO NAVEGADOR
    localStorage.setItem(
        "listaContasFinanceiras",
        JSON.stringify(listaContasFinanceiras)
    );

    alert(`Nova conta ${nomeNovaContaFinanceira} salva com sucesso!`);

    limparCadastroNovaContaFinanceira();
}

/*LIMPA OS CAMPOS DE CADASTRO DE NOVA CONTA FINANCEIRA*/
function limparCadastroNovaContaFinanceira(){
    document.getElementById('selectTipoConta').value = 'receita';
    document.getElementById('nomeNovaContaFinanceira').value = '';
    document.getElementById('saldoInicialNovaContaFinanceira').value = '';
    geraProximoCodigoContaFinanceira();
}

function exibeContaFinanceiraSalva(){
    
}