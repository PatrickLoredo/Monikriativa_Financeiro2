const listaContasFinanceiras = JSON.parse(localStorage.getItem("listaContasFinanceiras")) || [];
localStorage.setItem("listaContasFinanceiras", JSON.stringify(listaContasFinanceiras));

window.onload = function(){
    geraProximoCodigoContaFinanceira();
}

function geraProximoCodigoContaFinanceira () {
    var tamanhoArrayContasFinanceiras = listaContasFinanceiras.length;
    var proximoCodigoContaFinanceira = tamanhoArrayContasFinanceiras + 1;
    var inputProximoCodigoConta = document.getElementById('inputProximoCodigoConta');

    inputProximoCodigoConta.value = proximoCodigoContaFinanceira;
}
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