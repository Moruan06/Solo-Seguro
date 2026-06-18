## 🌱 Solo-Seguro

Monitoramento inteligente de solo e ambiente com sensores físicos, IoT e visualização em tempo real. 🌦️🌡️🌧️

### ✨ Sobre o projeto

O Solo-Seguro é um projeto desenvolvido para a INOVAWEEK da UVV com o objetivo de apoiar prevenção e resposta a eventos de risco (deslizamentos, alagamentos e degradação de taludes) por meio de captação de dados via sensores, transmissão IoT e análise/visualização em uma interface web moderna.

- 🛰️ **Captação de dados com sensores**: umidade do solo, temperatura/umidade do ar, vibração/inclinação e chuva (conjunto flexível e expansível).
- 📡 **Transmissão IoT**: gateway (ex.: ESP32/Raspberry Pi) publica leituras para o backend (MQTT/HTTP).
- 📊 **Visualização e alertas**: dashboard web com gráficos, histórico, thresholds e (opcional) streaming em tempo real.

> 💡 O foco deste repositório é o frontend (Vite + React + TypeScript). A camada de hardware/backend pode variar conforme a implantação do time.

---

### 🏗️ Arquitetura de alto nível

⚙️ Sensores → 🛜 Gateway IoT → ☁️ Backend/Cloud → 🔌 API/WS → 🖥️ Frontend Solo-Seguro

- 🔎 **Sensores**: capturam sinais (umidade, temperatura, vibração, inclinação, chuva etc.).
- 🛜 **Gateway IoT**: agrega leituras e envia para a nuvem (MQTT/HTTP).
- ☁️ **Backend/Cloud**: persiste dados, aplica regras de alerta e expõe APIs/WebSocket.
- 🖥️ **Frontend**: consome as APIs, exibe dashboards, histórico e status dos dispositivos.

---

### 🧰 Tecnologias

- 🎯 **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- 🔌 **Comunicação**: REST e (opcional) WebSocket para tempo real
- 🔬 **IoT (exemplo)**: ESP32/Raspberry Pi, MQTT/HTTP (implementação a critério)

---

### 🗂️ Estrutura do projeto (frontend)

```
src/
  assets/        # imagens, ícones e recursos estáticos
  components/    # componentes reutilizáveis de UI
  hooks/         # hooks de estado/efeitos e integrações
  lib/           # utilitários, clients (ex.: API), configurações
  pages/         # páginas/rotas da aplicação
  App.tsx        # composição principal
  main.tsx       # bootstrap do React
```

---

### ⚙️ Pré-requisitos

- 🟢 Node.js 18+ e npm (ou pnpm/yarn)

---

### ▶️ Como rodar localmente

1. 📥 Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd Solo-Seguro
```

2. 🔐 Configure variáveis de ambiente

Crie um arquivo `.env` na raiz com as variáveis do backend e os UUIDs dos sensores:

```bash
VITE_API_URL=http://localhost:8080
VITE_SSE_URL=http://localhost:8080/api/v1/sse/leitura
VITE_SENSOR_TEMP=40000000-0000-0000-0000-000000000002
VITE_SENSOR_UMID=40000000-0000-0000-0000-000000000001
VITE_SENSOR_GAS=40000000-0000-0000-0000-000000000004
VITE_SENSOR_PH=40000000-0000-0000-0000-000000000003
```

3. 📦 Instale as dependências

```bash
npm i
```

4. 🟢 Rode em desenvolvimento

```bash
npm run dev
```

5. 🚀 Build de produção (opcional)

```bash
npm run build
npm run preview
```

---

### 🧩 Funcionalidades previstas

- 📈 Painel com indicadores de solo/ambiente (cards, gráficos e tendências)
- 🕓 Histórico de leituras por sensor e por área
- 🔔 Thresholds configuráveis e alertas (ex.: e-mail/Push/WhatsApp via integrações no backend)
- ⚡ (Opcional) Streaming em tempo real via WebSocket
- 🧭 Gestão de dispositivos (cadastro/saúde/último heartbeat)

---

### 🗺️ Roadmap (curto prazo)

- 🔗 Integração com backend de referência (REST + WebSocket)
- 🗺️ Mapa com camadas de risco e pontos de leitura
- 📤 Exportação de dados (CSV/Parquet)
- 👤 Perfis e permissões básicas
- ✅ Testes E2E e monitoramento de performance (Web Vitals)

---

### 🎨 Qualidade e UI

- 🧱 Design System com shadcn-ui + Tailwind CSS
- 🛡️ TypeScript para segurança de tipos e manutenção

---

### 👤 Usuário Padrão

Ao subir o backend pela primeira vez, o banco já vem com um usuário administrador via seed (migração Flyway):

| Campo | Valor |
|-------|-------|
| **Email** | `admin@soloseguro.com` |
| **Senha** | `Admin@1234` |
| **Cargo** | ADMIN (acesso total) |

---

### 🤝 Como contribuir

- 🐞 Abra uma Issue descrevendo a proposta/bug com contexto e steps
- 🌿 Faça um fork e crie uma branch descritiva (`feature/…`, `fix/…`)
- 🔁 Envie um Pull Request com escopo claro e screenshots quando aplicável
