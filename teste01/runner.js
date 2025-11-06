// runner.js

// 1. Importamos a função que queremos testar
import { calcularTotalCarrinho } from "./carrinho.js";

// No Micro-Framework de teste (simulando o Jest)
// Pega a tag '<ul>' do html para escrever os resultados
const resultadosList = document.getElementById('resultados');

/**
 * Função 'expect' simplificada
 * Retorna um objeto com métodos de asserção (como .toBe)
 */
function expect(valorAtual){
    return{
        toBe: (valorEsperado) => {
            if(valorAtual !== valorEsperado){
                // Se falhar, joga um ERRO!
                throw new Error (`[FALHA] Esperado: ${valorEsperado}, Recebido: ${valorAtual}`);
            }
        }
    };
}

/**
 * Função 'test' simplificada
 * Excuta uma função de teste e captura sucesso ou falhas
 */
function test(descricao, fn){
    const li = document.createElement('li');

    let resultadoDetalhe = null; // <--- NOVO: Variável para armazenar o retorno

    try {
        fn(); // Tenta execultar a função de teste

        // Se chegou aqui, NÃO houve ERRO!
        li.textContent = `[PASSOU] ${descricao}`;
        li.className = 'passou';
        console.log(`PASSOU: ${descricao}`);
    } catch (error){
        // Se deu ERRO (o 'expect' falhou), ele cai aqui!
        li.textContent = `[FALHOU] ${descricao} - ${error.message}`;
        li.className = 'falhou';
        console.log(`[FALHOU] ${descricao}`, error.message);
    }
    // Adiciona o resultado na página HTML
    resultadosList.appendChild(li);
}
// ----------------------------------------------------------------
// ---  NOSSOS CASOS DE TESTE ( Exatamente os mesmo de antes )  ---
// ----------------------------------------------------------------

// TESTE 1: Caminho FELIZ
test('deve calcular o total de múltiplos itens corretamente', () =>{
    const itens = [
        {nome: 'Produto A', preco: 10, qtd: 2}, // resultado da multiplicacao 20
        {nome: 'Produto B', preco: 5, qtd: 1}   // resultado da multiplicacao 5
    ];
    const total = calcularTotalCarrinho(itens, null);
    expect(total).toBe(25);
});

// TESTE 2: Regra de Negócio (cupom)
test('deve aplicar o cupom DEZOFF corretamente (10% de desconto)', () =>{
    const itens = [{ nome: 'Produco C', preco: 100, qtd:1 }]
    const total = calcularTotalCarrinho(itens, 'DEZOFF');
    expect(total).toBe(90);
});

// TESTE 3: Caso de Borda (vazio)
test('deve retornar 0 se o carrinho estiver vazio', () =>{
    const itens = [];
    const total = calcularTotalCarrinho(itens, null);
    expect(total).toBe(0);
});

// TESTE 4: Teste Exploratório
test('(NOVA REGRA) - o cupom deve ser aplicado sempre pois tem um UpperCase (10% de desconto)', () =>{
    const itens = [{ nome: 'Produto C', preco: 100, qtd:1 }];
    const total = calcularTotalCarrinho(itens, 'DezOff');
    expect(total).toBe(90);
});

