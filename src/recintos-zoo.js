class RecintosZoo {

    //recintos e animais possiveis
    constructor()   {
        this.recintos = [
            {numero: 1, bioma: ['savana'], tamanho: 10, animais: ['MACACO', 'MACACO', 'MACACO']},
            {numero: 2, bioma: ['floresta'], tamanho: 5, animais: []},
            {numero: 3, bioma: ['savana', 'rio'], tamanho: 7, animais: ['GAZELA']},
            {numero: 4, bioma: ['rio'], tamanho: 8, animais: []},
            {numero: 5, bioma: ['savana'], tamanho: 9, animais: ['LEAO']}
        ]

        this.animais = [
            {especie: 'LEAO', tamanho: 3, bioma: ['savana'], carnivoro: true},
            {especie: 'LEOPARDO', tamanho: 2, bioma: ['savana'], carnivoro: true},
            {especie: 'CROCODILO', tamanho: 3, bioma: ['rio'], carnivoro: true},
            {especie: 'MACACO', tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false},
            {especie: 'GAZELA', tamanho: 2, bioma: ['savana'], carnivoro: false},
            {especie: 'HIPOPOTAMO', tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false}
        ];
    }

    analisaRecintos(animal, quantidade) {
        const especie = this.animais.find(a => a.especie === animal);

        //animal esta entre as listadas?
        if (!especie)  {
            return {erro: "Animal inválido"};
        }

        //quantidade é valida?
        if (!Number.isInteger(quantidade) || quantidade <= 0)  {
            return {erro: "Quantidade inválida"};
        }

        //dependendo do animal chama a funcao especifica
        if (especie.carnivoro) {
            return this.recintosCarnivoros(especie, quantidade);
        } else {
            return this.recintosNaoCarni(especie, quantidade);
        }
    }

    recintosCarnivoros(animal, quant) {
        const recintosViaveis = this.recintos.filter(r =>
            r.bioma.some(b => animal.bioma.includes(b))
        );

        const recintosValidos = recintosViaveis.filter(recinto => {
            const animaisRecintoValidos = recinto.animais.every(a => a === animal.especie || a === '');

            const espacoNecessario = quant * animal.tamanho;
            const espacoDisponivel = recinto.tamanho - this.calculaEspacoOcupado(recinto) - espacoNecessario;
            return animaisRecintoValidos && espacoDisponivel >= 0;
        });

        return this.montaResposta(recintosValidos, quant, animal);
    }

    recintosNaoCarni(animal, quant) {
        const recintosViaveis = this.recintos.filter(r =>
            r.bioma.some(b => animal.bioma.includes(b))
        );

        const recintosValidos = recintosViaveis.filter(recinto => {
            let espacoDisponivel = recinto.tamanho - this.calculaEspacoOcupado(recinto) - (animal.tamanho * quant);

            //verifica se ja existe outra especie
            const especiesNoRecinto = new Set(recinto.animais);

            especiesNoRecinto.add(animal.especie) //vamos adicionar para fazer a verificacao correta
            const maisDeUmaEspecie = especiesNoRecinto.size > 1;

            //vamos tambem verificar se ja existe um hipopotamo
            const temHipo = especiesNoRecinto.has('HIPOPOTAMO');

            //verifica se possui um carnivoro no recinto
            const temCarnivoro = recinto.animais.some(a => {
                const esp = this.animais.find(an => an.especie === a)
                return esp.carnivoro
            })

            if (temCarnivoro) {
                return false
            }

            if (maisDeUmaEspecie) espacoDisponivel -= 1;

            //regras especificas de espécies 
            
            //HIPOPOTAMO <- so fica com outra especie se estiver em savana e rio
            if (temHipo && animal.especie !== 'HIPOPOTAMO') {
                if (!(recinto.bioma.includes('savana') && recinto.bioma.includes('rio'))) {
                    return false; //so tolera outras especies no bioma certo
                }
            }

            //se vamos add um hipopotamo
            if (animal.especie === 'HIPOPOTAMO') {
                if (maisDeUmaEspecie && !(recinto.bioma.includes('savana') && recinto.bioma.includes('rio'))) {
                    return false;
                }
            }

            //MACACO <- NAO FICA CONFORTAVEL SOZINHO
            if (animal.especie === 'MACACO') {
                if (recinto.animais.length === 0 && quant === 1) {
                    return false;
                }
            }

            return espacoDisponivel >= 0;
        });

        return this.montaResposta(recintosValidos, quant, animal);
    }

    montaResposta(recintos, quant, animal) {
        if (recintos.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        const respostaFinal = recintos.map(recinto => {
            const espacoOcupado = this.calculaEspacoOcupado(recinto);
            const espacoNecessario = quant * animal.tamanho;
            let espacoLivre = recinto.tamanho - espacoOcupado - espacoNecessario;
            
            const especiesNoRecinto = new Set(recinto.animais);

            especiesNoRecinto.add(animal.especie) //vamos adicionar para fazer a verificacao correta
            const maisDeUmaEspecie = especiesNoRecinto.size > 1;

            if (maisDeUmaEspecie) {
                espacoLivre -= 1;
            } 

            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
        });

        return { recintosViaveis: respostaFinal };
    }

    calculaEspacoOcupado(recinto) {
        let espacoOcupado = 0;

        recinto.animais.forEach(e => {
            const animal = this.animais.find(a => a.especie === e);
            espacoOcupado += animal.tamanho;
        });

        return espacoOcupado;
    }
}

export { RecintosZoo as RecintosZoo };
