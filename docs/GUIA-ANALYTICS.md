# Guia de Analytics e monitoramento

## Anna Costa Studio - Rastreamento de Conversões

> Status atual: Google Analytics não está ativo. Configure um Measurement ID e carregue `js/analytics.js` somente após revisar o consentimento e a política de privacidade.

---

## 🎯 PARTE 1: Configuração do Google Analytics 4

### Passo 1: Criar Conta Google Analytics

1. Acesse: https://analytics.google.com
2. Clique em "Começar a medir"
3. Preencha:
   - **Nome da conta**: Anna Costa Studio
   - **Nome da propriedade**: www.studioannacosta.com.br
   - **Fuso horário**: (GMT-03:00) Brasília
   - **Moeda**: Real brasileiro (BRL)

### Passo 2: Criar Data Stream

1. Selecione "Web"
2. **URL do site**: https://www.studioannacosta.com.br
3. **Nome do stream**: Site Principal
4. Ative "Enhanced measurement" (medição aprimorada)

### Passo 3: Copiar o Measurement ID

- Você receberá um ID tipo: `G-XXXXXXXXXX`
- **GUARDAR ESSE ID!**

### Passo 4: Adicionar o Código no Site

Após obter o Measurement ID (exemplo: G-ABC123XYZ), adicione no `<head>` do **index.html** e das 4 páginas de serviço:

```html
<!-- Google Analytics 4 -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-ABC123XYZ");
</script>
```

**IMPORTANTE:** Substituir `G-ABC123XYZ` pelo SEU Measurement ID real!

### Passo 5: Adicionar Script de Tracking Personalizado

Adicionar antes do fechamento do `</body>`:

```html
<!-- Analytics de Conversões -->
<script src="js/analytics.js" defer></script>
```

---

## 📈 PARTE 2: Configuração do Google Search Console

### Passo 1: Adicionar Propriedade

1. Acesse: https://search.google.com/search-console
2. Clique em "Adicionar propriedade"
3. Escolha "Prefixo do URL"
4. Digite: `https://www.studioannacosta.com.br`

### Passo 2: Verificar Propriedade

**Método Recomendado: Tag HTML**

1. Copie a meta tag fornecida
2. Adicione no `<head>` do index.html:

```html
<meta name="google-site-verification" content="CODIGO_AQUI" />
```

3. Clique em "Verificar"

**Método Alternativo: Google Analytics**

- Se já tem GA4 configurado, pode verificar automaticamente

### Passo 3: Enviar Sitemap

1. No Search Console, vá em "Sitemaps"
2. Adicione: `https://www.studioannacosta.com.br/sitemap.xml`
3. Clique em "Enviar"

### Passo 4: Configurar Links Internos

- Ative "Relatório de links"
- Monitore páginas mais linkadas

---

## 🗺️ PARTE 3: Atualizar o Sitemap.xml

O arquivo `sitemap.xml` precisa incluir as novas páginas de serviços:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.studioannacosta.com.br/</loc>
    <lastmod>2026-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.studioannacosta.com.br/extensao-cilios-guarulhos.html</loc>
    <lastmod>2026-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.studioannacosta.com.br/design-sobrancelhas-guarulhos.html</loc>
    <lastmod>2026-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.studioannacosta.com.br/lash-lifting-guarulhos.html</loc>
    <lastmod>2026-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.studioannacosta.com.br/brow-lamination-guarulhos.html</loc>
    <lastmod>2026-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 📱 PARTE 4: Eventos Rastreados Automaticamente

O arquivo `js/analytics.js` já rastreia automaticamente:

### 🎯 Conversões (Alta Prioridade)

- ✅ **Cliques no WhatsApp** → `whatsapp_click`
- ✅ **Cliques no Telefone** → `phone_call`
- ✅ **Visualização de páginas de serviço** → `view_service`

### 📊 Engajamento

- ✅ **Profundidade de scroll** → `scroll_depth` (25%, 50%, 75%, 100%)
- ✅ **Tempo na página** → `time_on_page` (30s, 1min, 2min)
- ✅ **Saída da página** → `page_exit`

### 🖼️ Interações

- ✅ **Visualizações de imagens** → `image_view`
- ✅ **Cliques em redes sociais** → `social_click`

---

## 🎯 PARTE 5: Metas de Conversão no GA4

