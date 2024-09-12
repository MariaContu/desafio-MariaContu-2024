import { RecintosZoo } from "./recintos-zoo.js";

describe('Recintos do Zoologico', () => {

    test('Deve rejeitar animal inválido', () => {
            const resultado = new RecintosZoo().analisaRecintos('UNICORNIO', 1);
            expect(resultado.erro).toBe("Animal inválido");
            expect(resultado.recintosViaveis).toBeFalsy();
        });

    test('Deve rejeitar quantidade inválida', () => {
            const resultado = new RecintosZoo().analisaRecintos('MACACO', 0);
            expect(resultado.erro).toBe("Quantidade inválida");
            expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Não deve encontrar recintos para 10 macacos', () => {
            const resultado = new RecintosZoo().analisaRecintos('MACACO', 10);
            expect(resultado.erro).toBe("Não há recinto viável");
            expect(resultado.recintosViaveis).toBeFalsy();
        });

    test('Deve encontrar recinto para 1 crocodilo', () => {
        const resultado = new RecintosZoo().analisaRecintos('CROCODILO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 4 (espaço livre: 5 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(1);
    });

    test('Deve encontrar recintos para 2 macacos', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 5 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 2 (espaço livre: 3 total: 5)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 3 (espaço livre: 2 total: 7)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });

    test('Hipopótamo só pode compartilhar recinto no bioma correto (savana e rio)', () => {
        const resultado = new RecintosZoo().analisaRecintos('HIPOPOTAMO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis).toContain('Recinto 3 (espaço livre: 0 total: 7)');
        expect(resultado.recintosViaveis).toContain('Recinto 4 (espaço livre: 4 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(2);
    });

test('Recinto com hipopotamo sem savana e rio e após tentamos incluir um macaco. (cobrir regras de hipopotamo e macaco)', () => {
    const zoo = new RecintosZoo();

    // Adicionamos um hipopótamo ao recinto 4, que não tem savana e rio
    zoo.recintos[3].animais.push('HIPOPOTAMO');

    // Tentamos adicionar um macaco
    const resultado = zoo.analisaRecintos('MACACO', 1);

    expect(resultado.erro).toBeFalsy();

    // Recinto 4 NÃO deve aparecer porque não tem os biomas corretos
    expect(resultado.recintosViaveis).not.toContain('Recinto 4 (espaço livre: 4 total: 8)');

    // Verifica se os outros recintos viáveis aparecem corretamente
    expect(resultado.recintosViaveis).toContain('Recinto 1 (espaço livre: 6 total: 10)');
    expect(resultado.recintosViaveis).toContain('Recinto 3 (espaço livre: 3 total: 7)');
    expect(resultado.recintosViaveis.length).toBe(2); // Deve haver apenas 2 recintos viáveis
});

});

