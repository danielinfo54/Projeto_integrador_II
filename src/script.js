import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ---------- Estado (agora carregado do Firestore, não mais fictício) ----------
let ocorrencias = [];

const statusLabel = {
  recebida: 'Recebida', analise: 'Em análise', providencia: 'Em providência',
  resolvida: 'Resolvida', arquivada: 'Arquivada'
};

// ---------- Controle de acesso da área administrativa (demonstração) ----------
let adminLogado = false;
const SENHA_ADMIN_DEMO = 'admin123';

async function tentarLoginAdmin(){
  const senha = document.getElementById('senhaAdmin').value;
  if(senha === SENHA_ADMIN_DEMO){
    adminLogado = true;
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminConteudo').style.display = 'block';
    document.getElementById('erroLoginAdmin').style.display = 'none';
    await carregarOcorrencias();
    renderTabela();
  } else {
    document.getElementById('erroLoginAdmin').style.display = 'block';
  }
}

// ---------- Navegação entre abas ----------
document.querySelectorAll('nav.tabs button').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    document.getElementById('view-'+btn.dataset.view).classList.add('active');
    if(btn.dataset.view==='admin'){
      if(adminLogado){
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminConteudo').style.display = 'block';
        await carregarOcorrencias();
        renderTabela();
      } else {
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminConteudo').style.display = 'none';
      }
    }
  });
});

// ---------- Formulário: identificado / anônimo ----------
document.querySelectorAll('#tipoRelato button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('#tipoRelato button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('camposIdentificacao').style.display =
      btn.dataset.tipo==='identificado' ? 'block' : 'none';
  });
});

// ---------- Carregar todas as ocorrências do Firestore ----------
async function carregarOcorrencias(){
  try {
    const snapshot = await getDocs(collection(db, "ocorrencias"));
    ocorrencias = [];
    snapshot.forEach(docSnap => {
      ocorrencias.push({ id: docSnap.id, ...docSnap.data() });
    });
  } catch (erro) {
    console.error('Erro ao carregar ocorrências:', erro);
  }
}

// ---------- Registrar nova ocorrência ----------
async function registrarOcorrencia(){
  const categoria = document.getElementById('categoria').value;
  const local = document.getElementById('local').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const anonimo = document.querySelector('#tipoRelato button.active').dataset.tipo === 'anonimo';

  if(!local || !descricao){
    alert('Preencha a localização e a descrição antes de enviar.');
    return;
  }

  const agora = new Date().toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});

  const novaOcorrencia = {
    categoria, local, descricao, anonimo,
    nome: anonimo ? null : document.getElementById('nome').value.trim(),
    perfil: anonimo ? null : document.getElementById('perfil').value,
    status: 'recebida',
    historico: [{status:'Recebida', data: agora}],
    providencias: []
  };

  try {
    // addDoc() cria um novo documento na coleção "ocorrencias" e devolve a referência dele
    const docRef = await addDoc(collection(db, "ocorrencias"), novaOcorrencia);

    // usamos parte do ID gerado pelo Firestore para montar um protocolo legível
    const protocolo = 'OCR-2026-' + docRef.id.slice(-6).toUpperCase();

    // updateDoc() grava esse protocolo dentro do mesmo documento que acabamos de criar
    await updateDoc(docRef, { protocolo });

    // guarda localmente também, para não precisar buscar tudo de novo no Firestore
    ocorrencias.push({ id: docRef.id, protocolo, ...novaOcorrencia });

    document.getElementById('numProtocoloGerado').textContent = protocolo;
    document.getElementById('resultadoProtocolo').style.display = 'block';

    document.getElementById('local').value = '';
    document.getElementById('descricao').value = '';
  } catch (erro) {
    console.error('Erro ao registrar ocorrência:', erro);
    alert('Não foi possível registrar a ocorrência. Tente novamente em instantes.');
  }
}

// ---------- Acompanhar ocorrência ----------
async function buscarOcorrencia(){
  const termo = document.getElementById('buscaProtocolo').value.trim().toUpperCase();
  const box = document.getElementById('resultadoBusca');

  // garante que temos os dados mais recentes antes de procurar
  await carregarOcorrencias();

  const oc = ocorrencias.find(o=>o.protocolo === termo);

  if(!oc){
    box.innerHTML = '<p class="empty">Nenhuma ocorrência encontrada com esse número de protocolo.</p>';
    return;
  }

  box.innerHTML = `
    <div class="detail-grid">
      <div><span class="k">Protocolo</span><span class="v mono">${oc.protocolo}</span></div>
      <div><span class="k">Status atual</span><span class="v"><span class="tag ${oc.status}">${statusLabel[oc.status]}</span></span></div>
      <div><span class="k">Categoria</span><span class="v">${oc.categoria}</span></div>
      <div><span class="k">Localização</span><span class="v">${oc.local}</span></div>
    </div>
    <h3 style="font-size:14.5px;margin-bottom:6px;">Linha do tempo</h3>
    <ul class="timeline">
      ${oc.historico.map(h=>`<li><div class="t-date">${h.data}</div>${h.status}</li>`).join('')}
    </ul>
    ${oc.resolucao ? `<p class="helper" style="margin-top:14px;"><strong>Resolução registrada:</strong> ${oc.resolucao}</p>` : ''}
  `;
}

