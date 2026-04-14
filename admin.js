/**
 * ARQUIVO: admin.js
 * OBJETIVO: Gerenciar o CRUD de Alunos consumindo a API da Academia
 */

// ==========================================
// CONFIGURAÇÕES GERAIS DA API
// ==========================================
const API_BASE_URL = 'https://api-academia-xi.vercel.app/';

// ==========================================
// REFERÊNCIAS DO DOM
// ==========================================
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const btnLogout = document.getElementById('btnLogout');
const loginError = document.getElementById('loginError');

// Referências do Formulário de Alunos
const alunoForm = document.getElementById('alunoForm'); // Ajuste o ID no HTML se necessário
const tabelaAlunos = document.getElementById('tabelaAlunos');
const totalAlunosEl = document.getElementById('totalAlunos');
const btnCancelar = document.getElementById('btnCancelar');
const formTitle = document.getElementById('formTitle');
const userInfo = document.getElementById('userInfo');

// ==========================================
// ESTADO DA APLICAÇÃO
// ==========================================
let tokenAtual = localStorage.getItem('adminToken') || null;
let listaAlunos = [];

function iniciarApp() {
    if (tokenAtual) {
        mostrarPainelAdmin();
        carregarAlunos();
    } else {
        mostrarLogin();
    }
}

// Mascara de CPF para o campo de entrada
function mascaraCPF(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = value;
}

// Função auxiliar para formatar CPF string
function formatarCPF(cpf) {
    let value = cpf.replace(/\D/g, "");
    if (value.length !== 11) return cpf; // Retorna original se não tiver 11 dígitos
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
}

// Função para formatar data e hora
function formatarData(data) {
    if (!data) return 'Nunca acessou';
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

// ==========================================
// 1. AUTENTICAÇÃO
// ==========================================

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
   
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('password').value;

    try {
        const resposta = await fetch(`${API_BASE_URL}login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            tokenAtual = dados.token;
            localStorage.setItem('adminToken', tokenAtual);
            
            loginForm.reset();
            mostrarPainelAdmin();
            carregarAlunos();
        } else {
            loginError.classList.remove('hidden');
        }
    } catch (erro) {
        console.error("Erro no login:", erro);
        alert("Erro ao conectar com o servidor.");
    }
});

btnLogout.addEventListener('click', () => {
    tokenAtual = null;
    localStorage.removeItem('adminToken');
    mostrarLogin();
});

// ==========================================
// 2. CRUD: READ (Listar Alunos)
// ==========================================

async function carregarAlunos() {
    try {
        const resposta = await fetch(`${API_BASE_URL}alunos`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${tokenAtual}` }
        });

        console.log("Status da resposta ao carregar alunos:", resposta.status);

        if (resposta.status === 401 || resposta.status === 403) {
            console.warn("Sessão expirada (401/403)");
            alert("Sessão expirada. Faça login novamente.");
            btnLogout.click();
            return;
        }

        if (resposta.ok) {
            listaAlunos = await resposta.json();
            renderizarTabela();
        } else {
            console.error("Erro ao carregar alunos. Status:", resposta.status);
        }
    } catch (erro) {
        console.error("Erro ao carregar alunos:", erro);
    }
}

function renderizarTabela() {
    tabelaAlunos.innerHTML = '';
    totalAlunosEl.textContent = listaAlunos.length;

    listaAlunos.forEach(aluno => {
        const tr = document.createElement('tr');
        // Define a cor baseada no status
        const statusClass = aluno.status === 'ATIVO' ? 'text-green-600' : 'text-red-600';
        // Formata o CPF para exibição
        const cpfFormatado = formatarCPF(aluno.cpf);
        
        tr.innerHTML = `
            <td class="px-6 py-4 text-sm text-gray-800">${aluno.id}</td>
            <td class="px-6 py-4 text-sm text-gray-800 font-bold">${aluno.nome}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${cpfFormatado}</td>
            <td class="px-6 py-4 text-sm ${statusClass} font-medium">${aluno.status}</td>
            <td class="px-6 py-4 text-right text-sm font-medium">
                <button onclick="prepararEdicao(${aluno.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                <button onclick="deletarAluno(${aluno.id})" class="text-red-600 hover:text-red-900">Excluir</button>
            </td>
        `;
        tabelaAlunos.appendChild(tr);
    });
}

// ==========================================
// 3. CRUD: CREATE e UPDATE
// ==========================================

alunoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('alunoId').value; // Campo hidden para o ID
    const nome = document.getElementById('nome').value;
    const cpfComMascara = document.getElementById('cpf').value;
    const cpf = cpfComMascara.replace(/\D/g, ""); // Remove a formatação: 123.456.789-00 => 12345678900
    const status = document.getElementById('status').value;

    const alunoData = { nome, cpf, status };

    try {
        let url = `${API_BASE_URL}alunos`;
        let metodoHTTP = 'POST';

        if (id) {
            url = `${API_BASE_URL}alunos/${id}`;
            metodoHTTP = 'PUT';
        }

        const respostaApi = await fetch(url, {
            method: metodoHTTP,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAtual}`
            },
            body: JSON.stringify(alunoData)
        });

        if (respostaApi.ok) {
            alert(id ? "Aluno atualizado!" : "Aluno cadastrado com sucesso!");
            limparFormulario();
            carregarAlunos();
        } else {
            console.error("Erro da API:", respostaApi.status, respostaApi.statusText);
            const erroRes = await respostaApi.json();
            alert("Erro: " + (erroRes.error || "Falha ao salvar."));
        }
    } catch (erro) {
        console.error("Erro ao salvar aluno:", erro);
        alert("Erro ao salvar: " + erro.message);
    }
});

function prepararEdicao(id) {
    const aluno = listaAlunos.find(a => Number(a.id) === Number(id));
    
    if (aluno) {
        document.getElementById('alunoId').value = aluno.id;
        document.getElementById('nome').value = aluno.nome;
        document.getElementById('cpf').value = formatarCPF(aluno.cpf); // Formata e carrega o CPF
        document.getElementById('status').value = aluno.status;

        formTitle.textContent = "Editar Cliente";
        btnCancelar.classList.remove('hidden');
    }
}

function limparFormulario() {
    alunoForm.reset();
    document.getElementById('alunoId').value = '';
    formTitle.textContent = "Novo Aluno";
    btnCancelar.classList.add('hidden');
}

btnCancelar.addEventListener('click', limparFormulario);

// ==========================================
// 4. CRUD: DELETE
// ==========================================

async function deletarAluno(id) {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

    try {
        const resposta = await fetch(`${API_BASE_URL}alunos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokenAtual}` }
        });

        if (resposta.ok) {
            alert("Aluno removido!");
            carregarAlunos();
        } else {
            alert("Não foi possível excluir o aluno.");
        }
    } catch (erro) {
        console.error("Erro ao deletar:", erro);
    }
}

// Helper para trocar telas
function mostrarPainelAdmin() {
    loginSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
    userInfo.classList.remove('hidden');
}

function mostrarLogin() {
    loginSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
    userInfo.classList.add('hidden');
}

// Inicia o fluxo
iniciarApp();