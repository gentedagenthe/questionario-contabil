import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const TOTAL_ETAPAS = 5;

const estilos = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f4f7fb; color: #1a1a2e; }

  .wrap { max-width: 680px; margin: 0 auto; padding: 24px 16px 60px; }

  .header { text-align: center; margin-bottom: 32px; }
  .logo-texto { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2rem; color: #1B6FAB; letter-spacing: -1px; }
  .logo-n { color: #6BBF4E; }
  .tagline { font-size: 0.78rem; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .subtitulo-vaga { font-size: 0.9rem; color: #1B6FAB; font-weight: 600; margin-top: 6px; }

  /* TELA DA VAGA */
  .card-vaga { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); margin-bottom: 24px; }
  .titulo-vaga { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.7rem; color: #1B6FAB; margin-bottom: 4px; }
  .sub-vaga { font-size: 0.9rem; color: #666; margin-bottom: 24px; }
  .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .info-card { background: #f4f7fb; border-radius: 10px; padding: 14px 16px; }
  .info-icon { font-size: 1.2rem; margin-bottom: 4px; }
  .info-label { font-size: 0.72rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .info-valor { font-size: 0.95rem; font-weight: 600; color: #1a1a2e; margin-top: 2px; }
  .secao-titulo { font-size: 0.78rem; font-weight: 700; color: #1B6FAB; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
  .lista-beneficios { list-style: none; margin-bottom: 24px; }
  .lista-beneficios li { display: flex; align-items: center; gap: 8px; font-size: 0.92rem; color: #444; padding: 5px 0; }
  .check { color: #6BBF4E; font-weight: 700; font-size: 1rem; }
  .lista-requisitos { list-style: none; margin-bottom: 28px; }
  .lista-requisitos li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.9rem; color: #444; padding: 5px 0; line-height: 1.5; }
  .btn-candidatar { width: 100%; background: #1B6FAB; color: #fff; border: none; border-radius: 10px; padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-candidatar:hover { background: #155a8a; }

  /* LGPD */
  .card-lgpd { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); }
  .lgpd-icon { font-size: 2rem; margin-bottom: 12px; }
  .lgpd-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.2rem; color: #1B6FAB; margin-bottom: 16px; }
  .lgpd-texto { font-size: 0.88rem; color: #555; line-height: 1.8; margin-bottom: 20px; }
  .lgpd-texto strong { color: #1a1a2e; }
  .lgpd-check { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; cursor: pointer; }
  .lgpd-check input { width: 18px; height: 18px; margin-top: 2px; accent-color: #1B6FAB; cursor: pointer; flex-shrink: 0; }
  .lgpd-check span { font-size: 0.88rem; color: #333; line-height: 1.6; }
  .erro-lgpd { color: #e53935; font-size: 0.82rem; margin-bottom: 12px; }
  .btn-iniciar { width: 100%; background: #6BBF4E; color: #fff; border: none; border-radius: 10px; padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-iniciar:hover { background: #57a33e; }

  /* PROGRESSO */
  .progresso-wrap { margin-bottom: 28px; }
  .progresso-bar-bg { background: #e0eaf4; border-radius: 99px; height: 6px; margin-bottom: 8px; }
  .progresso-bar { background: linear-gradient(90deg, #1B6FAB, #6BBF4E); border-radius: 99px; height: 6px; transition: width 0.4s; }
  .progresso-texto { font-size: 0.78rem; color: #888; text-align: right; }

  /* CARD ETAPA */
  .card-etapa { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); }
  .etapa-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.4rem; color: #1B6FAB; margin-bottom: 4px; }
  .etapa-sub { font-size: 0.88rem; color: #888; margin-bottom: 28px; }

  /* CAMPOS */
  .campo { margin-bottom: 20px; }
  .campo label { display: block; font-size: 0.85rem; font-weight: 600; color: #333; margin-bottom: 6px; }
  .obrigatorio { color: #e53935; margin-left: 2px; }
  .campo input, .campo select, .campo textarea {
    width: 100%; padding: 12px 14px; border: 1.5px solid #dde3ed; border-radius: 8px;
    font-size: 0.92rem; font-family: 'DM Sans', sans-serif; color: #1a1a2e;
    background: #fafbfc; transition: border-color 0.2s; outline: none;
  }
  .campo input:focus, .campo select:focus, .campo textarea:focus { border-color: #1B6FAB; background: #fff; }
  .campo textarea { resize: vertical; min-height: 100px; }
  .campo select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%231B6FAB' d='M6 8L0 0h12z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
  .campo-erro input, .campo-erro select, .campo-erro textarea { border-color: #e53935; }
  .msg-erro { color: #e53935; font-size: 0.78rem; margin-top: 4px; }

  /* BOTÕES NAVEGAÇÃO */
  .nav-btns { display: flex; gap: 12px; margin-top: 28px; }
  .btn-voltar { flex: 1; background: #f4f7fb; color: #1B6FAB; border: 1.5px solid #d0dcea; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-voltar:hover { background: #e0eaf4; }
  .btn-continuar { flex: 2; background: #1B6FAB; color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-continuar:hover { background: #155a8a; }
  .btn-enviar { flex: 2; background: #6BBF4E; color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-enviar:hover { background: #57a33e; }
  .btn-enviar:disabled { background: #aaa; cursor: not-allowed; }

  /* SUCESSO */
  .card-sucesso { background: #fff; border-radius: 16px; padding: 48px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); text-align: center; }
  .sucesso-icon { font-size: 3.5rem; margin-bottom: 16px; }
  .sucesso-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.5rem; color: #1B6FAB; margin-bottom: 12px; }
  .sucesso-texto { font-size: 0.92rem; color: #555; line-height: 1.8; }

  .footer { text-align: center; margin-top: 32px; font-size: 0.78rem; color: #aaa; }

  @media (max-width: 480px) {
    .grid-info { grid-template-columns: 1fr 1fr; gap: 8px; }
    .card-vaga, .card-lgpd, .card-etapa { padding: 24px 18px; }
  }
`;

const campoVazio = (v) => !v || v.trim() === '' || v === 'Selecione...';

export default function Questionario() {
  const [tela, setTela] = useState('vaga'); // vaga | lgpd | form | sucesso
  const [lgpdAceite, setLgpdAceite] = useState(false);
  const [lgpdErro, setLgpdErro] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const [erros, setErros] = useState({});

  const [dados, setDados] = useState({
    nome: '', cpf: '', email: '', telefone: '', idade: '',
    estado_civil: '', filhos: '', cidade: '', bairro: '', mora_com: '',
    formacao_contabil: '', semestre_periodo: '', instituicao_turno: '',
    tempo_experiencia: '', tipo_empresa: '', empresas_cargos_periodos: '',
    situacao_atual: '',
    lancamentos_contabeis: '', sistema_contabil: '', conciliacao_bancaria: '',
    fechamento_contabil: '', balancetes_demonstracoes: '',
    classificacao_documentos: '', regimes_tributarios: '',
    nivel_excel: '', controle_prazos: '', organizacao_demandas: '',
    motivacao_vaga: '', objetivo_profissional: '', prazo_disponibilidade: '',
    disponibilidade_horario: '', ressalva_horario: '',
    disponibilidade_bairro: '', restricao_bairro: '',
    pretensao_salarial: '', outro_processo: '', informacoes_adicionais: ''
  });

  const set = (campo, valor) => setDados(prev => ({ ...prev, [campo]: valor }));

  const formatarCPF = (v) => {
    const n = v.replace(/\D/g, '').slice(0, 11);
    return n.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
            .replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
            .replace(/(\d{3})(\d{1,3})/, '$1.$2');
  };

  const validarEtapa = () => {
    const e = {};
    if (etapa === 1) {
      if (campoVazio(dados.nome)) e.nome = 'Campo obrigatório';
      if (campoVazio(dados.cpf) || dados.cpf.replace(/\D/g,'').length < 11) e.cpf = 'CPF inválido';
      if (campoVazio(dados.email)) e.email = 'Campo obrigatório';
      if (campoVazio(dados.telefone)) e.telefone = 'Campo obrigatório';
      if (campoVazio(dados.idade)) e.idade = 'Campo obrigatório';
      if (campoVazio(dados.estado_civil)) e.estado_civil = 'Campo obrigatório';
      if (campoVazio(dados.filhos)) e.filhos = 'Campo obrigatório';
      if (campoVazio(dados.cidade)) e.cidade = 'Campo obrigatório';
      if (campoVazio(dados.bairro)) e.bairro = 'Campo obrigatório';
      if (campoVazio(dados.mora_com)) e.mora_com = 'Campo obrigatório';
    }
    if (etapa === 2) {
      if (campoVazio(dados.formacao_contabil)) e.formacao_contabil = 'Campo obrigatório';
      if (campoVazio(dados.tempo_experiencia)) e.tempo_experiencia = 'Campo obrigatório';
      if (campoVazio(dados.tipo_empresa)) e.tipo_empresa = 'Campo obrigatório';
      if (campoVazio(dados.empresas_cargos_periodos)) e.empresas_cargos_periodos = 'Campo obrigatório';
      if (campoVazio(dados.situacao_atual)) e.situacao_atual = 'Campo obrigatório';
    }
    if (etapa === 3) {
      if (campoVazio(dados.lancamentos_contabeis)) e.lancamentos_contabeis = 'Campo obrigatório';
      if (campoVazio(dados.sistema_contabil)) e.sistema_contabil = 'Campo obrigatório';
      if (campoVazio(dados.conciliacao_bancaria)) e.conciliacao_bancaria = 'Campo obrigatório';
      if (campoVazio(dados.fechamento_contabil)) e.fechamento_contabil = 'Campo obrigatório';
      if (campoVazio(dados.balancetes_demonstracoes)) e.balancetes_demonstracoes = 'Campo obrigatório';
    }
    if (etapa === 4) {
      if (campoVazio(dados.nivel_excel)) e.nivel_excel = 'Campo obrigatório';
      if (campoVazio(dados.controle_prazos)) e.controle_prazos = 'Campo obrigatório';
      if (campoVazio(dados.organizacao_demandas)) e.organizacao_demandas = 'Campo obrigatório';
    }
    if (etapa === 5) {
      if (campoVazio(dados.motivacao_vaga)) e.motivacao_vaga = 'Campo obrigatório';
      if (campoVazio(dados.objetivo_profissional)) e.objetivo_profissional = 'Campo obrigatório';
      if (campoVazio(dados.disponibilidade_horario)) e.disponibilidade_horario = 'Campo obrigatório';
      if (campoVazio(dados.disponibilidade_bairro)) e.disponibilidade_bairro = 'Campo obrigatório';
      if (campoVazio(dados.pretensao_salarial)) e.pretensao_salarial = 'Campo obrigatório';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const avancar = () => {
    if (!validarEtapa()) { window.scrollTo(0,0); return; }
    setEtapa(e => e + 1);
    window.scrollTo(0,0);
  };

  const voltar = () => { setEtapa(e => e - 1); window.scrollTo(0,0); };

  const enviar = async () => {
    if (!validarEtapa()) { window.scrollTo(0,0); return; }
    setEnviando(true);
    setErroEnvio('');
    const { error } = await supabase.from('candidatos_contabil').insert([{
      ...dados, lgpd_aceite: true
    }]);
    setEnviando(false);
    if (error) { setErroEnvio('Ocorreu um erro ao enviar. Por favor, tente novamente.'); return; }
    setTela('sucesso');
    window.scrollTo(0,0);
  };

  const C = ({ id, label, obrig, children }) => (
    <div className={`campo${erros[id] ? ' campo-erro' : ''}`}>
      <label>{label}{obrig && <span className="obrigatorio"> *</span>}</label>
      {children}
      {erros[id] && <div className="msg-erro">{erros[id]}</div>}
    </div>
  );

  const Input = ({ id, label, obrig, type='text', placeholder='' }) => (
    <C id={id} label={label} obrig={obrig}>
      <input type={type} value={dados[id]} placeholder={placeholder}
        onChange={e => set(id, id === 'cpf' ? formatarCPF(e.target.value) : e.target.value)} />
    </C>
  );

  const Select = ({ id, label, obrig, opcoes }) => (
    <C id={id} label={label} obrig={obrig}>
      <select value={dados[id]} onChange={e => set(id, e.target.value)}>
        <option value="">Selecione...</option>
        {opcoes.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </C>
  );

  const Textarea = ({ id, label, obrig, placeholder='' }) => (
    <C id={id} label={label} obrig={obrig}>
      <textarea value={dados[id]} placeholder={placeholder}
        onChange={e => set(id, e.target.value)} rows={4} />
    </C>
  );

  return (
    <>
      <style>{estilos}</style>
      <div className="wrap">
        <div className="header">
          <div className="logo-texto">ge<span className="logo-n">n</span>the</div>
          <div className="tagline">gente que entende de gente</div>
          {tela === 'form' && <div className="subtitulo-vaga">Analista Contábil · Campo Grande/MS</div>}
        </div>

        {/* TELA DA VAGA */}
        {tela === 'vaga' && (
          <div className="card-vaga">
            <div className="titulo-vaga">Analista Contábil</div>
            <div className="sub-vaga">Contabilidade · Campo Grande/MS</div>
            <div className="grid-info">
              <div className="info-card"><div className="info-icon">📄</div><div className="info-label">Contratação</div><div className="info-valor">CLT</div></div>
              <div className="info-card"><div className="info-icon">💰</div><div className="info-label">Salário</div><div className="info-valor">R$ 5.000,00</div></div>
              <div className="info-card"><div className="info-icon">🕗</div><div className="info-label">Horário</div><div className="info-valor">Seg a Sex · 07h30 às 18h00</div></div>
              <div className="info-card"><div className="info-icon">📍</div><div className="info-label">Local</div><div className="info-valor">Tiradentes · Campo Grande/MS</div></div>
            </div>
            <div className="secao-titulo">🎁 Benefícios</div>
            <ul className="lista-beneficios">
              <li><span className="check">✓</span> Vale Alimentação R$ 500,00/mês</li>
            </ul>
            <div className="secao-titulo">📚 Requisitos</div>
            <ul className="lista-requisitos">
              <li><span className="check">✓</span> Cursando ou com curso concluído em Ciências Contábeis (obrigatório)</li>
              <li><span className="check">✓</span> Experiência mínima de 6 meses em rotinas contábeis</li>
              <li><span className="check">✓</span> Conhecimento em lançamentos contábeis e conciliação bancária</li>
              <li><span className="check">✓</span> Boa organização e atenção a prazos</li>
              <li><span className="check">✓</span> Desejável: experiência em escritório de contabilidade</li>
            </ul>
            <button className="btn-candidatar" onClick={() => { setTela('lgpd'); window.scrollTo(0,0); }}>
              Candidate-se agora →
            </button>
          </div>
        )}

        {/* TELA LGPD */}
        {tela === 'lgpd' && (
          <div className="card-lgpd">
            <div className="lgpd-icon">🔒</div>
            <div className="lgpd-titulo">Proteção de Dados — LGPD</div>
            <div className="lgpd-texto">
              As informações fornecidas neste questionário serão utilizadas exclusivamente para fins de seleção e recrutamento pela <strong>Genthe Consultoria</strong>, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>.<br /><br />
              Seus dados serão tratados com segurança, sigilo e responsabilidade. Não serão compartilhados com terceiros sem sua autorização prévia e expressa, exceto com a empresa contratante vinculada a este processo seletivo, para fins exclusivos de avaliação de candidatura.<br /><br />
              Você poderá solicitar a correção, atualização ou exclusão dos seus dados a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>.
            </div>
            <label className="lgpd-check">
              <input type="checkbox" checked={lgpdAceite} onChange={e => { setLgpdAceite(e.target.checked); setLgpdErro(false); }} />
              <span>Li e concordo com o tratamento dos meus dados pessoais para participação neste processo seletivo, conforme a LGPD.</span>
            </label>
            {lgpdErro && <div className="erro-lgpd">É necessário concordar com os termos para continuar.</div>}
            <button className="btn-iniciar" onClick={() => {
              if (!lgpdAceite) { setLgpdErro(true); return; }
              setTela('form'); window.scrollTo(0,0);
            }}>Iniciar questionário →</button>
          </div>
        )}

        {/* FORMULÁRIO */}
        {tela === 'form' && (
          <>
            <div className="progresso-wrap">
              <div className="progresso-bar-bg">
                <div className="progresso-bar" style={{ width: `${(etapa / TOTAL_ETAPAS) * 100}%` }} />
              </div>
              <div className="progresso-texto">Etapa {etapa} de {TOTAL_ETAPAS}</div>
            </div>

            <div className="card-etapa">

              {/* ETAPA 1 */}
              {etapa === 1 && (
                <>
                  <div className="etapa-titulo">Dados Pessoais</div>
                  <div className="etapa-sub">Vamos começar com suas informações básicas.</div>
                  <Input id="nome" label="Nome completo" obrig />
                  <Input id="cpf" label="CPF" obrig placeholder="000.000.000-00" />
                  <Input id="email" label="E-mail" obrig type="email" />
                  <Input id="telefone" label="Telefone / WhatsApp" obrig />
                  <Input id="idade" label="Idade" obrig />
                  <Select id="estado_civil" label="Estado civil" obrig opcoes={['Solteiro(a)','Casado(a)','União estável','Divorciado(a)','Viúvo(a)']} />
                  <Select id="filhos" label="Possui filhos?" obrig opcoes={['Não','Sim, 1 filho','Sim, 2 filhos','Sim, 3 ou mais filhos']} />
                  <Input id="cidade" label="Cidade" obrig />
                  <Input id="bairro" label="Bairro" obrig />
                  <Textarea id="mora_com" label="Com quem mora atualmente?" obrig placeholder="Ex: sozinho(a), com cônjuge, com família, com filhos..." />
                </>
              )}

              {/* ETAPA 2 */}
              {etapa === 2 && (
                <>
                  <div className="etapa-titulo">Formação e Experiência</div>
                  <div className="etapa-sub">Conte-nos sobre sua trajetória acadêmica e profissional.</div>
                  <Select id="formacao_contabil" label="Você está cursando ou já concluiu o curso de Ciências Contábeis?" obrig
                    opcoes={['Cursando atualmente','Curso concluído','Curso técnico em contabilidade (cursando ou concluído)','Não possuo formação na área contábil']} />
                  <Input id="semestre_periodo" label="Se estiver cursando, em qual semestre ou período se encontra atualmente?" placeholder="Ex: 4º semestre" />
                  <Input id="instituicao_turno" label="Nome da instituição de ensino e turno" placeholder="Ex: UFMS — Noturno" />
                  <Select id="tempo_experiencia" label="Há quanto tempo você atua com rotinas contábeis de forma contínua?" obrig
                    opcoes={['Menos de 6 meses','Entre 6 meses e 1 ano','Entre 1 e 3 anos','Acima de 3 anos','Não possuo experiência na área']} />
                  <Select id="tipo_empresa" label="Em qual tipo de empresa você atuou ou atua?" obrig
                    opcoes={['Escritório de contabilidade','Setor contábil interno de empresa','Ambos','Nunca atuei na área']} />
                  <Textarea id="empresas_cargos_periodos" label="Cite o nome das empresas onde atuou na área contábil, o cargo ocupado e o período de cada experiência" obrig
                    placeholder="Ex: Escritório ABC Contabilidade — Auxiliar Contábil — Jan/2023 a Dez/2024" />
                  <Select id="situacao_atual" label="Qual é sua situação profissional atual?" obrig
                    opcoes={['Empregado(a) CLT','Autônomo(a) / Freelancer','Desempregado(a)']} />
                </>
              )}

              {/* ETAPA 3 */}
              {etapa === 3 && (
                <>
                  <div className="etapa-titulo">Atividades Contábeis</div>
                  <div className="etapa-sub">Queremos entender sua experiência prática nas rotinas da área.</div>
                  <Textarea id="lancamentos_contabeis" label="Você realiza ou já realizou lançamentos contábeis de forma independente, sem supervisão direta para cada lançamento? Descreva como era esse processo e qual o volume aproximado de lançamentos por mês" obrig
                    placeholder="Descreva o processo e o volume médio..." />
                  <Textarea id="sistema_contabil" label="Qual sistema contábil você utiliza ou já utilizou? Descreva o que executava dentro do sistema (módulos, tipos de lançamento, rotinas de fechamento)" obrig
                    placeholder="Ex: Domínio — lançamentos de entrada e saída, fechamento mensal do Simples Nacional..." />
                  <Textarea id="conciliacao_bancaria" label="Como você executa uma conciliação bancária? Descreva o passo a passo que você segue na prática" obrig
                    placeholder="Descreva o seu processo passo a passo..." />
                  <Textarea id="fechamento_contabil" label="Você já participou do fechamento contábil mensal? Descreva qual era a sua responsabilidade nesse processo" obrig
                    placeholder="Descreva sua participação e responsabilidades..." />
                  <Textarea id="balancetes_demonstracoes" label="Você já elaborou ou apoiou a apuração de balancetes ou demonstrações contábeis? Descreva sua participação" obrig
                    placeholder="Descreva como era sua atuação nessa atividade..." />
                  <Textarea id="classificacao_documentos" label="Você já trabalhou com classificação de documentos contábeis por plano de contas? Se sim, descreva como organizava esse processo"
                    placeholder="Descreva como você classificava os documentos..." />
                  <Textarea id="regimes_tributarios" label="Você já atuou com algum regime tributário (Simples Nacional, Lucro Presumido, Lucro Real)? Descreva sua experiência prática"
                    placeholder="Cite os regimes com que trabalhou e o que realizava em cada um..." />
                </>
              )}

              {/* ETAPA 4 */}
              {etapa === 4 && (
                <>
                  <div className="etapa-titulo">Ferramentas e Organização</div>
                  <div className="etapa-sub">Avalie seus conhecimentos técnicos e forma de trabalho.</div>
                  <Select id="nivel_excel" label="Como você avalia seu conhecimento em Excel?" obrig
                    opcoes={['Básico (fórmulas simples, formatação)','Intermediário (PROCV, tabela dinâmica, filtros)','Avançado (macros, dashboards, funções complexas)']} />
                  <Textarea id="controle_prazos" label="Você mantém controle de prazos contábeis e obrigações acessórias por conta própria? Descreva como faz isso" obrig
                    placeholder="Ex: uso calendário fiscal, planilha de controle, sistema de alertas..." />
                  <Textarea id="organizacao_demandas" label="Como você organiza suas tarefas quando há múltiplas demandas com prazos simultâneos?" obrig
                    placeholder="Descreva seu método de organização e priorização..." />
                </>
              )}

              {/* ETAPA 5 */}
              {etapa === 5 && (
                <>
                  <div className="etapa-titulo">Motivação e Disponibilidade</div>
                  <div className="etapa-sub">Últimas informações antes de concluir.</div>
                  <Textarea id="motivacao_vaga" label="Por que você tem interesse nesta vaga e neste segmento (escritório de contabilidade)?" obrig
                    placeholder="Conte o que te motivou a se candidatar..." />
                  <Textarea id="objetivo_profissional" label="Qual é o seu objetivo profissional nos próximos dois anos?" obrig
                    placeholder="Descreva seus planos e metas..." />
                  <Input id="prazo_disponibilidade" label="Caso esteja empregado(a), qual é o prazo de aviso prévio ou disponibilidade para início?" placeholder="Ex: imediata, 15 dias, 30 dias..." />
                  <Select id="disponibilidade_horario" label="O horário de trabalho é de segunda a sexta, das 07h30 às 18h00. Você tem disponibilidade?" obrig
                    opcoes={['Sim, total disponibilidade','Sim, com ressalvas','Não tenho disponibilidade']} />
                  {dados.disponibilidade_horario === 'Sim, com ressalvas' && (
                    <Input id="ressalva_horario" label="Descreva a ressalva de horário" placeholder="Explique a restrição..." />
                  )}
                  <Select id="disponibilidade_bairro" label="A empresa fica no bairro Tiradentes, em Campo Grande/MS. Você tem disponibilidade para trabalhar nesse bairro?" obrig
                    opcoes={['Sim, sem restrições','Tenho alguma restrição']} />
                  {dados.disponibilidade_bairro === 'Tenho alguma restrição' && (
                    <Input id="restricao_bairro" label="Descreva a restrição de localização" placeholder="Explique a restrição..." />
                  )}
                  <Input id="pretensao_salarial" label="Qual é a sua pretensão salarial para esta vaga?" obrig placeholder="R$ " />
                  <Select id="outro_processo" label="Participa de outro processo seletivo no momento?"
                    opcoes={['Não','Sim']} />
                  <Textarea id="informacoes_adicionais" label="Informações adicionais que gostaria de compartilhar" placeholder="Opcional..." />
                  {erroEnvio && <div className="msg-erro" style={{marginBottom:'12px'}}>{erroEnvio}</div>}
                </>
              )}

              <div className="nav-btns">
                {etapa > 1 && <button className="btn-voltar" onClick={voltar}>← Voltar</button>}
                {etapa < TOTAL_ETAPAS && <button className="btn-continuar" onClick={avancar}>Continuar →</button>}
                {etapa === TOTAL_ETAPAS && (
                  <button className="btn-enviar" onClick={enviar} disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar questionário ✓'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* TELA DE SUCESSO */}
        {tela === 'sucesso' && (
          <div className="card-sucesso">
            <div className="sucesso-icon">✅</div>
            <div className="sucesso-titulo">Questionário enviado!</div>
            <div className="sucesso-texto">
              Obrigado pela participação. Nossa equipe analisará suas respostas e, se houver compatibilidade com a vaga de <strong>Analista Contábil</strong>, entraremos em contato em breve.<br /><br />
              <strong>Genthe — que entende de gente.</strong>
            </div>
          </div>
        )}

        <div className="footer">genthe.com.br · contato@genthe.com.br</div>
      </div>
    </>
  );
}