// ---------- Área administrativa: tabela ----------
function renderTabela(){
  const tbody = document.getElementById('tabelaOcorrencias');
  tbody.innerHTML = ocorrencias.map(o=>`
    <tr class="row" onclick="abrirDetalhe('${o.id}')">
      <td class="mono">${o.protocolo}</td>
      <td>${o.categoria}</td>
      <td>${o.local}</td>
      <td>${o.anonimo ? 'Anônimo' : (o.nome || 'Identificado')}</td>
      <td><span class="tag ${o.status}">${statusLabel[o.status]}</span></td>
    </tr>
  `).join('');
  document.getElementById('painelDetalhe').style.display = 'none';
}

// ---------- Área administrativa: detalhe ----------
function abrirDetalhe(id){
  const oc = ocorrencias.find(o=>o.id===id);
  const painel = document.getElementById('painelDetalhe');
  painel.style.display = 'block';

  painel.innerHTML = `
    <h2 style="font-size:17px;">Ocorrência ${oc.protocolo}</h2>
    <div class="detail-grid">
      <div><span class="k">Categoria</span><span class="v">${oc.categoria}</span></div>
      <div><span class="k">Localização</span><span class="v">${oc.local}</span></div>
      <div><span class="k">Relato</span><span class="v">${oc.anonimo ? 'Anônimo' : (oc.nome+' — '+oc.perfil)}</span></div>
      <div><span class="k">Status atual</span><span class="v"><span class="tag ${oc.status}">${statusLabel[oc.status]}</span></span></div>
    </div>
    <p><span class="k" style="font-size:11.5px;color:var(--ink-soft);display:block;margin-bottom:4px;">Descrição</span>${oc.descricao}</p>

    <label>Atualizar status</label>
    <select id="novoStatus">
      <option value="recebida" ${oc.status==='recebida'?'selected':''}>Recebida</option>
      <option value="analise" ${oc.status==='analise'?'selected':''}>Em análise</option>
      <option value="providencia" ${oc.status==='providencia'?'selected':''}>Em providência</option>
      <option value="resolvida" ${oc.status==='resolvida'?'selected':''}>Resolvida</option>
      <option value="arquivada" ${oc.status==='arquivada'?'selected':''}>Arquivada</option>
    </select>

    <label>Registrar providência / observação</label>
    <textarea id="novaProvidencia" placeholder="Ex: Chamado técnico aberto, equipe de manutenção acionada..."></textarea>

    <button class="btn-primary" onclick="salvarAtualizacao('${oc.id}')">Salvar atualização</button>
    <button class="btn-ghost" style="margin-top:24px;margin-left:8px;" onclick="renderTabela()">Fechar</button>

    ${oc.providencias.length ? `
      <h3 style="font-size:14.5px;margin-top:24px;">Providências registradas</h3>
      <ul class="timeline">${oc.providencias.map(p=>`<li>${p}</li>`).join('')}</ul>
    ` : ''}
  `;
}

async function salvarAtualizacao(id){
  const oc = ocorrencias.find(o=>o.id===id);
  const novoStatus = document.getElementById('novoStatus').value;
  const providencia = document.getElementById('novaProvidencia').value.trim();
  const agora = new Date().toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});

  const novoHistorico = [...oc.historico];
  const novasProvidencias = [...oc.providencias];
  let novaResolucao = oc.resolucao || null;

  if(providencia){
    novasProvidencias.push(providencia);
  }
  if(novoStatus !== oc.status){
    novoHistorico.push({status: statusLabel[novoStatus], data: agora});
    if(novoStatus === 'resolvida' && providencia){
      novaResolucao = providencia;
    }
  }

  const dadosAtualizados = {
    status: novoStatus,
    historico: novoHistorico,
    providencias: novasProvidencias
  };
  if(novaResolucao) dadosAtualizados.resolucao = novaResolucao;

  try {
    // updateDoc() altera só os campos indicados, sem apagar o resto do documento
    await updateDoc(doc(db, "ocorrencias", id), dadosAtualizados);
    Object.assign(oc, dadosAtualizados);
    renderTabela();
  } catch (erro) {
    console.error('Erro ao salvar atualização:', erro);
    alert('Não foi possível salvar a atualização. Tente novamente.');
  }
}

// como o arquivo virou "module", as funções chamadas via onclick="" no HTML
// precisam ser expostas manualmente no objeto window
window.registrarOcorrencia = registrarOcorrencia;
window.buscarOcorrencia = buscarOcorrencia;
window.tentarLoginAdmin = tentarLoginAdmin;
window.abrirDetalhe = abrirDetalhe;
window.salvarAtualizacao = salvarAtualizacao;
window.renderTabela = renderTabela;

// carrega as ocorrências assim que a página abre
carregarOcorrencias();