# Studio Anna Costa

Site institucional do Studio Anna Costa, especializado em extensão de cílios e design de sobrancelhas em Guarulhos.

Produção: [www.studioannacosta.com.br](https://www.studioannacosta.com.br/)

## Tecnologias

- HTML, CSS e JavaScript sem framework
- GitHub Pages com domínio personalizado
- PWA com Web App Manifest e service worker
- Font Awesome e Google Fonts

## Estrutura

```text
.
├── index.html
├── blog.html
├── brow-lamination-guarulhos.html
├── design-sobrancelhas-guarulhos.html
├── extensao-cilios-guarulhos.html
├── lash-lifting-guarulhos.html
├── css/
│   ├── style.css
│   └── style.min.css
├── js/
│   ├── script.js
│   ├── optimize-images.js
│   ├── optimize-dimensions.js
│   └── analytics.js
├── imagens/
├── scripts/
│   ├── minify-css.js
│   └── check-site.js
├── docs/
├── manifest.json
├── sw.js
├── robots.txt
├── sitemap.xml
├── CNAME
└── .nojekyll
```

`portifolio-novo.pdf` é o portfólio vinculado pelo site. `portfolio-anna-costa.pdf` permanece disponível para preservar uma URL antiga já publicada.

## Desenvolvimento

Requer Node.js 18 ou superior somente para gerar o CSS minificado.

```bash
npm ci
npm run build
npm run check
```

Edite `css/style.css`; não edite `css/style.min.css` diretamente. Execute `npm run build` antes de publicar mudanças de estilo.

Para testar localmente, sirva a raiz com qualquer servidor HTTP estático. Service workers não funcionam corretamente abrindo os HTMLs pelo protocolo `file://`.

## Publicação

O GitHub Pages publica os arquivos estáticos da raiz do branch configurado. Preserve estes arquivos:

- `CNAME`: domínio personalizado
- `.nojekyll`: publicação direta sem processamento Jekyll
- `robots.txt` e `sitemap.xml`: indexação
- `manifest.json` e `sw.js`: PWA e cache

Não publique a pasta `node_modules`.

## Integrações

- Agendamento: links diretos para WhatsApp
- Google Analytics: código auxiliar existente, mas sem Measurement ID configurado
- Google Calendar: integração antiga removida

## Segurança

Não versione tokens, chaves privadas ou arquivos `.env`. Chaves destinadas ao navegador ainda devem ser limitadas por domínio e API no provedor correspondente.
