# 📘 PokeTeam — Documentação do Projeto

O **PokeTeam** é um projeto full-stack que integra um frontend em **Astro** com um backend em **Node.js**, utilizando a **PokeAPI** como fonte de dados.
Ele permite visualizar detalhes da Pokédex e criar times personalizados de Pokémon de forma interativa.

Este documento descreve a arquitetura do projeto, dependências, instruções de instalação e processos de build.

---

## 📁 Estrutura do Repositório

```
PokeTeam/
 ├─ backend/           # API backend em Node.js
 ├─ frontend/          # Aplicação Astro
 ├─ scripts/           # Scripts de criação do Database
 ├─ docker-compose.yml # Orquestração do ambiente
 ├─ README.md          # (este arquivo)
 └─ LICENSE
```

---

## 🧱 Arquitetura do Projeto

### **Frontend (Astro)**

* Framework: **Astro**
* Linguagem: **JavaScript**
* Responsável pela interface de usuário e consumo dos dados retornados pelo backend.

### **Backend (Node.js)**

* Plataforma: **Node.js**
* Utiliza Express.js como framework da API
* Atua como:

  * Proxy para obter dados da PokeAPI
  * Camada para abstrair e tratar informações
  * API própria para servir dados ao frontend

### **Integrações**

* API externa utilizada: **PokeAPI ([https://pokeapi.co](https://pokeapi.co))**

### **Infraestrutura**

* Suporte nativo a **Docker** via `docker-compose.yml`
  → Permite levantar frontend + backend juntos e criar o database vázio com um único comando.

---

## ⚙️ Pré-requisitos

Antes de instalar o projeto, você precisará de:

| Tecnologia         | Versão Recomendada |
| ------------------ | ------------------ |
| **Node.js**        | 18+                |
| **npm**            | 9+                 |
| **Docker**         | opcional           |
| **Docker Compose** | opcional           |

---

## 📦 Instalação de Dependências

O projeto possui duas etapas de instalação:

### 🔹 1. Backend

```bash
cd backend
npm install
```

### 🔹 2. Frontend

```bash
cd frontend
npm install
```

---

## 🚀 Executando o Projeto

Você pode rodar o PokeTeam de duas maneiras: **com Docker** ou **localmente**.

---

# ▶️ Método 1 — Executar com Docker (Recomendado)

Executa **frontend + backend** automaticamente.

### 1. Build & Start:

```bash
docker compose up -d --build
```

### 2. Acessar o Projeto:

* Frontend: [http://localhost:4321](http://localhost:4321)
* Backend: [http://localhost:3067](http://localhost:3067) (ou porta configurada)

### 3. Encerrar:

```bash
docker compose down
```

---

# ▶️ Método 2 — Executar Manualmente (Sem Docker)

### 🔹 Iniciar o backend

```bash
cd backend
npm run dev
```

### 🔹 Iniciar o frontend

```bash
cd frontend
npm run dev
```

### Depois, acesse:

* Frontend: [http://localhost:4321](http://localhost:4321)
* Backend: [http://localhost:3067](http://localhost:3067)

---

## 🏗️ Build de Produção

### 🔹 Backend (Node.js)

Normalmente o backend não requer build, apenas instalação:

```bash
cd backend
npm install
npm start
```

### 🔹 Frontend (Astro)

Gerar build otimizado:

```bash
cd frontend
npm run build
```

Saída gerada em:

```
frontend/dist/
```

Visualizar o build:

```bash
npm run preview
```

---

## 🧪 Scripts Úteis

### Backend

| Comando       | Função                      |
| ------------- | --------------------------- |
| `npm run dev` | Inicia modo desenvolvimento |
| `npm start`   | Inicia modo produção        |

### Frontend

| Comando           | Função                      |
| ----------------- | --------------------------- |
| `npm run dev`     | Ambiente de desenvolvimento |
| `npm run build`   | Gera build estático         |
| `npm run preview` | Visualiza build             |

---

## 📜 Licença

Este projeto está sob a **MIT License**.

---