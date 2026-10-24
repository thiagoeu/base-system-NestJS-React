# 🧱 Base System — Full Stack Architecture

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

Boilerplate Full Stack profissional e escalável com **NestJS**, **React (Vite + SWC)** e **PostgreSQL**, estruturado para inicialização rápida de sistemas corporativos com autenticação segura e conteinerização via Docker.

---

## 🧱 Stack Tecnológica

### Frontend (`/client`)
- ⚡ **Vite** — Build tool ultra rápido de última geração
- ⚛️ **React** — Biblioteca para construção de interfaces reativas
- 🦀 **SWC** — Compilador ultra rápido (Rust-based) para TypeScript e JSX
- 🔷 **TypeScript** — Tipagem estática de ponta a ponta

### Backend (`/server`)
- 🐱 **NestJS** — Framework Node.js modular e escalável (Clean Architecture)
- 🔷 **TypeScript** — Tipagem estática e decorators
- 🧬 **TypeORM** — ORM robusto para mapeamento relacional
- 🔐 **Autenticação Dupla JWT** (Access Token + Refresh Token criptografado)
- 🍪 **Cookies HTTP-Only** para máxima proteção contra ataques XSS
- 🛂 **Passport + Guards** para proteção declarativa de rotas

### Banco de Dados & Infraestrutura
- 🐘 **PostgreSQL** — Banco de dados relacional confiável
- 🐳 **Docker & Docker Compose** — Ambiente de desenvolvimento reproduzível

---

## 🔐 Arquitetura de Autenticação & Segurança

O projeto adota os padrões mais recomendados da indústria para autenticação segura entre SPA e API:

1. **Fluxo de Login:**
   - O cliente envia credenciais (`email` e `senha`) via HTTPS.
   - O backend valida o hash da senha (Bcrypt) e gera dois tokens:
     - **Access Token:** Curta duração (15 minutos) para autorização rápida.
     - **Refresh Token:** Longa duração (7 dias), com hash salvo no PostgreSQL.
2. **Armazenamento Seguro:**
   - Os tokens são trafegados exclusivamente através de **Cookies HTTP-Only com flag `sameSite: strict`**, impedindo roubo via scripts maliciosos (XSS).
3. **Mecanismo de Rotação de Refresh Token:**
   - Apenas 1 refresh token ativo por usuário.
   - O logout invalida explicitamente o token no banco de dados e limpa os cookies.

---

## 🚀 Como Executar

### 1. Clonar o repositório
```bash
git clone https://github.com/thiagoeu/base-system-NestJS-React.git
cd base-system-NestJS-React
```

### 2. Subir o Banco de Dados com Docker
```bash
docker compose up -d
```

### 3. Executar o Backend
```bash
cd server
npm install
npm run start:dev
```

### 4. Executar o Frontend
```bash
cd ../client
npm install
npm run dev
```

---

## 📄 Licença
Distribuído sob a licença MIT. Sinta-se livre para utilizar como base para seus próprios projetos!
