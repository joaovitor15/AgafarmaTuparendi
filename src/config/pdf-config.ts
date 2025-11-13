export const PDF_CONFIG = {
  FORMATO_NOMES_FICHEIROS: {
    ORCAMENTO: '{{NOME}} - {{DD}}-{{MM}}',
    DECLARACAO: 'Declaração - {{NOME}} - {{DD}}-{{MM}}',
  },

  DOCUMENTO: {
    LARGURA_IMAGEM_ASSINATURA: 130,
    ALTURA_IMAGEM_ASSINATURA: 65,
    MARGENS: {
      superior: 35,
      inferior: 35,
      esquerda: 72,
      direita: 72,
    },

    ALINHAMENTO: {
      ESQUERDA: 'left',
      CENTRO: 'center',
      DIREITA: 'right',
      JUSTIFICADO: 'justify',
    },
    ESTILOS: {
      titulo: {
        fonte: 'Arial',
        tamanho: 18,
        negrito: true,
        alinhamento: 'center',
        espacamentoDepois: 9,
      },
      subtitulo: {
        fonte: 'Arial',
        tamanho: 15,
        negrito: true,
        alinhamento: 'center',
        espacamentoAntes: 2,
        espacamentoDepois: 9,
      },
      textoNormal: {
        fonte: 'Arial',
        tamanho: 13,
        negrito: false,
        alinhamento: 'justify',
        espacamentoDepois: 5,
      },
      rodape: {
        fonte: 'Arial',
        tamanho: 10,
        negrito: false,
        alinhamento: 'center',
      },
    },
    TEXTOS: {
      estabelecimento: {
        titulo: '1. Estabelecimento',
        texto:
          'Nome Fantasia: Agafarma Tuparendi. Razão Social: Luiz Moacir Machry. CNPJ: 89.055.768/0001-76. Inscrição Estadual (IE): 1520012834. Endereço: Avenida Mauá, 1761 - Tuparendi/RS',
      },
      paciente: {
        titulo: '2. Dados do Paciente',
        nome: 'Nome:',
        cpf: 'CPF:',
      },
      assinatura: {
        cidade: 'Tuparendi',
        linha: '_____________________________',
        nomeFarmacia: 'FARMACIA AGAFARMA TUPARENDI',
      },
      rodape: {
        texto:
          'Avenida Mauá, 1761, Centro, Tuparendi-RS, CEP 98940-000 Fone: (55) 3543-1432',
      },
      orcamento: {
        tituloPrincipal: 'Orçamento de Medicamentos',
        medicamentos: {
          titulo: '3. Medicamentos',
          quantidade: 'quantidade:',
          porMes: 'por mês',
          valorUnitario: 'valor unitário:',
          custoMensal: 'custo mensal:',
          custoTratamento: 'custo para',
        },
        totais: {
          titulo: '4. Total do Orçamento',
          totalMensal: 'Valor total do orçamento mensal:',
          totalTratamentoVariavel:
            'Valor total do orçamento para o tratamento completo:',
          totalTratamentoFixo: 'Valor total para',
        },
      },
    },
  },
};

    