// TESTE 5: Regra de Negócio (cupom 1.1)
// 1. Criamos a nossa 'matriz' de casos de teste.
// Cada objeto é um cenário completo
const casosTesteDescontos = [
    {
        descricao: 'Com 1 item de R$ 100',
        itens: [{ nome: 'Poduto A', preco: 100, qtd: 1}],
        esperado: 90 // Corresponde à '100*0.90 = 90'
    },
    {
        descricao: 'Com 5 item de R$ 20',
        itens: [{ nome: 'Poduto B', preco: 20, qtd: 5}],
        esperado: 90 // Corresponde à '100*0.90 = 90'
    },
    {
        descricao: 'Com múltiplos itens (2 itens de R$ 10) + (1 item de R$50)',
        itens: [
            { nome: 'Poduto C', preco: 10, qtd: 2},
            { nome: 'Poduto D', preco: 50, qtd: 1},
        ],
        esperado: 63 // Corresponde à '70*0.90 = 63'
    },
    {
        descricao: 'Com 1 item de R$ 10.50 (teste com centavos)',
        itens: [{ nome: 'Poduto E', preco: 10.50, qtd: 1}],
        esperado: 9.45 // Corresponde à '10.50*0.90 = 9.45'
    }
];
// 2. Criar loop que execulta um teste pada CADA caso da matriz
casosTesteDescontos.forEach((caso) => {
    // A função 'test()' é chamada dinamicamente
    test(`deve aplicar o cupom 'DEZOFF' corretamente ${caso.descricao},`, () => {
        // Usamos os dados do 'caso' atual
        const total = calcularTotalCarrinho(caso.itens, 'DEZOFF');
        // Comparamos com o resultado esperao do 'caso' atual
        expect(total).toBe(caso.esperado);
    });
});

// TESTE 6: Regra de Negócio (cupom 1.2) - automatizando o teste
// --- função de ajuda para gerar dados aleatórios ---
// Retorna um PREÇO ALEATÓRIO (ex: 12.34 ou 15 ou 19.25)
function getRandomicoPreco(){
    return Math.round( ( Math.random() * 200 + 0.01 ) * 100 ) / 100; // Preço entre 0.01 até 200.00
}
// Retorna uma QUANTIDADE ALEATÓRIA (ex: 3 ou 10 ou 5)
function getRandomicoQtd(){
    return Math.floor( Math.random() * 20 ) + 1; // Qtd de 1 até 20
}

// Cria a lista aleatória de itens 
function createRandomicoItens(){
    const itens = [];
    const numeroDeItens = Math.floor( Math.random() * 10 ) + 1; // Entre 1 até 10 itens

    for ( let i = 0; i < numeroDeItens; i++ ){
        itens.push({
            nome: `Produto aleatório ${i}`,
            preco: getRandomicoPreco(),
            qtd: getRandomicoQtd()
        });
    }
    return itens;
}

// --- O TESTE DASEAD EM PROPRIEDADES ---
test('deve aplciar 10% de desconto corretamente para todos os cenários aleatórios ', () => {
    const NUMERO_DE_TESTE = 15; // Vamos "martelar!" a função 100 vezes!!! :D

    for( let i = 0; i < NUMERO_DE_TESTE; i++ ){
        // Gera os dados
        // A cada loop, criamos um carrinho completamente novo e aleatório
        const itensAleatorios = createRandomicoItens();
        // Calcula o valor esperado
        // Primeiro, calculamos o total SEM 'cupom (DEZOFF)'
        // Agora, calculamos nosso valor 'esperado' 90% do total
        // usando a MESMA lógica de arredondamento da função original
        let totalBruto = 0;
        for (const item of itensAleatorios){
            totalBruto += item.preco * item.qtd;
        }
        const totalDescontoBruto = totalBruto * 0.90;
        const totalEsperado = Math.round(totalDescontoBruto * 100) / 100;
        
        // CALCULA O VALOR ATUAL (chama a função)
        const totalRecebido = calcularTotalCarrinho(itensAleatorios, 'DEZoFF');
        // Compra - o expect agora é dinâmico!
        // Se falhar, usamos um 'throw' para dar uma mensagem de erro detalhada
        if(totalRecebido !== totalEsperado){
            throw new Error(
                `[FALHA] - no cenário ${i+1}
                Itens: ${JSON.stringify(itensAleatorios)} |
                Total Sem Desconto: ${totalBruto} | 
                Esperado (90%): ${totalEsperado} |
                Recebido: ${totalRecebido}`
            );
        }

    }
    // Se o loop terminou sem 'throw', o teste passou!
    // O 'expect(true).toBe(true)' é só para nosso 'test' uma asserção final.
    expect(true).toBe(true);

});
