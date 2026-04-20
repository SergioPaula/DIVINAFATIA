# Design System — Divina Fatia

---

## Cores

### Primárias
| Token | Valor | Preview |
|---|---|---|
| `--color-primary-01` | `#5F352F` | Marrom principal |
| `--color-primary-02` | `#3E2724` | Marrom escuro |
| `--color-primary-03` | `#F3E9E7` | Marrom claro / creme |

### Secundárias
| Token | Valor | Preview |
|---|---|---|
| `--color-secondary-02` | `#FFEB99` | Amarelo |
| `--color-secondary-03` | `#FF6D74` | Rosa / vermelho |

### Terciárias
| Token | Valor | Preview |
|---|---|---|
| `--color-terciary-03` | `#FFB2B8` | Rosa claro |
| `--color-terciary-06` | `#DA4E53` | Vermelho rosado |

### Funcionais
| Token | Valor | Uso |
|---|---|---|
| `--color-addcart-01` | `#62A77C` | Botão adicionar ao carrinho (fundo) |
| `--color-addcart-02` | `#257A49` | Botão adicionar ao carrinho (hover) |
| `--color-background` | `#FFFDF7` | Fundo geral da página |
| `--color-background-modal` | `#F3E9E7` | Fundo dos modais |
| `--all-text-color` | `#5F352F` | Cor padrão de texto |
| `--button-text-color` | `#F3E9E7` | Texto dos botões |

### Sombras (cores)
| Token | Valor | Uso |
|---|---|---|
| `--color-sombra` | `rgba(95, 53, 47, 0.15)` | Sombra padrão |
| `--color-sombrasuave` | `rgba(95, 53, 47, 0.09)` | Sombra suave |
| `--color-sombrabotao` | `#E7D8D5` | Sombra / hover de botões |

### Tags de produto
| Nome | Valor |
|---|---|
| Promo | `#FFB2B8` |
| Novidade | `#B2B7FF` |
| Destaque | `#FFEB99` |

---

## Tipografia

