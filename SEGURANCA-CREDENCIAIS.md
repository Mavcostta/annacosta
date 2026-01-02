# 🔐 Configuração Segura das Credenciais

## ⚠️ IMPORTANTE - Segurança

Este projeto usa a API do Google Calendar que requer credenciais sensíveis. Para manter a segurança:

## 📋 Como Configurar

### 1. Copiar o arquivo de exemplo
```bash
cp calendar-config.example.js calendar-config.js
```

### 2. Editar o arquivo `calendar-config.js`
Abra o arquivo e preencha com suas credenciais:

```javascript
const CALENDAR_CONFIG = {
  apiKey: "SUA_API_KEY_AQUI",
  calendarId: "seu-email@gmail.com",
  timeZone: "America/Sao_Paulo",
};
```

### 3. Obter as credenciais

Siga as instruções em [CONFIGURACAO-CALENDARIO.md](CONFIGURACAO-CALENDARIO.md) para:
- Criar um projeto no Google Cloud
- Ativar a API do Google Calendar
- Gerar uma API Key
- Configurar o Google Calendar

## 🛡️ Segurança

- ✅ O arquivo `calendar-config.js` está no `.gitignore` e **NÃO será commitado**
- ✅ Apenas o arquivo de exemplo (`calendar-config.example.js`) fica no repositório
- ✅ Suas credenciais ficam **apenas no seu computador e servidor**

## 📁 Estrutura de Arquivos

```
├── calendar-config.example.js  ✅ Commitado (exemplo)
├── calendar-config.js          ❌ NÃO commitado (suas credenciais)
├── calendar.js                 ✅ Código principal
└── agendamento.html           ✅ Página de agendamento
```

## 🚀 Deploy no Servidor

Quando fazer o deploy:

1. **Faça upload de todos os arquivos EXCETO** `calendar-config.js`
2. No servidor, crie o arquivo `calendar-config.js` manualmente com suas credenciais
3. Ou use variáveis de ambiente se o servidor suportar

## 🔍 Verificar se está seguro

Execute este comando para verificar se as credenciais estão expostas:

```bash
git grep -n "AIzaSy"
```

Se não retornar nada, está seguro! ✅

## ❌ O que NÃO fazer

- ❌ Não commite o arquivo `calendar-config.js`
- ❌ Não compartilhe sua API Key publicamente
- ❌ Não coloque credenciais diretamente no código

## ✅ O que fazer

- ✅ Use o arquivo `calendar-config.js` (está no .gitignore)
- ✅ Restrinja a API Key no Google Cloud Console
- ✅ Configure domínios permitidos na API Key
