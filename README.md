# Fortes Climatização

Landing page de captação de orçamentos. HTML, CSS e JavaScript puros, sem build e sem
dependências. Para ver localmente, basta abrir o `index.html` no navegador.

```
index.html     conteúdo, SEO e dados estruturados (HVACBusiness)
styles.css     sistema visual completo
script.js      CONFIG do contato, mensagens, menu, revelação, galeria
img/           fotos em WebP, mapa e imagem de compartilhamento (og.jpg)
favicon.svg    ícone da aba
```

---

## 1. Ligar o WhatsApp

O número fica em **um único lugar**, no topo do `script.js`:

```js
const CONFIG = {
  whatsapp: '',   // ex.: '5551987654321'  (55 + DDD + número, só dígitos)
  ...
};
```

- **Vazio (hoje):** os 15 botões abrem o Direct do Instagram
  (`ig.me/m/fortes_ar_condicionado`) e os textos dizem "Instagram". Nenhum número
  inventado vai ao ar.
- **Preenchido:** todos viram links `wa.me` com mensagem pronta por contexto (geral,
  venda, instalação, manutenção, infraestrutura, "começar", região, dúvida), os textos
  passam a dizer "WhatsApp" e o número aparece formatado no rodapé.
- A mensagem do CTA final é a pedida no briefing: "Olá, Matheus! Conheci a Fortes
  Climatização pelo site e gostaria de solicitar um orçamento."

A foto de perfil do Instagram parece mostrar um telefone, mas ele **não foi confirmado**
e não está no site. Confirme com o Matheus antes de preencher.

Depois de confirmar, adicione também `"telephone": "+55 51 ..."` ao JSON-LD no `<head>`.

## 2. Antes de publicar

| # | O que | Onde |
|---|---|---|
| 1 | Número de WhatsApp | `script.js`, `CONFIG.whatsapp` |
| 2 | Domínio | `index.html`: `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD (marcados `TROCAR`). Hoje: `https://fortesclimatizacao.com.br/` |
| 3 | Fotos reais | ver seção 3 |

## 3. Trocar as fotos

Todas as fotos atuais são do Pexels, usadas como ilustração. A galeria avisa
"Imagens ilustrativas" e o rodapé cita a origem. **Esses avisos só saem quando as fotos
forem da Fortes.** Use as do Instagram (destaques "Instalações" e "Manutenção").

| Arquivo | Onde | Observação |
|---|---|---|
| `hero-1800.webp` + `hero-900.webp` | hero | foto horizontal; no desktop é recortada em pé, mostrando o lado direito (`object-position: 86%`). O aparelho deve ficar à direita |
| `svc-venda.webp`, `svc-instalacao.webp`, `svc-manutencao.webp`, `svc-infra.webp` | módulos de serviço | a de manutenção ocupa um card alto, com o texto sobre a parte de baixo |
| `marca.webp` | "Quem escolhe qualidade..." | fica atrás de um véu azul-marinho; fotos escuras funcionam melhor |
| `cta.webp` | chamada final | |
| `gal-*.webp` + `gal-*-lg.webp` | galeria (a `-lg` abre ampliada) | a primeira (`gal-sala`) é o quadro grande |
| `og.jpg` | prévia ao compartilhar | 1200x630 |

Tudo é recortado com `object-fit: cover`. Ao trocar, atualize `alt`, `width` e `height`
da `<img>` e, na galeria, o `data-caption` (tire o "(imagem ilustrativa)").

Converter com ffmpeg: `ffmpeg -i foto.jpg -vf scale=900:-2 -c:v libwebp -quality 78 gal-x.webp`

## 4. Decisões do projeto

- **Cores:** branco para leitura, azul-marinho `#0B1728` nas seções de destaque, azul
  `#1769E8` só em botões e elementos interativos. O cinza de texto secundário é um tom
  abaixo do `#64748B` do briefing (`#5B697D`) para passar no contraste AA também sobre o
  fundo cinza.
- **Forma:** botões em pílula, cards e fotos com 20px, controles pequenos com 12px.
- **Ícones:** Tabler (traço linear), embutidos como sprite SVG. O detalhe de fluxo de ar
  ao lado da identificação do hero é um SVG próprio de três linhas que se desenham uma vez.
- **Nada inventado:** sem tempo de mercado, avaliações, marcas, garantias, preços,
  estatísticas, endereço ou lista de cidades. O mapa é do OpenStreetMap, com a atribuição
  obrigatória.
- **Sem listener de scroll**: tudo por `IntersectionObserver`. Movimento reduzido é
  respeitado. Sem JavaScript, o conteúdo aparece e os links levam ao Instagram.
- **Celular:** barra fixa "Solicitar orçamento" depois dos botões do hero, some no CTA
  final; o `body` reserva o espaço dela. No desktop, botão flutuante discreto.
