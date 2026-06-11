import React, { useState, useCallback } from 'react';
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

  .progresso-wrap { margin-bottom: 28px; }
  .progresso-bar-bg { background: #e0eaf4; border-radius: 99px; height: 6px; margin-bottom: 8px; }
  .progresso-bar { background: linear-gradient(90deg, #1B6FAB, #6BBF4E); border-radius: 99px; height: 6px; transition: width 0.4s; }
  .progresso-texto { font-size: 0.78rem; color: #888; text-align: right; }

  .card-etapa { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); }
  .etapa-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.4rem; color: #1B6FAB; margin-bottom: 4px; }
  .etapa-sub { font-size: 0.88rem; color: #888; margin-bottom: 28px; }

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

  .nav-btns { display: flex; gap: 12px; margin-top: 28px; }
  .btn-voltar { flex: 1; background: #f4f7fb; color: #1B6FAB; border: 1.5px solid #d0dcea; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-voltar:hover { background: #e0eaf4; }
  .btn-continuar { flex: 2; background: #1B6FAB; color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-continuar:hover { background: #155a8a; }
  .btn-enviar { flex: 2; background: #6BBF4E; color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-enviar:hover { background: #57a33e; }
  .btn-enviar:disabled { background: #aaa; cursor: not-allowed; }

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

// ─── Todos os componentes de campo definidos FORA do componente pai ───
// Isso evita que o React recrie o elemento no DOM a cada render,
// o que causava perda de foco após cada digitação.

const CampoWrapper = ({ id, label, obrig, erro, children }) => (
  <div className={`campo${erro ? ' campo-erro' : ''}`}>
    <label htmlFor={id}>{label}{obrig && <span className="obrigatorio"> *</span>}</label>
    {children}
    {erro && <div className="msg-erro">{erro}</div>}
  </div>
);

const CampoInput = ({ id, label, obrig, erro, value, onChange, type = 'text', placeholder = '' }) => (
  <CampoWrapper id={id} label={label} obrig={obrig} erro={erro}>
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      autoComplete="off"
    />
  </CampoWrapper>
);

const CampoSelect = ({ id, label, obrig, erro, value, onChange, opcoes }) => (
  <CampoWrapper id={id} label={label} obrig={obrig} erro={erro}>
    <select id={id} value={value} onChange={onChange}>
      <option value="">Selecione...</option>
      {opcoes.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </CampoWrapper>
);

// onKeyDown no textarea: Enter nao dispara os botoes de navegacao
const CampoTextarea = ({ id, label, obrig, erro, value, onChange, placeholder = '' }) => (
  <CampoWrapper id={id} label={label} obrig={obrig} erro={erro}>
    <textarea
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      rows={4}
      onKeyDown={e => { if (e.key === 'Enter') e.stopPropagation(); }}
    />
  </CampoWrapper>
);

// ─── Componente principal ───

export default function Questionario() {
  const [tela, setTela] = useState('vaga');
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

  // useCallback garante referencia estavel — evita recriar handlers a cada render
  const set = useCallback((campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  }, []);

  const formatarCPF = (v) => {
    const n = v.replace(/\D/g, '').slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length <= 6) return `${n.slice(0,3)}.${n.slice(3)}`;
    if (n.length <= 9) return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6)}`;
    return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9)}`;
  };

  // Handlers estaveis via useCallback
  const handleCPF     = useCallback((e) => set('cpf', formatarCPF(e.target.value)), [set]);
  const handleNome    = useCallback((e) => set('nome', e.target.value), [set]);
  const handleEmail   = useCallback((e) => set('email', e.target.value), [set]);
  const handleTel     = useCallback((e) => set('telefone', e.target.value), [set]);
  const handleIdade   = useCallback((e) => set('idade', e.target.value), [set]);
  const handleCidade  = useCallback((e) => set('cidade', e.target.value), [set]);
  const handleBairro  = useCallback((e) => set('bairro', e.target.value), [set]);
  const handleMoraCom = useCallback((e) => set('mora_com', e.target.value), [set]);
  const handleEstCiv  = useCallback((e) => set('estado_civil', e.target.value), [set]);
  const handleFilhos  = useCallback((e) => set('filhos', e.target.value), [set]);

  const handleSemestre    = useCallback((e) => set('semestre_periodo', e.target.value), [set]);
  const handleInstituicao = useCallback((e) => set('instituicao_turno', e.target.value), [set]);
  const handleFormacao    = useCallback((e) => set('formacao_contabil', e.target.value), [set]);
  const handleTempo       = useCallback((e) => set('tempo_experiencia', e.target.value), [set]);
  const handleTipoEmp     = useCallback((e) => set('tipo_empresa', e.target.value), [set]);
  const handleEmpresas    = useCallback((e) => set('empresas_cargos_periodos', e.target.value), [set]);
  const handleSituacao    = useCallback((e) => set('situacao_atual', e.target.value), [set]);

  const handleLancamentos  = useCallback((e) => set('lancamentos_contabeis', e.target.value), [set]);
  const handleSistema      = useCallback((e) => set('sistema_contabil', e.target.value), [set]);
  const handleConciliacao  = useCallback((e) => set('conciliacao_bancaria', e.target.value), [set]);
  const handleFechamento   = useCallback((e) => set('fechamento_contabil', e.target.value), [set]);
  const handleBalancetes   = useCallback((e) => set('balancetes_demonstracoes', e.target.value), [set]);
  const handleClassif      = useCallback((e) => set('classificacao_documentos', e.target.value), [set]);
  const handleRegimes      = useCallback((e) => set('regimes_tributarios', e.target.value), [set]);

  const handleExcel       = useCallback((e) => set('nivel_excel', e.target.value), [set]);
  const handlePrazos      = useCallback((e) => set('controle_prazos', e.target.value), [set]);
  const handleOrganizacao = useCallback((e) => set('organizacao_demandas', e.target.value), [set]);

  const handleMotivacao    = useCallback((e) => set('motivacao_vaga', e.target.value), [set]);
  const handleObjetivo     = useCallback((e) => set('objetivo_profissional', e.target.value), [set]);
  const handlePrazoDisp    = useCallback((e) => set('prazo_disponibilidade', e.target.value), [set]);
  const handleDispHorario  = useCallback((e) => set('disponibilidade_horario', e.target.value), [set]);
  const handleRessalva     = useCallback((e) => set('ressalva_horario', e.target.value), [set]);
  const handleDispBairro   = useCallback((e) => set('disponibilidade_bairro', e.target.value), [set]);
  const handleRestricao    = useCallback((e) => set('restricao_bairro', e.target.value), [set]);
  const handlePretensao    = useCallback((e) => set('pretensao_salarial', e.target.value), [set]);
  const handleOutroProc    = useCallback((e) => set('outro_processo', e.target.value), [set]);
  const handleInfoAdic     = useCallback((e) => set('informacoes_adicionais', e.target.value), [set]);

  const validarEtapa = () => {
    const e = {};
    if (etapa === 1) {
      if (campoVazio(dados.nome)) e.nome = 'Campo obrigatorio';
      if (campoVazio(dados.cpf) || dados.cpf.replace(/\D/g,'').length < 11) e.cpf = 'CPF invalido';
      if (campoVazio(dados.email)) e.email = 'Campo obrigatorio';
      if (campoVazio(dados.telefone)) e.telefone = 'Campo obrigatorio';
      if (campoVazio(dados.idade)) e.idade = 'Campo obrigatorio';
      if (campoVazio(dados.estado_civil)) e.estado_civil = 'Campo obrigatorio';
      if (campoVazio(dados.filhos)) e.filhos = 'Campo obrigatorio';
      if (campoVazio(dados.cidade)) e.cidade = 'Campo obrigatorio';
      if (campoVazio(dados.bairro)) e.bairro = 'Campo obrigatorio';
      if (campoVazio(dados.mora_com)) e.mora_com = 'Campo obrigatorio';
    }
    if (etapa === 2) {
      if (campoVazio(dados.formacao_contabil)) e.formacao_contabil = 'Campo obrigatorio';
      if (campoVazio(dados.tempo_experiencia)) e.tempo_experiencia = 'Campo obrigatorio';
      if (campoVazio(dados.tipo_empresa)) e.tipo_empresa = 'Campo obrigatorio';
      if (campoVazio(dados.empresas_cargos_periodos)) e.empresas_cargos_periodos = 'Campo obrigatorio';
      if (campoVazio(dados.situacao_atual)) e.situacao_atual = 'Campo obrigatorio';
    }
    if (etapa === 3) {
      if (campoVazio(dados.lancamentos_contabeis)) e.lancamentos_contabeis = 'Campo obrigatorio';
      if (campoVazio(dados.sistema_contabil)) e.sistema_contabil = 'Campo obrigatorio';
      if (campoVazio(dados.conciliacao_bancaria)) e.conciliacao_bancaria = 'Campo obrigatorio';
      if (campoVazio(dados.fechamento_contabil)) e.fechamento_contabil = 'Campo obrigatorio';
      if (campoVazio(dados.balancetes_demonstracoes)) e.balancetes_demonstracoes = 'Campo obrigatorio';
    }
    if (etapa === 4) {
      if (campoVazio(dados.nivel_excel)) e.nivel_excel = 'Campo obrigatorio';
      if (campoVazio(dados.controle_prazos)) e.controle_prazos = 'Campo obrigatorio';
      if (campoVazio(dados.organizacao_demandas)) e.organizacao_demandas = 'Campo obrigatorio';
    }
    if (etapa === 5) {
      if (campoVazio(dados.motivacao_vaga)) e.motivacao_vaga = 'Campo obrigatorio';
      if (campoVazio(dados.objetivo_profissional)) e.objetivo_profissional = 'Campo obrigatorio';
      if (campoVazio(dados.disponibilidade_horario)) e.disponibilidade_horario = 'Campo obrigatorio';
      if (campoVazio(dados.disponibilidade_bairro)) e.disponibilidade_bairro = 'Campo obrigatorio';
      if (campoVazio(dados.pretensao_salarial)) e.pretensao_salarial = 'Campo obrigatorio';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const avancar = () => {
    if (!validarEtapa()) { window.scrollTo(0, 0); return; }
    setEtapa(e => e + 1);
    window.scrollTo(0, 0);
  };

  const voltar = () => { setEtapa(e => e - 1); window.scrollTo(0, 0); };

  const enviar = async () => {
    if (!validarEtapa()) { window.scrollTo(0, 0); return; }
    setEnviando(true);
    setErroEnvio('');
    const { error } = await supabase.from('candidatos_contabil').insert([{ ...dados, lgpd_aceite: true }]);
    setEnviando(false);
    if (error) { setErroEnvio('Ocorreu um erro ao enviar. Por favor, tente novamente.'); return; }
    setTela('sucesso');
    window.scrollTo(0, 0);
  };

  // Impede que Enter dentro de qualquer campo dispare os botoes de navegacao
  const bloquearEnter = (e) => { if (e.key === 'Enter') e.preventDefault(); };

  return (
    <>
      <style>{estilos}</style>
      <div className="wrap">

        <div className="header">
          <div className="logo-texto">ge<span className="logo-n">n</span>the</div>
          <div className="tagline">gente que entende de gente</div>
          {tela === 'form' && <div className="subtitulo-vaga">Analista Contabil · Campo Grande/MS</div>}
        </div>

        {/* TELA DA VAGA */}
        {tela === 'vaga' && (
          <div className="card-vaga">
            <div className="titulo-vaga">Analista Contabil</div>
            <div className="sub-vaga">Contabilidade · Campo Grande/MS</div>
            <div className="grid-info">
              <div className="info-card"><div className="info-icon">📄</div><div className="info-label">Contratacao</div><div className="info-valor">CLT</div></div>
              <div className="info-card"><div className="info-icon">💰</div><div className="info-label">Salario</div><div className="info-valor">R$ 5.000,00</div></div>
              <div className="info-card"><div className="info-icon">🕗</div><div className="info-label">Horario</div><div className="info-valor">Seg a Sex · 07h30 as 18h00</div></div>
              <div className="info-card"><div className="info-icon">📍</div><div className="info-label">Local</div><div className="info-valor">Tiradentes · Campo Grande/MS</div></div>
            </div>
            <div className="secao-titulo">🎁 Beneficios</div>
            <ul className="lista-beneficios">
              <li><span className="check">✓</span> Vale Alimentacao R$ 500,00/mes</li>
            </ul>
            <div className="secao-titulo">📚 Requisitos</div>
            <ul className="lista-requisitos">
              <li><span className="check">✓</span> Cursando ou com curso concluido em Ciencias Contabeis (obrigatorio)</li>
              <li><span className="check">✓</span> Experiencia minima de 6 meses em rotinas contabeis</li>
              <li><span className="check">✓</span> Conhecimento em lancamentos contabeis e conciliacao bancaria</li>
              <li><span className="check">✓</span> Boa organizacao e atencao a prazos</li>
              <li><span className="check">✓</span> Desejavel: experiencia em escritorio de contabilidade</li>
            </ul>
            <button className="btn-candidatar" onClick={() => { setTela('lgpd'); window.scrollTo(0, 0); }}>
              Candidate-se agora →
            </button>
          </div>
        )}

        {/* TELA LGPD */}
        {tela === 'lgpd' && (
          <div className="card-lgpd">
            <div className="lgpd-icon">🔒</div>
            <div className="lgpd-titulo">Protecao de Dados — LGPD</div>
            <div className="lgpd-texto">
              As informacoes fornecidas neste questionario serao utilizadas exclusivamente para fins de selecao e recrutamento pela <strong>Genthe Consultoria</strong>, em conformidade com a <strong>Lei Geral de Protecao de Dados Pessoais (Lei n° 13.709/2018 — LGPD)</strong>.<br /><br />
              Seus dados serao tratados com seguranca, sigilo e responsabilidade. Nao serao compartilhados com terceiros sem sua autorizacao previa e expressa, exceto com a empresa contratante vinculada a este processo seletivo, para fins exclusivos de avaliacao de candidatura.<br /><br />
              Voce podera solicitar a correcao, atualizacao ou exclusao dos seus dados a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>.
            </div>
            <label className="lgpd-check">
              <input type="checkbox" checked={lgpdAceite} onChange={e => { setLgpdAceite(e.target.checked); setLgpdErro(false); }} />
              <span>Li e concordo com o tratamento dos meus dados pessoais para participacao neste processo seletivo, conforme a LGPD.</span>
            </label>
            {lgpdErro && <div className="erro-lgpd">E necessario concordar com os termos para continuar.</div>}
            <button className="btn-iniciar" onClick={() => {
              if (!lgpdAceite) { setLgpdErro(true); return; }
              setTela('form'); window.scrollTo(0, 0);
            }}>Iniciar questionario →</button>
          </div>
        )}

        {/* FORMULARIO */}
        {tela === 'form' && (
          <>
            <div className="progresso-wrap">
              <div className="progresso-bar-bg">
                <div className="progresso-bar" style={{ width: `${(etapa / TOTAL_ETAPAS) * 100}%` }} />
              </div>
              <div className="progresso-texto">Etapa {etapa} de {TOTAL_ETAPAS}</div>
            </div>

            {/* onKeyDown no card-etapa: bloqueia Enter nos inputs de linha unica */}
            <div className="card-etapa" onKeyDown={bloquearEnter}>

              {/* ETAPA 1 */}
              {etapa === 1 && (
                <>
                  <div className="etapa-titulo">Dados Pessoais</div>
                  <div className="etapa-sub">Vamos comecar com suas informacoes basicas.</div>
                  <CampoInput id="nome" label="Nome completo" obrig erro={erros.nome} value={dados.nome} onChange={handleNome} />
                  <CampoInput id="cpf" label="CPF" obrig erro={erros.cpf} value={dados.cpf} onChange={handleCPF} placeholder="000.000.000-00" />
                  <CampoInput id="email" label="E-mail" obrig erro={erros.email} value={dados.email} onChange={handleEmail} type="email" />
                  <CampoInput id="telefone" label="Telefone / WhatsApp" obrig erro={erros.telefone} value={dados.telefone} onChange={handleTel} />
                  <CampoInput id="idade" label="Idade" obrig erro={erros.idade} value={dados.idade} onChange={handleIdade} />
                  <CampoSelect id="estado_civil" label="Estado civil" obrig erro={erros.estado_civil} value={dados.estado_civil} onChange={handleEstCiv}
                    opcoes={['Solteiro(a)','Casado(a)','Uniao estavel','Divorciado(a)','Viuvo(a)']} />
                  <CampoSelect id="filhos" label="Possui filhos?" obrig erro={erros.filhos} value={dados.filhos} onChange={handleFilhos}
                    opcoes={['Nao','Sim, 1 filho','Sim, 2 filhos','Sim, 3 ou mais filhos']} />
                  <CampoInput id="cidade" label="Cidade" obrig erro={erros.cidade} value={dados.cidade} onChange={handleCidade} />
                  <CampoInput id="bairro" label="Bairro" obrig erro={erros.bairro} value={dados.bairro} onChange={handleBairro} />
                  <CampoTextarea id="mora_com" label="Com quem mora atualmente?" obrig erro={erros.mora_com} value={dados.mora_com} onChange={handleMoraCom}
                    placeholder="Ex: sozinho(a), com conjuge, com familia, com filhos..." />
                </>
              )}

              {/* ETAPA 2 */}
              {etapa === 2 && (
                <>
                  <div className="etapa-titulo">Formacao e Experiencia</div>
                  <div className="etapa-sub">Conte-nos sobre sua trajetoria academica e profissional.</div>
                  <CampoSelect id="formacao_contabil" label="Voce esta cursando ou ja concluiu o curso de Ciencias Contabeis?" obrig erro={erros.formacao_contabil}
                    value={dados.formacao_contabil} onChange={handleFormacao}
                    opcoes={['Cursando atualmente','Curso concluido','Curso tecnico em contabilidade (cursando ou concluido)','Nao possuo formacao na area contabil']} />
                  <CampoInput id="semestre_periodo" label="Se estiver cursando, em qual semestre ou periodo se encontra atualmente?"
                    erro={erros.semestre_periodo} value={dados.semestre_periodo} onChange={handleSemestre} placeholder="Ex: 4° semestre" />
                  <CampoInput id="instituicao_turno" label="Nome da instituicao de ensino e turno"
                    erro={erros.instituicao_turno} value={dados.instituicao_turno} onChange={handleInstituicao} placeholder="Ex: UFMS — Noturno" />
                  <CampoSelect id="tempo_experiencia" label="Ha quanto tempo voce atua com rotinas contabeis de forma continua?" obrig erro={erros.tempo_experiencia}
                    value={dados.tempo_experiencia} onChange={handleTempo}
                    opcoes={['Menos de 6 meses','Entre 6 meses e 1 ano','Entre 1 e 3 anos','Acima de 3 anos','Nao possuo experiencia na area']} />
                  <CampoSelect id="tipo_empresa" label="Em qual tipo de empresa voce atuou ou atua?" obrig erro={erros.tipo_empresa}
                    value={dados.tipo_empresa} onChange={handleTipoEmp}
                    opcoes={['Escritorio de contabilidade','Setor contabil interno de empresa','Ambos','Nunca atuei na area']} />
                  <CampoTextarea id="empresas_cargos_periodos" label="Cite o nome das empresas onde atuou na area contabil, o cargo ocupado e o periodo de cada experiencia" obrig
                    erro={erros.empresas_cargos_periodos} value={dados.empresas_cargos_periodos} onChange={handleEmpresas}
                    placeholder="Ex: Escritorio ABC Contabilidade — Auxiliar Contabil — Jan/2023 a Dez/2024" />
                  <CampoSelect id="situacao_atual" label="Qual e sua situacao profissional atual?" obrig erro={erros.situacao_atual}
                    value={dados.situacao_atual} onChange={handleSituacao}
                    opcoes={['Empregado(a) CLT','Autonomo(a) / Freelancer','Desempregado(a)']} />
                </>
              )}

              {/* ETAPA 3 */}
              {etapa === 3 && (
                <>
                  <div className="etapa-titulo">Atividades Contabeis</div>
                  <div className="etapa-sub">Queremos entender sua experiencia pratica nas rotinas da area.</div>
                  <CampoTextarea id="lancamentos_contabeis" label="Voce realiza ou ja realizou lancamentos contabeis de forma independente, sem supervisao direta para cada lancamento? Descreva como era esse processo e qual o volume aproximado de lancamentos por mes" obrig
                    erro={erros.lancamentos_contabeis} value={dados.lancamentos_contabeis} onChange={handleLancamentos}
                    placeholder="Descreva o processo e o volume medio..." />
                  <CampoTextarea id="sistema_contabil" label="Qual sistema contabil voce utiliza ou ja utilizou? Descreva o que executava dentro do sistema (modulos, tipos de lancamento, rotinas de fechamento)" obrig
                    erro={erros.sistema_contabil} value={dados.sistema_contabil} onChange={handleSistema}
                    placeholder="Ex: Dominio — lancamentos de entrada e saida, fechamento mensal do Simples Nacional..." />
                  <CampoTextarea id="conciliacao_bancaria" label="Como voce executa uma conciliacao bancaria? Descreva o passo a passo que voce segue na pratica" obrig
                    erro={erros.conciliacao_bancaria} value={dados.conciliacao_bancaria} onChange={handleConciliacao}
                    placeholder="Descreva seu processo passo a passo..." />
                  <CampoTextarea id="fechamento_contabil" label="Voce ja participou do fechamento contabil mensal? Descreva qual era a sua responsabilidade nesse processo" obrig
                    erro={erros.fechamento_contabil} value={dados.fechamento_contabil} onChange={handleFechamento}
                    placeholder="Descreva sua participacao e responsabilidades..." />
                  <CampoTextarea id="balancetes_demonstracoes" label="Voce ja elaborou ou apoiou a apuracao de balancetes ou demonstracoes contabeis? Descreva sua participacao" obrig
                    erro={erros.balancetes_demonstracoes} value={dados.balancetes_demonstracoes} onChange={handleBalancetes}
                    placeholder="Descreva como era sua atuacao nessa atividade..." />
                  <CampoTextarea id="classificacao_documentos" label="Voce ja trabalhou com classificacao de documentos contabeis por plano de contas? Se sim, descreva como organizava esse processo"
                    erro={erros.classificacao_documentos} value={dados.classificacao_documentos} onChange={handleClassif}
                    placeholder="Descreva como voce classificava os documentos..." />
                  <CampoTextarea id="regimes_tributarios" label="Voce ja atuou com algum regime tributario (Simples Nacional, Lucro Presumido, Lucro Real)? Descreva sua experiencia pratica"
                    erro={erros.regimes_tributarios} value={dados.regimes_tributarios} onChange={handleRegimes}
                    placeholder="Cite os regimes com que trabalhou e o que realizava em cada um..." />
                </>
              )}

              {/* ETAPA 4 */}
              {etapa === 4 && (
                <>
                  <div className="etapa-titulo">Ferramentas e Organizacao</div>
                  <div className="etapa-sub">Avalie seus conhecimentos tecnicos e forma de trabalho.</div>
                  <CampoSelect id="nivel_excel" label="Como voce avalia seu conhecimento em Excel?" obrig erro={erros.nivel_excel}
                    value={dados.nivel_excel} onChange={handleExcel}
                    opcoes={['Basico (formulas simples, formatacao)','Intermediario (PROCV, tabela dinamica, filtros)','Avancado (macros, dashboards, funcoes complexas)']} />
                  <CampoTextarea id="controle_prazos" label="Voce mantem controle de prazos contabeis e obrigacoes acessorias por conta propria? Descreva como faz isso" obrig
                    erro={erros.controle_prazos} value={dados.controle_prazos} onChange={handlePrazos}
                    placeholder="Ex: uso calendario fiscal, planilha de controle, sistema de alertas..." />
                  <CampoTextarea id="organizacao_demandas" label="Como voce organiza suas tarefas quando ha multiplas demandas com prazos simultaneos?" obrig
                    erro={erros.organizacao_demandas} value={dados.organizacao_demandas} onChange={handleOrganizacao}
                    placeholder="Descreva seu metodo de organizacao e priorizacao..." />
                </>
              )}

              {/* ETAPA 5 */}
              {etapa === 5 && (
                <>
                  <div className="etapa-titulo">Motivacao e Disponibilidade</div>
                  <div className="etapa-sub">Ultimas informacoes antes de concluir.</div>
                  <CampoTextarea id="motivacao_vaga" label="Por que voce tem interesse nesta vaga e neste segmento (escritorio de contabilidade)?" obrig
                    erro={erros.motivacao_vaga} value={dados.motivacao_vaga} onChange={handleMotivacao}
                    placeholder="Conte o que te motivou a se candidatar..." />
                  <CampoTextarea id="objetivo_profissional" label="Qual e o seu objetivo profissional nos proximos dois anos?" obrig
                    erro={erros.objetivo_profissional} value={dados.objetivo_profissional} onChange={handleObjetivo}
                    placeholder="Descreva seus planos e metas..." />
                  <CampoInput id="prazo_disponibilidade" label="Caso esteja empregado(a), qual e o prazo de aviso previo ou disponibilidade para inicio?"
                    erro={erros.prazo_disponibilidade} value={dados.prazo_disponibilidade} onChange={handlePrazoDisp}
                    placeholder="Ex: imediata, 15 dias, 30 dias..." />
                  <CampoSelect id="disponibilidade_horario" label="O horario de trabalho e de segunda a sexta, das 07h30 as 18h00. Voce tem disponibilidade?" obrig
                    erro={erros.disponibilidade_horario} value={dados.disponibilidade_horario} onChange={handleDispHorario}
                    opcoes={['Sim, total disponibilidade','Sim, com ressalvas','Nao tenho disponibilidade']} />
                  {dados.disponibilidade_horario === 'Sim, com ressalvas' && (
                    <CampoInput id="ressalva_horario" label="Descreva a ressalva de horario"
                      erro={erros.ressalva_horario} value={dados.ressalva_horario} onChange={handleRessalva}
                      placeholder="Explique a restricao..." />
                  )}
                  <CampoSelect id="disponibilidade_bairro" label="A empresa fica no bairro Tiradentes, em Campo Grande/MS. Voce tem disponibilidade para trabalhar nesse bairro?" obrig
                    erro={erros.disponibilidade_bairro} value={dados.disponibilidade_bairro} onChange={handleDispBairro}
                    opcoes={['Sim, sem restricoes','Tenho alguma restricao']} />
                  {dados.disponibilidade_bairro === 'Tenho alguma restricao' && (
                    <CampoInput id="restricao_bairro" label="Descreva a restricao de localizacao"
                      erro={erros.restricao_bairro} value={dados.restricao_bairro} onChange={handleRestricao}
                      placeholder="Explique a restricao..." />
                  )}
                  <CampoInput id="pretensao_salarial" label="Qual e a sua pretensao salarial para esta vaga?" obrig
                    erro={erros.pretensao_salarial} value={dados.pretensao_salarial} onChange={handlePretensao}
                    placeholder="R$ " />
                  <CampoSelect id="outro_processo" label="Participa de outro processo seletivo no momento?"
                    erro={erros.outro_processo} value={dados.outro_processo} onChange={handleOutroProc}
                    opcoes={['Nao','Sim']} />
                  <CampoTextarea id="informacoes_adicionais" label="Informacoes adicionais que gostaria de compartilhar"
                    erro={erros.informacoes_adicionais} value={dados.informacoes_adicionais} onChange={handleInfoAdic}
                    placeholder="Opcional..." />
                  {erroEnvio && <div className="msg-erro" style={{ marginBottom: '12px' }}>{erroEnvio}</div>}
                </>
              )}

              <div className="nav-btns">
                {etapa > 1 && (
                  <button className="btn-voltar" type="button" onClick={voltar}>← Voltar</button>
                )}
                {etapa < TOTAL_ETAPAS && (
                  <button className="btn-continuar" type="button" onClick={avancar}>Continuar →</button>
                )}
                {etapa === TOTAL_ETAPAS && (
                  <button className="btn-enviar" type="button" onClick={enviar} disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar questionario ✓'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* SUCESSO */}
        {tela === 'sucesso' && (
          <div className="card-sucesso">
            <div className="sucesso-icon">✅</div>
            <div className="sucesso-titulo">Questionario enviado!</div>
            <div className="sucesso-texto">
              Obrigado pela participacao. Nossa equipe analisara suas respostas e, se houver compatibilidade com a vaga de <strong>Analista Contabil</strong>, entraremos em contato em breve.<br /><br />
              <strong>Genthe — que entende de gente.</strong>
            </div>
          </div>
        )}

        <div className="footer">genthe.com.br · contato@genthe.com.br</div>
      </div>
    </>
  );
}
