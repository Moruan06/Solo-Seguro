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

2. 🔐 Configure variáveis de ambiente (opcional, conforme backend)

Crie um arquivo `.env` na raiz e defina, se necessário:

```bash
VITE_API_URL=https://sua-api.exemplo.com
VITE_WS_URL=wss://seu-websocket.exemplo.com
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

### 🤝 Como contribuir

- 🐞 Abra uma Issue descrevendo a proposta/bug com contexto e steps
- 🌿 Faça um fork e crie uma branch descritiva (`feature/…`, `fix/…`)
- 🔁 Envie um Pull Request com escopo claro e screenshots quando aplicável

---

### 📄 Licença

Definir licença do projeto (ex.: MIT). Enquanto não definida, considerar uso interno/acadêmico para a INOVAWEEK da UVV.

---

### 🙏 Créditos

Projeto idealizado para a **INOVAWEEK da UVV**, com foco em inovação aplicada à segurança de solo e prevenção de desastres. Agradecimentos à equipe, orientadores e à comunidade que apoia iniciativas de ciência aberta e IoT aplicada.
