/*---------------------------------------------------------------------*/
function calculaPrecoVenda() {
    // Pega os valores do modal
    const custoProduto = parseFloat(document.getElementById("custoProduto").value.replace(',', '.')) || 0;
    const taxaPercentual = parseFloat(document.getElementById("taxaPlataforma").value) / 100 || 0;
    const taxaFixa = parseFloat(document.getElementById("taxaFixaPlataforma").value) || 0;
    const PrecoVenda = parseFloat(document.getElementById("precoVenda").value.replace(',', '.')) || 0;

    // Pega os campos de saída
    const LucroLiquido = document.getElementById("LucroLiquido");
    const LucroReal = document.getElementById("LucroReal");
    const shopeeCustos = document.getElementById("custoRealShopee");
    const custosTotais = document.getElementById("custosTotais");

    const obsprecificacaoideal = document.getElementById("obsprecificacaoideal");
    const obsprecificacaoabaixo = document.getElementById("obsprecificacaoabaixo");

    // Calcula valores
    const valorTaxaShopee = PrecoVenda * taxaPercentual;
    const totalCustos = custoProduto + valorTaxaShopee + taxaFixa;
    const lucroLiquido = PrecoVenda - totalCustos;
    const margemFinal = (lucroLiquido * 100) / totalCustos;
    shopeeCustos.value = (totalCustos - custoProduto).toFixed(2);
    custosTotais.value = (totalCustos-custoProduto).toFixed(2);

    // Atualiza os campos do modal
    LucroLiquido.value = lucroLiquido.toFixed(2);  // Lucro em reais
    LucroReal.value = margemFinal.toFixed(1);      // Lucro em %

if (isNaN(margemFinal)) {
    // Campo vazio ou inválido
    obsprecificacaoideal.classList.add('d-none');
    obsprecificacaoabaixo.classList.add('d-none');
} else if (margemFinal >= 40) {
    // Preço Ideal
    obsprecificacaoideal.classList.remove('d-none');
    obsprecificacaoabaixo.classList.add('d-none');
} else {
    // Preço Abaixo (inclui 0 <= margem < 40 e margem < 0)
    obsprecificacaoideal.classList.add('d-none');
    obsprecificacaoabaixo.classList.remove('d-none');
}}

   
/*---------------------------------------------------------------------*/
let notificacoes = parseInt(localStorage.getItem("notificacoes")) || 0;
var badgeNotificacao = document.getElementById("badge-notificacao");

/*window.onload = function() {
    // Seleciona o modal pelo ID
    var modalElement = document.getElementById('modalCalculoProduto');
    
    // Cria a instância do modal
    var modal = new bootstrap.Modal(modalElement);
    
    // Mostra o modal automaticamente
    modal.show();

    muda_badge();
};*/

function muda_badge(){
    badgeNotificacao.textContent = notificacoes;
    notificacoes++;
}