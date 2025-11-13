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
  const { estabelecimento, paciente, orcamento: orcamentoTextos, assinatura } = PDF_CONFIG.DOCUMENTO.TEXTOS;

  // Calcular totais
  let totalMensal = 0;
  let totalTratamento = 0;
  let pDur = -1;
  let durIguais = true;
  let algumTratamentoLongo = false;

  orcamento.medicamentos.forEach((med) => {
    const custoMensal = med.valorUnitario * med.quantidadeMensal;
    totalMensal += custoMensal;
    const custoTotal = custoMensal * med.quantidadeTratamento;
    totalTratamento += custoTotal;
    
    if (med.quantidadeTratamento > 1) {
      algumTratamentoLongo = true;
    }

    if (pDur === -1) {
      pDur = med.quantidadeTratamento;
    } else if (pDur !== med.quantidadeTratamento) {
      durIguais = false;
    }
  });

  const dataAtual = new Date();
  const dataFormatada = formatarData(dataAtual);

  return (
    <div
      id="pdf-content"
      style={{
        padding: '35px 72px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.5,
        width: '800px',
        margin: '0 auto',
        color: '#000',
        background: '#fff',
      }}
    >
      <div>
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
          const unidade = determinarUnidadePeloNome(med.nome, med.quantidadeMensal);
          const custoMensal = med.valorUnitario * med.quantidadeMensal;
          const custoTotalTratamento = custoMensal * med.quantidadeTratamento;

          let linhaTexto = `${idx + 1}. ${med.nome}${
            med.principioAtivo ? ` (${med.principioAtivo})` : ''
          }, ${orcamentoTextos.medicamentos.quantidade} ${med.quantidadeMensal} ${unidade}, ${
            orcamentoTextos.medicamentos.porMes
          }, ${orcamentoTextos.medicamentos.valorUnitario} ${formatarMoeda(
            med.valorUnitario
          )}, ${
            orcamentoTextos.medicamentos.custoMensal
          } ${formatarMoeda(custoMensal)}`;
          
          if (med.quantidadeTratamento > 1) {
            linhaTexto += `, ${
              orcamentoTextos.medicamentos.custoTratamento
            } ${med.quantidadeTratamento} meses: ${formatarMoeda(custoTotalTratamento)}`;
          }

          return (
            <p
              key={med.id || med.nome}
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
        {algumTratamentoLongo && (
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
      </div>
      
      {/* Seção de Assinatura */}
      <div style={{ marginTop: '20px', paddingTop: '10pt' }}>
          <p style={{ fontSize: '11px', textAlign: 'right', marginBottom: '8pt' }} >
            {assinatura.cidade}, {dataFormatada}
          </p>

          <div style={{ height: '70pt' }}></div>
          
          <p style={{ fontSize: '11px', textAlign: 'center', marginBottom: '4pt', lineHeight: 1 }} >
            {assinatura.linha}
          </p>
          <p style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center', margin: 0 }} >
            {assinatura.nomeFarmacia}
          </p>
      </div>
    </div>
  );
}