### Configurar Eventos como Conversões

1. No GA4, vá em **Admin** → **Events**
2. Marque como conversão:
   - ✅ `whatsapp_click` (MAIS IMPORTANTE)
   - ✅ `phone_call`
   - ✅ `view_service`

### Criar Relatório Personalizado

1. **Explorar** → **Criar exploração em branco**
2. Dimensões:
   - Nome do evento
   - Origem/mídia
   - Cidade
   - Dispositivo
3. Métricas:
   - Contagem de eventos
   - Usuários
   - Taxa de conversão

---

## 📊 PARTE 6: Ferramentas de Monitoramento Adicionais

### 6.1 Microsoft Clarity (Gravações de Sessão - GRÁTIS)

**O que faz:** Grava sessões de usuários, mapas de calor, análise de comportamento

1. Criar conta: https://clarity.microsoft.com
2. Adicionar novo projeto: "Anna Costa Studio"
3. Copiar o código de tracking
4. Adicionar no `<head>` do site:

```html
<!-- Microsoft Clarity -->
<script type="text/javascript">
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", "SEU_ID_CLARITY");
</script>
```

**Benefícios:**

- Ver EXATAMENTE como clientes navegam no site
- Identificar onde clicam mais
- Ver onde abandonam a página
- Descobrir problemas de UX

### 6.2 Hotjar (Alternativa ao Clarity - Freemium)

- Mapas de calor mais avançados
- Pesquisas in-site
- Feedback de usuários
- https://www.hotjar.com

### 6.3 Google Tag Manager (Gerenciamento Avançado)

**Quando usar:** Se quiser adicionar muitos scripts sem editar código

1. Criar conta: https://tagmanager.google.com
2. Criar container: www.studioannacosta.com.br
3. Instalar código no site
4. Gerenciar todos os scripts (GA4, Clarity, etc) pelo painel

---

## 📈 PARTE 7: Dashboards e Relatórios Essenciais

### Relatórios para Revisar Semanalmente

#### Google Analytics 4

1. **Visão Geral** → Usuários, sessões, taxa de rejeição
2. **Aquisição** → De onde vem o tráfego
3. **Engajamento** → Páginas mais visitadas
4. **Conversões** → WhatsApp clicks, phone calls

#### Google Search Console

1. **Desempenho** → Palavras-chave que trazem cliques
2. **Cobertura** → Páginas indexadas
3. **Core Web Vitals** → Performance do site

#### Google My Business Insights

1. **Visualizações do perfil**
2. **Cliques no site**
3. **Chamadas telefônicas**
4. **Solicitações de rota**

---

## 🎯 PARTE 8: KPIs (Indicadores) para Acompanhar

### Métricas de Tráfego

- 📈 **Usuários/mês**: META 500+ no primeiro mês
- 📈 **Sessões/mês**: META 800+
- 📈 **Taxa de rejeição**: META <60%
- 📈 **Duração média sessão**: META >1min 30s

### Métricas de Conversão (MAIS IMPORTANTES)

- 🎯 **Cliques WhatsApp/mês**: META 50+
- 🎯 **Ligações/mês**: META 20+
- 🎯 **Taxa de conversão**: META 5-10%
- 🎯 **Agendamentos/mês**: META 30+

### Métricas de SEO

- 🔍 **Posição média Google**: META top 3 para "extensão cílios guarulhos"
- 🔍 **Impressões Search/mês**: META 5.000+
- 🔍 **CTR (taxa de clique)**: META >5%
- 🔍 **Backlinks**: META 30+ nos próximos 3 meses

### Métricas Google My Business

- ⭐ **Visualizações perfil/mês**: META 1.000+
- ⭐ **Cliques no site GMB**: META 200+
- ⭐ **Novas avaliações/mês**: META 5+
- ⭐ **Rating médio**: Manter 5.0 estrelas

---

## 📊 PARTE 9: Template de Relatório Mensal

### Estrutura do Relatório

