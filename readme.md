# 🚀 MyProject

## 🧱 Stack Tecnológica

### Frontend

- ⚡ **Vite** — build tool rápido e moderno
- ⚛️ **React** — biblioteca para interfaces
- 🦀 **SWC** — compilador ultra rápido (TypeScript + JSX)
- 🔷 **TypeScript** — tipagem estática

### Backend

- 🐱 **NestJS** — framework Node.js escalável
- 🔷 **TypeScript** — tipagem estática
- 🧬 **TypeORM** — ORM para mapeamento objeto-relacional
- 🔐 **JWT (Access + Refresh Token)**
- 🍪 **Cookies HTTP-only** para autenticação segura
- 🛂 **Passport + Guards**

### Banco de Dados

- 🐘 **PostgreSQL** — banco relacional
- 🐳 **Docker** — ambiente de desenvolvimento isolado

---

## 🔐 Autenticação & Segurança

Este projeto utiliza um **fluxo de autenticação seguro e moderno**

### 🔑 Fluxo de Login

1. Usuário envia `email` e `password`
2. Backend valida as credenciais
3. Gera:
   - **Access Token** (15 minutos)
   - **Refresh Token** (7 dias)
4. Tokens são enviados via **cookies HTTP-only**
5. Refresh token é **hasheado e salvo no banco**

### ♻️ Refresh Token

- Apenas **1 refresh token por usuário**
- Logout invalida completamente a sessão
- Refresh token nunca é salvo em texto puro
- teste

### 🛡️ Proteções

- Cookies `httpOnly`
- `sameSite: strict`
- Tokens de curta duração
- Guards protegendo rotas
- JWT Strategy validando assinatura e expiração

---
