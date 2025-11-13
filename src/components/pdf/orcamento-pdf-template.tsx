'use client';

import { PDF_CONFIG } from '@/config/pdf-config';
import {
  formatarMoeda,
  formatarCPF,
  determinarUnidadePeloNome,
  formatarData,
} from '@/lib/pdf-utils';
import type { Orcamento } from '@/types/orcamento';

interface OrcamentoPDFTemplateProps {
  orcamento: Orcamento;
}

export function OrcamentoPDFTemplate({ orcamento }: OrcamentoPDFTemplateProps) {
  const { estabelecimento, paciente, orcamento: orcamentoTextos, assinatura, rodape } = PDF_CONFIG.DOCUMENTO.TEXTOS;

  // Calcular totais
  let totalMensal = 0;
  let totalTratamento = 0;
  let pDur = -1;
  let durIguais = true;

  orcamento.medicamentos.forEach((med) => {
    const custoMensal = med.valorUnitario * med.quantidadeMensal;
    totalMensal += custoMensal;
    const custoTotal = custoMensal * med.quantidadeTratamento;
    totalTratamento += custoTotal;

    if (pDur === -1) pDur = med.quantidadeTratamento;
    else if (pDur !== med.quantidadeTratamento) durIguais = false;
  });

  const dataAtual = new Date();
  const dataFormatada = formatarData(dataAtual);

  return (
    <div
      id="pdf-content"
      style={{
        position: 'relative',
        minHeight: '1122px', // Altura de uma página A4 em pixels (aproximado)
        padding: '35px 72px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.5,
        width: '800px',
        margin: '0 auto',
        color: '#000',
        background: '#fff',
      }}
    >
      {/* Título Principal */}
      <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginBottom: '9px' }} >
        {orcamentoTextos.tituloPrincipal}
      </p>

      {/* Estabelecimento */}
      <p style={{ fontSize: '15px', fontWeight: 'bold', textAlign: 'center', marginTop: '2px', marginBottom: '9px' }} >
        {estabelecimento.titulo}
      </p>
      <p style={{ fontSize: '11px', textAlign: 'justify', marginBottom: '5px' }} >
        {estabelecimento.texto}
      </p>
      {/* Paciente */}
      <p style={{ fontSize: '15px', fontWeight: 'bold', textAlign: 'center', marginTop: '2px', marginBottom: '9px' }} >
        {paciente.titulo}
      </p>
      <p style={{ fontSize: '11px', marginBottom: '5px' }}>
        <strong>{paciente.nome}</strong> {orcamento.paciente.identificador}
      </p>
      <p style={{ fontSize: '11px', marginBottom: '5px' }}>
        <strong>{paciente.cpf}</strong> {formatarCPF(orcamento.paciente.cpf)}
      </p>
      {/* Medicamentos */}
      <p style={{ fontSize: '15px', fontWeight: 'bold', textAlign: 'center', marginTop: '2px', marginBottom: '9px' }} >
        {orcamentoTextos.medicamentos.titulo}
      </p>
      {orcamento.medicamentos.map((med, idx) => {
        const unidadeBase = determinarUnidadePeloNome(med.nome);
        const unidadePlural = unidadeBase + (med.quantidadeMensal > 1 ? 's' : '');
        const custoMensal = med.valorUnitario * med.quantidadeMensal;
        const custoTotal = custoMensal * med.quantidadeTratamento;
        let linhaTexto = `${idx + 1}. ${med.nome}${
          med.principioAtivo ? ` (${med.principioAtivo})` : ''
        }, ${orcamentoTextos.medicamentos.quantidade} ${med.quantidadeMensal} ${unidadePlural} ${
          orcamentoTextos.medicamentos.porMes
        }, ${orcamentoTextos.medicamentos.valorUnitario} ${formatarMoeda(
          med.valorUnitario
        )}, ${
          orcamentoTextos.medicamentos.custoMensal
        } ${formatarMoeda(custoMensal)}`;
        if (med.quantidadeTratamento > 1) {
          linhaTexto += `, ${
            orcamentoTextos.medicamentos.custoTratamento
          } ${med.quantidadeTratamento} meses: ${formatarMoeda(custoTotal)}`;
        }
        return (
          <p
            key={med.id}
            style={{
              fontSize: '11px',
              textAlign: 'justify',
              marginBottom: '5px',
            }}
          >
            {linhaTexto}
          </p>
        );
      })}
      {/* Totais */}
      <p style={{ fontSize: '15px', fontWeight: 'bold', textAlign: 'center', marginTop: '2px', marginBottom: '9px' }} >
        {orcamentoTextos.totais.titulo}
      </p>
      <p style={{ fontSize: '11px', marginBottom: '5px' }}>
        {orcamentoTextos.totais.totalMensal} {formatarMoeda(totalMensal)}
      </p>
      {totalTratamento > totalMensal && (
        <p style={{ fontSize: '11px', marginBottom: '5px' }}>
          {durIguais
            ? `${orcamentoTextos.totais.totalTratamentoFixo} ${pDur} ${
                pDur > 1 ? 'meses' : 'mês'
              } de tratamento: ${formatarMoeda(totalTratamento)}`
            : `${orcamentoTextos.totais.totalTratamentoVariavel} ${formatarMoeda(
                totalTratamento
              )}`}
        </p>
      )}
      
      <div style={{ position: 'absolute', bottom: '100px', left: 0, right: 0, padding: '0 72px' }}>
          {/* Assinatura */}
          <p style={{ fontSize: '11px', textAlign: 'right', marginBottom: '5px' }} >
            {assinatura.cidade}, {dataFormatada}
          </p>
          <p style={{ fontSize: '11px', textAlign: 'center', marginTop: '60px', marginBottom: '5px' }} >
            {assinatura.linha}
          </p>
          <p style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }} >
            {assinatura.nomeFarmacia}
          </p>
      </div>

      {/* Rodapé */}
      <div style={{ position: 'absolute', bottom: '35px', left: 0, right: 0, padding: '0 72px' }}>
        <p style={{ fontSize: '10px', textAlign: 'center', margin: '5px 0' }} >
          {rodape.texto}
        </p>
      </div>
    </div>
  );
}