```
🗓️ Relatório SEO/Analytics - [MÊS/ANO]
Anna Costa Studio

📈 RESUMO EXECUTIVO
- Usuários: [X] (+Y% vs mês anterior)
- Conversões WhatsApp: [X]
- Posição Google: #[X] para "extensão cílios guarulhos"
- Novas avaliações: [X]

🎯 DESTAQUES DO MÊS
1. [Principal conquista]
2. [Segundo destaque]
3. [Terceiro destaque]

📊 MÉTRICAS DETALHADAS

Tráfego:
- Usuários: [X]
- Sessões: [X]
- Taxa rejeição: [X]%
- Duração média: [X]min

Conversões:
- WhatsApp: [X] clicks
- Telefone: [X] calls
- Taxa conversão: [X]%

SEO:
- Posição média: #[X]
- Impressões: [X]
- Cliques orgânicos: [X]
- CTR: [X]%

Google My Business:
- Visualizações: [X]
- Cliques site: [X]
- Solicitações rota: [X]
- Novas reviews: [X]

🔝 TOP 5 PALAVRAS-CHAVE
1. [palavra] - Posição #[X] - [Y] cliques
2. [palavra] - Posição #[X] - [Y] cliques
3. [palavra] - Posição #[X] - [Y] cliques
4. [palavra] - Posição #[X] - [Y] cliques
5. [palavra] - Posição #[X] - [Y] cliques

📄 TOP 5 PÁGINAS MAIS VISITADAS
1. [página] - [X] visualizações
2. [página] - [X] visualizações
3. [página] - [X] visualizações
4. [página] - [X] visualizações
5. [página] - [X] visualizações

🎯 AÇÕES PARA PRÓXIMO MÊS
- [ ] [Ação 1]
- [ ] [Ação 2]
- [ ] [Ação 3]
```

---

## ⚠️ ALERTAS E NOTIFICAÇÕES

### Configurar Alertas no Google Analytics

1. **Admin** → **Custom alerts**
2. Criar alerta: "Queda de tráfego >20%"
3. Criar alerta: "Aumento conversões >50%"
4. Enviar para e-mail

### Configurar Alertas no Search Console

1. **Configurações** → **Usuários e permissões**
2. Ativar notificações de:
   - Problemas de indexação
   - Problemas de segurança
   - Penalizações manuais

---

## 🚀 CHECKLIST DE IMPLEMENTAÇÃO

### Semana 1: Fundação

- [ ] Criar conta Google Analytics 4
- [ ] Obter Measurement ID
- [ ] Adicionar código GA4 em todas as 5 páginas
- [ ] Adicionar `js/analytics.js` em todas as páginas
- [ ] Testar eventos (clicar WhatsApp e verificar no GA4)

### Semana 2: Search Console

- [ ] Adicionar propriedade no Search Console
- [ ] Verificar propriedade (meta tag)
- [ ] Atualizar sitemap.xml com novas páginas
- [ ] Enviar sitemap
- [ ] Conectar GA4 com Search Console

### Semana 3: Monitoramento Visual

- [ ] Criar conta Microsoft Clarity
- [ ] Adicionar código Clarity no site
- [ ] Configurar gravações de sessão
- [ ] Revisar primeiras sessões gravadas

### Semana 4: Análise e Otimização

- [ ] Criar relatório personalizado no GA4
- [ ] Marcar eventos como conversões
- [ ] Configurar alertas
- [ ] Gerar primeiro relatório mensal
- [ ] Identificar oportunidades de melhoria

---

## 💡 DICAS DE OURO

1. **Verificar diariamente** (5 minutos):

   - Quantos cliques no WhatsApp hoje?
   - Posição no Google para palavra-chave principal
   - Novas avaliações no GMB

2. **Verificar semanalmente** (30 minutos):

   - Relatório de tráfego (GA4)
   - Palavras-chave (Search Console)
   - Gravações de sessão (Clarity)

3. **Verificar mensalmente** (2 horas):
   - Relatório completo
   - Análise de tendências
   - Planejamento próximo mês
   - Ajustes de estratégia

---

## 📞 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ **HOJE**: Criar conta Google Analytics 4
2. ✅ **HOJE**: Obter Measurement ID e adicionar no site
3. ✅ **AMANHÃ**: Verificar no GA4 se eventos estão sendo rastreados
4. ✅ **ESTA SEMANA**: Configurar Search Console
5. ✅ **ESTA SEMANA**: Adicionar Microsoft Clarity

---

**🎯 Lembre-se:** Dados sem ação não servem para nada! Use os insights para **melhorar continuamente** o site e a experiência do cliente.
