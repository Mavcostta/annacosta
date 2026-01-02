# 📊 Configuração do Google Analytics 4 - Studio Anna Costa

## ✅ O que já foi implementado:

1. **Script do Google Analytics instalado** no `<head>` do index.html
2. **Rastreamento de eventos** configurado nos principais CTAs
3. **Função helper** `trackEvent()` para rastreamento customizado
4. **Anonymize IP** ativado para privacidade

---

## 🔧 Como Configurar (Passo a Passo):

### 1. Criar Conta Google Analytics

1. Acesse: https://analytics.google.com/
2. Clique em "Começar a medir"
3. Crie uma conta com o nome "Studio Anna Costa"
4. Crie uma propriedade "Site Anna Costa"
5. Configure fuso horário: **São Paulo (GMT-3)**
6. Aceite os termos

### 2. Criar Stream de Dados da Web

1. Selecione plataforma: **Web**
2. URL do site: `https://annamrdesigner.com.br`
3. Nome do stream: "Site Principal"
4. Clique em "Criar stream"

### 3. Copiar o ID de Medição

Após criar o stream, você verá:

```
ID de medição: G-XXXXXXXXXX
```

### 4. Atualizar o Código

No arquivo `index.html`, linha 5 e 11, substitua:

```html
<!-- ANTES -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
gtag('config', 'G-XXXXXXXXXX', {

<!-- DEPOIS (exemplo) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ4"
></script>
gtag('config', 'G-ABC123XYZ4', {
```

---

## 📈 Eventos Configurados:

| Evento            | Categoria | Ação  | Label         |
| ----------------- | --------- | ----- | ------------- |
| **WhatsApp Fixo** | CTA       | click | WhatsApp Fixo |

### Como adicionar mais eventos:

No HTML, adicione `onclick="trackEvent('Categoria', 'ação', 'label')"` em qualquer link ou botão:

```html
<!-- Exemplo: Botão Agendar -->
<a
  href="agendamento.html"
  onclick="trackEvent('Navigation', 'click', 'Botao Agendar')"
>
  Agendar
</a>

<!-- Exemplo: Link Instagram -->
<a
  href="https://instagram.com/annamrdesigner"
  onclick="trackEvent('Social', 'click', 'Instagram')"
>
  Instagram
</a>
```

---

## 🎯 Métricas Importantes para Acompanhar:

### 1. **Conversões** (Configure metas no GA4):

- Cliques no WhatsApp
- Visualizações da página de agendamento
- Cliques em serviços

### 2. **Comportamento**:

- Páginas mais visitadas
- Tempo médio na página
- Taxa de rejeição
- Dispositivos mais usados (mobile vs desktop)

### 3. **Origens de Tráfego**:

- Google Search
- Instagram
- TikTok
- Tráfego direto
- Referências

---

## 🔍 Como Ver os Dados:

1. Acesse: https://analytics.google.com/
2. Selecione a propriedade "Site Anna Costa"
3. Vá em **Relatórios > Aquisição** para ver de onde vêm os visitantes
4. Vá em **Relatórios > Engajamento > Eventos** para ver cliques
5. Vá em **Tempo real** para ver visitantes ativos agora

---

## 📊 Relatórios Recomendados:

### Criar Relatório Personalizado:

1. **Conversões WhatsApp**:

   - Evento: `click`
   - Categoria: `CTA`
   - Label: `WhatsApp Fixo`

2. **Páginas de Serviços**:

   - Páginas que contém: "guarulhos.html"
   - Métrica: Visualizações de página

3. **Origem dos Agendamentos**:
   - Página: `/agendamento.html`
   - Dimensão: Origem/Mídia

---

## 🚀 Próximos Passos (Opcional):

1. **Integrar com Google Search Console**

   - Para ver palavras-chave que trazem tráfego
   - Monitorar posição no Google

2. **Configurar Conversões no Google Ads**

   - Se for anunciar no Google

3. **Instalar Facebook Pixel**

   - Para anúncios no Instagram/Facebook

4. **Criar Dashboard no Google Data Studio**
   - Visualizações mais bonitas dos dados

---

## ⚠️ Importante:

- Os dados começam a aparecer **após 24-48 horas** da configuração
- O Analytics funciona apenas em **produção** (domínio real)
- Em localhost (teste local) os dados não são enviados
- Mantenha o ID de medição **privado** (não compartilhe)

---

## 💡 Dúvidas?

Documentação oficial: https://support.google.com/analytics/answer/9304153

---

**Última atualização:** 1 de Janeiro de 2026
**Versão:** 1.0
