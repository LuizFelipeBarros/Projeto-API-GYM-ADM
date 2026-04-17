# 💪 Painel Administrativo - Fit Deploy

Um painel administrativo moderno e responsivo para gerenciar clientes de uma academia, desenvolvido com HTML5, JavaScript vanilla e Tailwind CSS.

## 🎯 Funcionalidades

- ✅ **Autenticação**: Sistema de login seguro com tokens JWT
- ✅ **Gestão de Clientes**: CRUD completo (Criar, Ler, Atualizar, Deletar)
- ✅ **Validação de Dados**: Validação de CPF e campos obrigatórios
- ✅ **Status de Cliente**: Controle de status (Ativo/Inativo)
- ✅ **Interface Responsiva**: Design adaptável para todos os dispositivos
- ✅ **Mascara de CPF**: Formatação automática de CPF
- ✅ **Armazenamento Local**: Persistência de token no localStorage

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Ícones**: Font Awesome
- **API**: Rest API (consumida via Fetch API)
- **Autenticação**: Bearer Token (JWT)

## 📋 Pré-requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Acesso à API em: `https://api-academia-xi.vercel.app/`

## 🚀 Como Usar

### 1. Abra o arquivo no navegador
```bash
# Simplesmente abra o arquivo index.html em seu navegador
# Ou use um servidor local:
python -m http.server 8000
# Depois acesse: http://localhost:8000
```

### 2. Faça Login
- Insira suas credenciais (usuário e senha)
- O token será armazenado automaticamente

### 3. Gerencie Clientes
- **Listar**: Todos os clientes são carregados automaticamente
- **Criar**: Preencha o formulário e clique em "Salvar"
- **Editar**: Clique em "Editar" na tabela para modificar
- **Deletar**: Clique em "Excluir" para remover um cliente

## 📁 Estrutura do Projeto

```
Projeto API GYM ADM/
├── index.html          # Interface HTML do painel
├── admin.js            # Lógica JavaScript (CRUD e Autenticação)
└── README.md           # Este arquivo
```

## 🔐 Endpoints da API

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/login` | Autenticar usuário | ❌ |
| GET | `/alunos` | Listar todos os alunos | ✅ |
| POST | `/alunos` | Criar novo aluno | ✅ |
| PUT | `/alunos/:id` | Atualizar aluno | ✅ |
| DELETE | `/alunos/:id` | Deletar aluno | ✅ |

## 🎨 Cores e Temas

```css
/* Paleta de Cores Personalizada */
- Fundo Escuro: #0F172A
- Header: #020617
- Cards: #1D1D1D
- Texto Principal: #457B9D
- Destaque: #22C55E
- Botão: #00AEEF
- Hover: #3B82F6
```

## 📝 Validações Implementadas

- ✔️ Nome obrigatório
- ✔️ CPF com exatamente 11 dígitos (após remoção de máscara)
- ✔️ Verificação de sessão (401/403 faz logout automático)
- ✔️ Prevenção de múltiplos cliques simultâneos
- ✔️ Formatação de CPF em tempo real

## 🔄 Fluxo de Dados

```
Login → Token Armazenado → Carrega Alunos → CRUD de Alunos → Logout
```

## ⚙️ Configurações

Para alterar a URL base da API, edite em `admin.js`:

```javascript
const API_BASE_URL = 'https://api-academia-xi.vercel.app/';
```

## 🐛 Tratamento de Erros

- Erros de rede são capturados e exibem alertas
- Sessão expirada (401/403) faz logout automático
- Erros da API são retornados ao usuário
- Validação de dados antes da submissão

## 📱 Responsividade

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

## 👨‍💻 Desenvolvido por

Fit Deploy Academy Admin Panel

## 📄 Licença

Este projeto é de código aberto e segue as políticas da empresa.

---

**Última atualização**: Abril de 2026
