/* usando o 'export' para que outros arquivos
'carinho.js' possam importar sua função */

export function calcularTotalCarrinho(itens, cupom){
    let total = 0;

    if(!itens || itens.length === 0 ){
        return 0; // Se nã há itens o seu total é 0 'ZERO'
    }

    // 1. Soma o preço X quantidade
    for (const item of itens){
        total += item.preco * item.qtd;
    }

    // 2. Aplicar o cupom de desconto
    if((cupom && cupom.toUpperCase() === 'DEZOFF')){
        total = total * 0.90;  // aplica no calculo 10% de desconto direto
    }

    // 3. Arredonda para 2 casas decimais.
    return Math.round(total * 100)/100;
}