# ⚡ Handicap Pro

Dashboard interativo de gerenciamento de banca por composição progressiva para apostas esportivas.

## Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python + FastAPI + Uvicorn

---

## Instalação e Execução

### Pré-requisitos

- Node.js >= 18
- Python >= 3.10
- npm ou yarn

---

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
# ou: venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

Crie o arquivo `.env` na pasta `backend/`:

```env
PORT=8000
```

Rode o servidor:

```bash
uvicorn main:app --reload --port 8000
```

A API estará disponível em: `http://localhost:8000`  
Docs interativas: `http://localhost:8000/docs`

---

### Frontend (React + Vite)

```bash
cd frontend
npm install
```

Crie o arquivo `.env` na pasta `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

O app estará disponível em: `http://localhost:5173`

---

### Rodando em paralelo

Abra dois terminais:

**Terminal 1 – Backend:**
```bash
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000
```

**Terminal 2 – Frontend:**
```bash
cd frontend && npm run dev
```

---

## Variáveis de Ambiente

### Frontend (`frontend/.env`)

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_BASE_URL` | URL base do backend FastAPI | `http://localhost:8000` |

### Backend (`backend/.env`)

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta do servidor Uvicorn | `8000` |

---

## Logo

Coloque o arquivo da logo em `frontend/public/logo.png`.

---

## Estrutura de Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/summary` | Métricas do dashboard |
| GET | `/parameters` | Parâmetros atuais da banca |
| POST | `/parameters` | Atualiza parâmetros |
| GET | `/operation-nodes` | Lista nós de operação |
| POST | `/operation-nodes` | Adiciona/atualiza nó |
| DELETE | `/operation-nodes/{id}` | Remove nó |
| GET | `/payload-example` | Payload de integração exemplo |

---

## Estrutura do Projeto

```
Handicap777/
├── README.md
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── SplashScreen.tsx
│       │   ├── DashboardLayout.tsx
│       │   ├── MetricsCards.tsx
│       │   ├── ParametersForm.tsx
│       │   ├── OperationNodesTable.tsx
│       │   └── ApiIntegrationCard.tsx
│       ├── pages/
│       │   ├── SplashPage.tsx
│       │   └── DashboardPage.tsx
│       ├── services/
│       │   └── apiClient.ts
│       ├── store/
│       │   └── useStore.ts
│       └── types/
│           └── index.ts
└── backend/
    ├── main.py
    ├── requirements.txt
    ├── .env.example
    └── models/
        └── schemas.py
```
