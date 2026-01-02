# 📅 Configuração do Sistema de Agendamento

## O que você precisa fazer

Seu sistema de agendamento está **quase pronto**! Ele se conecta com sua agenda do Google para mostrar apenas os horários que você tem disponíveis.

### Como funciona?

1. Você gerencia sua agenda normalmente no Google Calendar
2. O site lê automaticamente os horários ocupados
3. Clientes só conseguem selecionar horários livres
4. Quando o cliente clica para agendar, ele é direcionado ao seu WhatsApp

---

## ⚙️ Passo a Passo de Configuração

### 1️⃣ Criar uma Conta Google (se ainda não tiver)

- Acesse: https://accounts.google.com/signup
- Se já tiver uma conta Gmail, pode usar ela mesma

---

### 2️⃣ Criar um Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Clique em **"Criar Projeto"** (ou "Create Project")
3. Dê um nome para o projeto (exemplo: "Agendamento Studio Anna Costa")
4. Clique em **"Criar"**
5. Aguarde alguns segundos até o projeto ser criado

---

### 3️⃣ Ativar a API do Google Calendar

1. Com seu projeto selecionado, procure por **"APIs e Serviços"** no menu lateral
2. Clique em **"Biblioteca"** (ou "Library")
3. Na busca, digite: **"Google Calendar API"**
4. Clique na API que aparecer
5. Clique no botão **"Ativar"** (ou "Enable")

---

### 4️⃣ Criar uma Chave de API

1. No menu lateral, clique em **"Credenciais"** (ou "Credentials")
2. No topo da página, clique em **"Criar Credenciais"** → **"Chave de API"**
3. Uma janela vai aparecer com sua **chave de API** - ela é uma string longa tipo:
   ```
   AIzaSyB1234567890abcdefghijklmnopqrstuvwx
   ```
4. **COPIE essa chave e guarde em um lugar seguro!**

---

### 5️⃣ Configurar Restrições da API (segurança)

1. Na mesma tela de credenciais, clique na chave que acabou de criar
2. Em **"Restrições de aplicativo"**:
   - Selecione: **"Referenciadores HTTP (sites)"**
   - Adicione: `https://annamrdesigner.com.br/*`
   - Se tiver outro domínio, adicione também
3. Em **"Restrições de API"**:
   - Selecione: **"Restringir chave"**
   - Marque apenas: **"Google Calendar API"**
4. Clique em **"Salvar"**

---

### 6️⃣ Configurar o Google Calendar

1. Acesse: https://calendar.google.com/
2. Crie um calendário específico para agendamentos (ou use o principal)
3. **Para criar um novo calendário:**

   - Clique no **+** ao lado de "Outros calendários"
   - Escolha **"Criar novo calendário"**
   - Nome sugerido: "Agendamentos Studio Anna Costa"
   - Clique em **"Criar calendário"**

4. **Pegar o ID do calendário:**
   - No menu lateral, encontre o calendário que quer usar
   - Clique nos **3 pontinhos** ao lado do nome
   - Escolha **"Configurações e compartilhamento"**
   - Role até a seção **"Integrar calendário"**
   - Copie o **"ID do calendário"** (geralmente é seu email ou algo tipo: `abc123@group.calendar.google.com`)

---

### 7️⃣ Tornar o Calendário Público (apenas para leitura)

1. Ainda nas configurações do calendário
2. Vá até a seção **"Permissões de acesso"**
3. Marque a opção: **"Disponibilizar publicamente"**
4. **IMPORTANTE:** Certifique-se de que está marcado apenas **"Ver todos os detalhes do evento"** ou **"Ver apenas informações de livre/ocupado"**
5. Clique em **"Salvar"**

⚠️ **Não se preocupe:** O público só vai ver se você tem algo marcado ou não, mas NÃO vão ver os detalhes dos seus compromissos!

---

### 8️⃣ Inserir as Credenciais no Site

1. Abra o arquivo: **`calendar.js`**
2. No início do arquivo, você vai encontrar:

```javascript
const CALENDAR_CONFIG = {
  apiKey: "SUA_API_KEY_AQUI",
  calendarId: "SEU_EMAIL@gmail.com",
  timeZone: "America/Sao_Paulo",
};
```

3. Substitua:
   - `SUA_API_KEY_AQUI` → pela chave de API que você copiou
   - `SEU_EMAIL@gmail.com` → pelo ID do calendário que você copiou

**Exemplo de como deve ficar:**

```javascript
const CALENDAR_CONFIG = {
  apiKey: "AIzaSyB1234567890abcdefghijklmnopqrstuvwx",
  calendarId: "annamrdesigner@gmail.com",
  timeZone: "America/Sao_Paulo",
};
```

---

### 9️⃣ Testar o Sistema

1. Abra seu site e acesse: **agendamento.html**
2. Selecione um serviço
3. Escolha uma data
4. Verifique se os horários aparecem corretamente
5. **Para testar se está bloqueando horários ocupados:**
   - Crie um evento no seu Google Calendar
   - Atualize a página de agendamento
   - Esse horário deve aparecer desabilitado

---

## 🎯 Como Usar no Dia a Dia

### Para gerenciar sua agenda:

1. Use o Google Calendar normalmente (no celular ou computador)
2. Quando marcar um atendimento lá, o site automaticamente vai **bloquear** aquele horário
3. Quando um horário ficar livre, o site vai **liberar** automaticamente

### Configurações de horário de funcionamento:

No arquivo `calendar.js`, você pode ajustar:

```javascript
const BUSINESS_HOURS = {
  start: 9, // Hora de abertura (9h)
  end: 18, // Hora de fechamento (18h)
  interval: 30, // Intervalos de 30 minutos
};

const WORKING_DAYS = [1, 2, 3, 4, 5, 6]; // Segunda a Sábado (0 = Domingo)
```

### Duração dos serviços:

Também em `calendar.js`:

```javascript
const SERVICE_DURATION = {
  "extensao-cilios": 180, // 3 horas
  "design-sobrancelhas": 45, // 45 minutos
  "lash-lifting": 60, // 1 hora
  "brow-lamination": 45, // 45 minutos
};
```

---

## ❓ Dúvidas Comuns

**Q: É seguro deixar a API Key no código?**
A: Sim! A chave está restrita para funcionar apenas no seu site e só para ler o calendário. Ninguém pode modificar nada.

**Q: As pessoas vão ver meus compromissos pessoais?**
A: Não! O site só consegue ver se você tem algo marcado (ocupado/livre), mas não vê os detalhes dos eventos.

**Q: E se eu esquecer de atualizar o calendário?**
A: Recomendo sempre criar um evento no Google Calendar assim que marcar um atendimento. Você pode fazer isso pelo celular em segundos!

**Q: Posso ter mais de um calendário?**
A: Sim! Mas você precisará escolher um para o site ler. Recomendo criar um exclusivo para agendamentos do studio.

**Q: Funciona offline?**
A: Não. O sistema precisa de internet para consultar o Google Calendar em tempo real.

---

## 🆘 Precisa de Ajuda?

Se tiver dificuldade em alguma etapa, me chame! Posso te ajudar com:

- Configuração da API
- Ajustes de horários
- Testes do sistema
- Personalização adicional

**Anna, seu sistema está pronto! É só configurar e começar a usar! 🎉**