### Famílias
| Token | Fonte | Uso |
|---|---|---|
| `--font-title` | `"Calistoga", serif` | Títulos e headings |
| `--font-body` | `"Bricolage Grotesque", sans-serif` | Corpo de texto |

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Calistoga&display=swap');
```

### Pesos
| Token | Valor |
|---|---|
| `--font-weight-light` | `300` |
| `--font-weight-regular` | `400` |
| `--font-weight-medium` | `500` |
| `--font-weight-semibold` | `600` |
| `--font-weight-bold` | `700` |
| `--font-weight-extrabold` | `800` |

### Tamanhos
| Token | rem | px |
|---|---|---|
| `--text-xs` | `0.75rem` | 12px |
| `--text-sm` | `0.875rem` | 14px |
| `--text-base` | `1rem` | 16px |
| `--text-md` | `1.125rem` | 18px |
| `--text-lg` | `1.25rem` | 20px |
| `--text-xl` | `1.5rem` | 24px |
| `--text-2xl` | `1.8rem` | 28.8px |
| `--text-3xl` | `2.25rem` | 36px |
| `--text-4xl` | `3rem` | 48px |
| `--text-5xl` | `4rem` | 64px |

### Alturas de linha
| Token | Valor |
|---|---|
| `--leading-fit` | `0.8` |
| `--leading-none` | `1` |
| `--leading-tight` | `1.25` |
| `--leading-normal` | `1.5` |
| `--leading-relaxed` | `1.625` |
| `--leading-loose` | `2` |

---

## Border Radius

| Token | Valor | Uso típico |
|---|---|---|
| `--radius-sm` | `8px` | Elementos pequenos, badges |
| `--radius-md` | `16px` | Cards internos, imagens |
| `--radius-lg` | `30px` | Cards de produto, botões |
| `--radius-xl` | `50px` | Elementos destacados |
| `--radius-pill` | `9999px` | Tags, inputs, pílulas |

---

## Espaçamento

| Token | rem | px |
|---|---|---|
| `--spacing-1` | `0.25rem` | 4px |
| `--spacing-2` | `0.5rem` | 8px |
| `--spacing-3` | `0.75rem` | 12px |
| `--spacing-4` | `1rem` | 16px |
| `--spacing-5` | `1.5rem` | 24px |
| `--spacing-6` | `2rem` | 32px |
| `--spacing-8` | `3rem` | 48px |

---

## Sombras

| Token | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | Elevação mínima |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, painéis |
| `--shadow-lg` | `0 5px 8px 0 rgba(0,0,0,0.3)` | Modais, overlays |

**Sombras de componentes:**
- Hover em cards: `2px 4px 8px rgba(0,0,0,0.2)`
- Botão fechar modal: `0 2px 8px rgba(0,0,0,0.1)`
- Botões ação: `0 2px 4px rgba(0,0,0,0.1)`

---

## Ícones

| Token | Tamanho | Uso |
|---|---|---|
| `--icon-30` | `30 × 30px` | Ícones grandes |
| `--icon-25` | `25 × 25px` | Ícones médios |
| `--icon-18` | `18 × 18px` | Ícones pequenos |
| — | `24 × 24px` | Ícone do carrinho |
| — | `20 × 20px` | Ícones sociais |

---

## Transições & Animações

| Token | Valor |
|---|---|
| `--transition-fast` | `0.2s ease` |
| `--transition-normal` | `0.3s ease` |

**Keyframes:**
- `spin` — rotação 360° (loading)
- `pulse` — opacidade `0.6 → 1 → 0.6` (1.5s infinito)
- `pulse` (carrinho sticky) — scale `1 → 1.2 → 1` (0.5s ease-in-out)

---

## Layout & Grid

| Propriedade | Valor |
|---|---|
| Max-width container | `1440px` |
| Padding horizontal | `0 16px` |
| Colunas | `12 colunas (repeat(12, 1fr))` |
| Gap padrão | `16px` |
| Gap seções | `24px` |

---

## Breakpoints

| Nome | Regra |
|---|---|
| Mobile | `max-width: 768px` |
| Tablet | `min-width: 769px` e `max-width: 1024px` |
| Desktop | `min-width: 1025px` (padrão) |

---

## Componentes

### Botões
- Padding: `8px 2.5rem` (botão principal)
- Border-radius: `var(--radius-lg)` — 30px
- Cor de fundo: `var(--color-primary-01)` — `#5F352F`
- Cor de texto: `var(--button-text-color)` — `#F3E9E7`
- Shadow hover: `var(--color-sombrabotao)` — `#E7D8D5`

### Inputs / Formulários
- Altura: `45px`
- Border-radius: `25px` (formato pílula)
- Padding: `8px`

### Cards de Produto
- Border-radius: `var(--radius-lg)` — 30px
- Padding interno: `10px`
- Gap entre cards: `32px`

### Botões de navegação do carrossel
- Tamanho: `50 × 50px`
- Border-radius: `50%` (circular)
- Background: `var(--color-sombrabotao)` — `#E7D8D5`

### Modais
- Background: `var(--color-background-modal)` — `#F3E9E7`
- Max-width (desktop): `70svw`
- Altura: `90svh`
- Modal produto (desktop): `65%`

---

## Arquivos CSS

| Arquivo | Responsabilidade |
|---|---|
| `css/main.css` | Tokens globais, variáveis `:root`, estilos base |
| `css/card-product.css` | Componente card de produto |
| `css/cart-modal.css` | Modal do carrinho de compras |
| `css/modal.css` | Modal genérico |
| `css/product-modal.css` | Modal de detalhe do produto |
| `css/styleportrait.css` | Ajustes mobile / responsivo |
| `css/fonts/stylesheet.css` | `@font-face` das fontes locais |
