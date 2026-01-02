# 🧪 Como Testar o Calendário de Agendamento

## ✅ Correções Implementadas

Implementei as seguintes melhorias no sistema de agendamento:

### 1. **Integração com Google Calendar**

- O calendário agora busca automaticamente os eventos marcados no Google Calendar
- Dias com eventos de "dia inteiro" (all-day events) são marcados como indisponíveis
- Os dias ocupados aparecem com um estilo visual diferente (fundo vermelho claro e emoji 🚫)

### 2. **Logs de Debug**

- Adicionei logs detalhados no console do navegador para ajudar na identificação de problemas
- Os logs mostram:
  - ✅ Se a API foi inicializada com sucesso
  - 📅 Quais eventos foram encontrados
  - 🚫 Quais dias estão marcados como ocupados
  - ❌ Erros caso ocorram

### 3. **Melhorias Visuais**

- Dias ocupados têm um estilo visual distinto
- Ícone de bloqueio (🚫) aparece nos dias indisponíveis

---

## 🔍 Como Testar

### Passo 1: Abrir o Console do Navegador

1. Abra o site: https://www.studioannacosta.com.br/agendamento.html
2. Pressione `F12` ou clique com botão direito → "Inspecionar"
3. Vá na aba **Console**

### Passo 2: Verificar os Logs

Ao carregar a página, você deve ver mensagens como:

```
✅ Google Calendar API inicializada com sucesso!
📧 Calendar ID: ana0710mariavini@gmail.com
📅 Buscando eventos entre [data inicial] e [data final]
📋 Total de eventos encontrados: X
```

### Passo 3: Criar Eventos de Teste no Google Calendar

Para testar se o calendário está funcionando:

1. Acesse: https://calendar.google.com
2. Entre com a conta: **ana0710mariavini@gmail.com**
3. Crie um evento de **DIA INTEIRO** (all-day event):

   - Clique em um dia futuro
   - Marque a opção "Evento de dia inteiro" ✓
   - Dê um título (ex: "Ocupado")
   - Salve

4. **Aguarde 1-2 minutos** para o cache da API atualizar
5. Recarregue a página de agendamento
6. O dia deve aparecer com fundo vermelho claro e emoji 🚫

---

## ⚠️ Possíveis Problemas e Soluções

### Problema 1: API Key Inválida

**Sintoma:** Console mostra erro de autenticação

**Solução:**

1. Verifique se a API Key está configurada corretamente no arquivo `calendar.js`
2. Confirme se a API Key tem permissões para acessar o Google Calendar
3. Veja o arquivo `CONFIGURACAO-CALENDARIO.md` para instruções completas

### Problema 2: Calendário não está público

**Sintoma:** Erro 404 ou "not found" no console

**Solução:**

1. Acesse as configurações do Google Calendar
2. Vá em "Permissões de acesso"
3. Marque "Disponibilizar publicamente"
4. Salve as alterações

### Problema 3: Eventos não aparecem

**Sintoma:** Console mostra "0 eventos encontrados"

**Solução:**

- Certifique-se de criar eventos de **DIA INTEIRO** (all-day events)
- Eventos com horário específico não bloqueiam o dia todo
- Aguarde 1-2 minutos para cache da API atualizar

### Problema 4: CORS Error

**Sintoma:** Erro de CORS no console

**Solução:**

1. Verifique se adicionou o domínio nas restrições da API Key
2. O domínio deve ser: `https://www.studioannacosta.com.br/*`
3. Também adicione: `https://studioannacosta.com.br/*` (sem www)

---

## 📊 Como Interpretar os Logs

### ✅ Logs de Sucesso

```
✅ Google Calendar API inicializada com sucesso!
📅 Buscando eventos entre...
📋 Total de eventos encontrados: 3
🚫 Dia ocupado: 2026-01-15 - Ocupado
⏰ Evento com horário: 10/01/2026 14:00:00 - Reunião
📊 Total de dias completamente ocupados: 1
```

### ❌ Logs de Erro

```
❌ Erro ao inicializar Google Calendar API: {error details}
⚠️ API Key não configurada
⚠️ API do Google Calendar ainda não está carregada
```

---

## 🎯 Comportamento Esperado

### Dias Normais (Disponíveis)

- Fundo cinza claro
- Hover com destaque rosa
- Clicáveis

### Dias Ocupados (Indisponíveis)

- Fundo vermelho claro
- Borda vermelha
- Emoji 🚫 no canto
- Não clicáveis
- Opacidade reduzida

### Dias Passados

- Opacidade muito baixa
- Não clicáveis
- Não podem ser selecionados

---

## 🔧 Verificação Rápida

Execute este checklist para garantir que está tudo funcionando:

- [ ] O console mostra "✅ Google Calendar API inicializada com sucesso!"
- [ ] Ao navegar entre meses, aparecem logs de "📅 Buscando eventos"
- [ ] Eventos de dia inteiro aparecem nos logs como "🚫 Dia ocupado"
- [ ] Os dias ocupados têm visual diferente no calendário
- [ ] Ao clicar em um dia disponível, abre o resumo
- [ ] O botão de WhatsApp funciona e envia mensagem correta

---

## 💡 Dicas

1. **Use eventos de dia inteiro** para bloquear dias completos
2. **Use eventos com horário** se quiser apenas informação (não bloqueia o dia)
3. **Limpe o cache** do navegador se não ver mudanças (Ctrl+Shift+R)
4. **Verifique as permissões** da API Key no Google Cloud Console

---

## 📞 Suporte

Se encontrar problemas:

1. Copie todos os logs do console
2. Tire screenshots dos erros
3. Verifique se seguiu todos os passos do `CONFIGURACAO-CALENDARIO.md`
