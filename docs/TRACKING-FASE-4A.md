# Tracking — revisão da fase 4A

Instrumentação local concluída, com GA4 preparado para ativação após consentimento e sem deploy. Este documento substitui as instruções de tracking do guia antigo.

## Navegação dos serviços

Os quatro cards eram `div` sem link. Agora são elementos `a`, envolvendo também o título e o conteúdo, com navegação nativa e acesso por teclado. Não existia botão “saiba mais” nesses cards. Textos, imagens e CSS foram preservados.

| Serviço | Página | `service` |
| --- | --- | --- |
| Extensão de Cílios | `extensao-cilios-guarulhos.html` | `extensao_cilios` |
| Design de Sobrancelhas | `design-sobrancelhas-guarulhos.html` | `design_sobrancelhas` |
| Lash Lifting | `lash-lifting-guarulhos.html` | `lash_lifting` |
| Brow Lamination | `brow-lamination-guarulhos.html` | `brow_lamination` |

## Eventos e parâmetros

`js/analytics.js` centraliza o ID `G-EMDNPLS1H3`, o carregamento do GA4 e o envio por `window.pushAnalyticsEvent`. Cada página carrega o arquivo uma vez; uma proteção impede registrar listeners novamente. Cliques usam um único listener delegado, sem impedir ou atrasar navegação. As chamadas antigas a `trackEvent` e a implementação antiga de `trackConversion` foram removidas.

| Evento | Parâmetros | Disparo |
| --- | --- | --- |
| `whatsapp_click` | `page`, `cta_location`, `service` | Clique em um link de WhatsApp |
| `select_service` | `page`, `cta_location`, `service` | Clique em um dos quatro cards da home |
| `social_click` | `page`, `cta_location`, `platform` | Clique em Instagram ou TikTok |
| `google_reviews_click` | `page`, `cta_location` | Clique nos dois CTAs de avaliações da home |
| `portfolio_view` | `page`, `item_id` | Após abrir uma das seis imagens no lightbox |
| `scroll_depth` | `page`, `percent` | 50 e 90% da distância rolável; uma vez por marco por carregamento |

`page` é `home`, `blog` ou o nome do arquivo de serviço sem `.html`. Home e blog usam `service=general` nos links de WhatsApp; páginas de serviço usam o valor da tabela. `platform` é `instagram` ou `tiktok`. Não são enviados textos de mensagens, telefones ou URLs como parâmetros desses eventos.

`page_view` não é emitido pelo código customizado. Não há eventos `page_exit`, `time_on_page`, `image_view` ou `view_service`.

## CTAs instrumentados

- **WhatsApp: 34 links.** Home: 8 (`floating_button`, `sticky_mobile`, `hero`, `how_it_works`, `contact_card`, `contact_cta`, `footer_cta`, `footer_social`). Blog: 10 (`floating_button`, `blog_cta`, `post_1` a `post_6`, `footer_cta`, `footer_social`). Cada página de serviço: 4 (`hero`, `content_cta`, `footer_cta`, `footer_social`).
- **Serviços: 4 cards**, com `cta_location=services`.
- **Redes sociais: 17 links.** Home: Instagram no portfólio, Instagram/TikTok no contato e no rodapé. Página de cílios: Instagram/TikTok na lateral e no rodapé. Demais páginas e blog: Instagram/TikTok no rodapé. Localizações: `portfolio`, `contact`, `sidebar`, `footer`.
- **Avaliações: 2 links**, diferenciados por `floating_reviews_button` e `reviews_section`. Os seis links “Google Maps” dos rodapés representam localização e não são contabilizados como avaliações.
- **Portfólio: 6 itens**, identificados por `data-item-id`. O evento ocorre após `showModal()`, não por entrada na viewport.

Os links com `target="_blank"` têm `rel="noopener noreferrer"`. Links e destinos existentes de WhatsApp e redes sociais foram mantidos.

## Perfis divergentes na página de cílios — mantidos

| Rede | Lateral da página de cílios | Rodapé e home |
| --- | --- | --- |
| Instagram | `https://instagram.com/studioannacostaaa` | `https://www.instagram.com/annamrdesigner/` |
| TikTok | `https://www.tiktok.com/@studioannacostaaa` | `https://www.tiktok.com/@annacdesigner` |

A titularidade e a disponibilidade desses perfis não foram confirmadas. Nenhum foi substituído.

## GA4 e consentimento

O Measurement ID `G-EMDNPLS1H3`, do fluxo “Studio Anna Costa - Site”, fica em uma única constante no início de `js/analytics.js`. Para uma troca futura, basta editar essa constante. Não existe GTM ID nem container GTM no projeto.

O consentimento começa negado. Na primeira visita, um controle acessível oferece “Permitir” e “Recusar”; eventos de negócio não são enfileirados antes do aceite. A escolha é guardada no `localStorage` por 180 dias e o componente sai da tela após qualquer decisão. Ao aceitar, o código chama `setAnalyticsConsent(true)`, carrega `gtag.js` e configura o fluxo uma única vez. Ao recusar, envia `denied` e interrompe novos eventos. Falhas no armazenamento, no `dataLayer` ou no carregamento externo não interrompem os links.

O controle explica o uso opcional do analytics, mas não substitui uma política jurídica de privacidade ou cookies; esses documentos permanecem pendentes. Dashboard, APIs e banco não estão conectados.

## Verificação

`npm run check` inclui `scripts/check-analytics.js`, sem novas dependências. Verifica os quatro destinos locais, seis páginas, cobertura dos CTAs, parâmetros, um evento por clique, carregamento duplicado do script, scroll 50/90, consentimento negado/revogado e `dataLayer` ausente ou com falha. A revisão do código confirma um único ponto de emissão para abertura do portfólio.

Os quatro destinos e a estrutura de links foram validados automaticamente. A tentativa de teste em navegador não produziu resultado concluído neste ambiente; portanto, não há confirmação empírica de cliques/renderização em desktop e mobile ou de abertura dos destinos externos. Esses testes visuais permanecem uma limitação da revisão.

Reexecução final: `npm run check` **aprovado** e `npm run build` **aprovado**, ambos com saída 0 (executados via `npm.cmd` no Windows). Nenhuma duplicidade detectada nos cenários automatizados. O build gerou CSS minificado sem alteração no conteúdo versionado.

Arquivos alterados nesta etapa: os seis HTMLs, `js/analytics.js`, `js/script.js`, `sw.js` (versão do cache e inclusão do analytics), `package.json`, `scripts/check-analytics.js` e documentação. Nenhuma integração ou publicação foi realizada.
