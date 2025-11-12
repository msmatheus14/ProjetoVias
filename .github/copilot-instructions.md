# ProjetoVias - Instruções para Agentes AI

## Visão Geral da Arquitetura

**ProjetoVias** é um sistema full-stack para gerenciamento e análise de buracos/problemas em vias urbanas usando geolocalização.

- **Backend**: Node.js + Express com MongoDB e Mongoose (modulares por recurso)
- **Frontend**: Next.js 15 (TypeScript) com React 19, Tailwind CSS e mapas Leaflet
- **Integração Externa**: Overpass API (consultas de ruas) e Nominatim OSM (geocodificação reversa)
- **Integrações IoT/Mobile**: WhatsApp Web.js, Puppeteer, QR-Code Terminal (dispositivos reportam problemas)

### Fluxo de Dados Principal

1. **Dispositivos (IoT/Mobile)** reportam buracos → `/report` (POST) → Backend
2. **Backend** valida localização (lat/lon) via Nominatim → obtém nome da rua via Overpass
3. **MongoDB** persiste `buracoModel` com campos de localização GeoJSON 2D-Sphere
4. **Frontend** consulta `/RETORNARTODOSBURACOS` → renderiza markers Leaflet + dashboard

## Estrutura e Convenções

### Backend (`/Backend`)

**Organização modular por entidade** (rua, buraco, cidade, usuário, recebimento):
- `src/models/` - Esquemas Mongoose (ex: `buracoModel.js` com índice 2dsphere)
- `src/controllers/` - Lógica (ex: `buracoController.js` com `adicionarReportBuraco()`, `aumentarConfirmacao()`)
- `src/routes/` - Routers Express (ex: `buracoRouter.js` - todas as rotas sem prefixo, apenas o endpoint)
- `config/db.js` - Conexão MongoDB (env: `MONGODB_URI`)
- `util/` - Utilitários (ex: `processarOverpass.js`, `chatBoot.js`)

**Padrões HTTP**:
- `201` Created: buraco reportado com sucesso
- `208` Already Reported: buraco duplicado (mesmo `idDispositivo` + localização)
- `400` Bad Request: falta de campo obrigatório (`idDispositivo`, latitude, longitude, criticidade)

**Modelo `buraco`** (exemplo de schema):
```javascript
{
  idDispositivo: String (unique device ID),
  localizacao: { 
    rua: String, 
    ruaID: String,
    type: "Point",
    coordinates: [lat, lon]  // ⚠️ NOTA: Nominatim usa LAT/LON
  },
  criticidade: Number (1-5),
  status: "Aberto" | "Fechado",
  confirmacoes: Number (incremental via $inc)
}
```

### Frontend (`/Frontend`)

**Estrutura Next.js 13+ com App Router**:
- `src/app/` - Páginas (page.tsx, layout.tsx)
- `src/context/` - Contextos React (AuthContext.tsx, protectRoute.tsx)
- `components/` - Componentes reutilizáveis (Map.tsx com Leaflet, TabelaRuas.tsx, etc)

**Convenções**:
- Use `'use client'` em componentes com estado/hooks
- Use `dynamic()` com `{ ssr: false }` para componentes pesados (ex: Map.tsx)
- Variáveis de ambiente: `NEXT_PUBLIC_DATABASE_URL` (acessível no client)
- Geolocalização: `navigator.geolocation.getCurrentPosition()` (já implementado em `page.tsx`)

**Autenticação**:
- POST `/ValidarUsuario` com `{ email, senha }`
- Sucesso retorna `{ login: true }`
- Token armazenado em `localStorage` como `isAuthenticated: "true"`

## Workflows Críticos

### Backend: Dev + Teste
```bash
npm run dev           # nodemon server.js (watch mode)
npm run test          # jest com babel-jest
npm start             # node server.js (produção)
```

**Jest Config**: `testEnvironment: 'node'` + Babel para ES6 modules. Testes em `src/tests/report.test.js` usam `supertest` com `beforeAll()` para limpar DB.

### Frontend: Build + Dev
```bash
npm run dev           # next dev (localhost:3000 padrão)
npm run build         # next build
npm start             # next start
```

### Banco de Dados
- MongoDB conecta via `MONGODB_URI` em `config/db.js`
- Índice geoespacial em `localizacao`: `buracoSchema.index({ 'localizacao': '2dsphere' })`
- Não há migrations formais - schema é gerido no Mongoose

## Padrões e Armadilhas

- **Ordem de coordenadas**: Nominatim retorna `[lat, lon]`, mas algumas APIs usam `[lon, lat]` - sempre verificar!
- **Roteamento no Backend**: Todas as rotas são registradas com `app.use('/', router)` - endpoints não têm prefixo (ex: `/RETORNARTODOSBURACOS`, não `/api/buracos/...`)
- **SPA Geolocalização**: Frontend requer geolocalização do navegador (HTTPS ou localhost)
- **Sem versionamento de API**: Rotas são diretas sem `/v1/` ou `/api/`

## Tipos e Interfaces Principais

### Backend: Sem TypeScript
- Padrão Node.js/Express com validação em runtime nos controllers
- Comentários importantes marcados com `// GABRIEL CUIDADO` (revisar antes de mudanças)

### Frontend: TypeScript
```tsx
// Exemplos de tipos
interface MarkerType { /* posição, status */ }
interface DashBoardData { TotalReport, TotalReportAberto, TotalReportFechado }
interface RuaInfo { id, nome, totalBuracos, totalConfirmacoes, totalCriticidade, score }
```

## Próximas Adições Recomendadas

- [ ] Middleware de autenticação no Backend (rotas protegidas)
- [ ] Rate limiting em `/report` (evitar spam)
- [ ] Testes de integração para rotas críticas
- [ ] Documentação de API (Swagger/OpenAPI)
- [ ] Variáveis de ambiente em `.env.local` (nunca commitar credenciais)

---

**Última atualização**: 12 de novembro de 2025  
**Branches principais**: `master`
