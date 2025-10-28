var listaCategoriasProdutos = [];

/*---------------------------------------------------------------------*/
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

/*-----------------------PRODUTOS-----------------------*/
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

function calculaPrecificacaoCorreta() {
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

/*function salvarNovaCategoriaProduto(){

}*/
function adicionarNovaCategoriaProduto() {
    const input = document.getElementById("inputNovaCategoriaProduto");
    const btnAdicionar = document.getElementById('btnAdicionarNovaCategoriaProduto');
    const btnSalvar = document.getElementById('btnSalvarNovaCategoriaProduto');

    input.disabled = false;
    btnAdicionar.classList.add('d-none');
    btnSalvar.classList.remove('d-none');

    input.value = '';
}

class CategoriaProduto {
    constructor(categoria){
        this.categoria = categoria
    }
}

function salvarNovaCategoriaProduto() {
    const input = document.getElementById("inputNovaCategoriaProduto");
    const btnAdicionar = document.getElementById('btnAdicionarNovaCategoriaProduto');
    const btnSalvar = document.getElementById('btnSalvarNovaCategoriaProduto');
    const amostradeCategorias = document.getElementById('amostradeCategorias');

    input.disabled = true;
    btnAdicionar.classList.remove('d-none');
    btnSalvar.classList.add('d-none');

    const novaCategoria = new CategoriaProduto(input.value);

    if(input.value == ''){
        alert('Informe o nome da Categoria do Produto')
    }
    else{
        listaCategoriasProdutos.push(novaCategoria);
        alert(`Categoria adicionada: \n\n${novaCategoria.categoria}`);
        console.log(listaCategoriasProdutos);
    }

}
function mostraCategoriaCadastradaProduto(categoria) {
    // Find the index of the category in the list
    const indice = listaCategoriasProdutos.findIndex(cat => cat.categoria === categoria.categoria);
    
    if (indice !== -1) {
        alert('Indice da Categoria: ' + indice);
    } else {
        alert('Categoria não encontrada.');
    }
}