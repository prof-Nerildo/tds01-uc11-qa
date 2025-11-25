/* Desenvolver app para QA */
using System.Globalization;
using System.Collections.Generic;

// Definir a 'Cultura' para garantir que números decimais usem PONTO (5.25)
// Isso evita bugs de '5,25' (Português-BR) vs '5.25' (Inglês)
CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

// --- == Nosso 'Runner' de testes simples == ---
var calc = new CalculadoraCarrinho();
var meusItens = new List<Item> { new Item { Preco = 100.0, Qtd = 1 } };

// --- Cenário 1: Bug de lógica (Case-sensitive) ---
Console.WriteLine("--- Testado Cenário 1 (Bug de Lógica) ---");
Console.WriteLine("Testando cupom 'dezoff'...");
var total1 = calc.CalculadorTotal(meusItens, "dezoff");

Console.WriteLine( $"Esperado: 90.00 | Recebido: {total1:F2}" );
Console.WriteLine( total1 == 90.00 ? "[PASSOU]" : "[FALHOU]" );

// --- Cenário 2: Bug de Crash (Null Reference) ---
Console.WriteLine( "\n--- Testando Cenário 2 (Bug Chash) ---" );
Console.WriteLine( "Testando lista nula...?" );

try {
    var total2 = calc.CalculadorTotal((List<Item>)null, "DEZOFF");
    //var total2 = calc.CalculadorTotal(meusItens, "DEZOFF");
    Console.WriteLine( $"Total 2:  {total2:F2}" );
} catch ( Exception ex ) { 
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine( $"QUEBROU! Erro: {ex.Message}" );
    Console.ResetColor();
}

// --- Cenário 3: Bug de Precisão (double vs decimal) ---
Console.WriteLine("\n--- Testando o Cenário 3 (Bug de Precisão) ---");
var itensPrecisao = new List<Item>
{ 
    new Item { Preco = 0.1, Qtd = 1 },
    new Item { Preco = 0.2, Qtd = 1 }
};

var total3 = calc.CalculadorTotal(itensPrecisao, null);

Console.WriteLine($"Esperado: 0.30 | Recebido: {total3:F2}");

// o bug do 'double' (0.1 + 0.2 = 0.3000000004) faz a comparação falhar!
Console.WriteLine(total3 == 0.30 ? "[PASSOU]" : "[FALHOU]");

// --- FIM DOS TESTES ---
Console.WriteLine("\n----- === PRESSIONE QUALQUER TECLA PARA SAIR... ===-----");
Console.ReadKey();

// ---------------------------------------------------------
// --- CÓDIGO DO BACKEND (Onde os bugs estão escondidos) ---
// ---------------------------------------------------------

public class CalculadoraCarrinho
{
    /*
     *  Calcula o valor de uma lista de itens no carrinho.
     *  CONTÉM 3 BUG´s!
    */

    public double CalculadorTotal(List<Item> itens, string cupom)
    {
        double total = 0;
        
        // BUG 1 vai quebrar se 'itens' for null
        foreach (var item in itens)
        {
            total += item.Preco * item.Qtd;
        }

        // BUG 2 vai falhar se o cupom for 'dezoff'
        if(cupom == "DEZOFF")
        {
            total = total * 0.90;
        }

        // BUG 3 a soma de 'double' (0.1 + 0.2) não é exata
        return Math.Round(total, 2);
    }
}
public class Item
{
    public double Preco { get; set; }
    public int Qtd { get; set; }
}
/* chamada dia 07/11
 * 
 * Luciano, Wesley, Eduardo, Beatriz, Gustavo
 * Lucas, Julia, Mirian, Bruno, Sarah
 */
