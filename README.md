# AutoLux

Лендинг детейлинг-студии **AutoLux** (Ялуторовск) — одностраничный сайт на [Astro](https://astro.build).

Тёмный премиальный UI, акцент `#BFFF00`, адаптив под 4 брейкпоинта из Figma.

---

## Быстрый старт

```bash
npm install
npm run dev
```

Открой [http://localhost:4321](http://localhost:4321).

> Нужен **Node.js ≥ 22.12**.

---

## Команды

| Команда | Описание |
| --- | --- |
| `npm run dev` | Dev-сервер на `localhost:4321` |
| `npm run build` | Сборка в `./dist/` |
| `npm run preview` | Превью production-сборки |
| `npm run astro …` | CLI Astro (`check`, `add`, …) |

Фоновый режим (из `AGENTS.md`):

```bash
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

---

## Брейкпоинты

| Имя | Диапазон | Поведение |
| --- | --- | --- |
| Mobile | `375–767` | Бургер-меню, одна колонка |
| Tablet | `768–1023` | Телефон + CTA, сетки 2 колонки |
| Laptop | `1024–1439` | Навигация + телефон, без CTA в шапке |
| Desktop | `1440+` | Полный хедер, широкие сетки |

Отступы контента: **20px** → **40px** → **80px** (desktop).

---

## Структура

```text
src/
├── pages/index.astro          # Сборка секций
├── layouts/Layout.astro       # HTML-оболочка, meta, шрифты
├── styles/global.css          # Токены, reset, container
├── data/content.ts            # Тексты, цены, отзывы, контакты
├── components/
│   ├── Header.astro
│   ├── Hero.astro
│   ├── Services.astro
│   ├── Pricelist.astro
│   ├── ValueProps.astro
│   ├── BeforeAfter.astro
│   ├── Comfort.astro
│   ├── Reviews.astro
│   ├── Contacts.astro
│   ├── Footer.astro
│   └── ui/                    # Badge, Button, Icon, SectionHeader
└── assets/
    ├── images/                # Hero, услуги, до/после, карта…
    └── icons/                 # SVG из макета
public/
└── fonts/Geist-Variable.woff2
```

Контент правь в [`src/data/content.ts`](src/data/content.ts) — компоненты его подхватывают сами.

---

## Секции страницы

1. **Header** — логотип, якоря, телефон, «Запись онлайн», мобильное меню  
2. **Hero** — оффер, CTA, блок преимуществ  
3. **Services** — каталог услуг  
4. **Pricelist** — тарифы по классам авто  
5. **Value props** — «Почему мы»  
6. **Before / After** — кейсы работ  
7. **Comfort** — зона ожидания  
8. **Reviews** — отзывы + рейтинг Яндекс  
9. **Contacts** — адрес, телефон, соцсети, карта  
10. **Footer**

Якоря: `#services` · `#pricelist` · `#value-props` · `#before-after` · `#contacts`

---

## Стек и стили

- **Astro 7**, статическая сборка  
- Scoped CSS в компонентах + CSS-переменные в `global.css`  
- Шрифты: **Outfit** (Google Fonts) + **Geist** (локальный `woff2`)  
- Без Tailwind и UI-библиотек  

Дизайн-токены (фрагмент):

```css
--bg: #0a0a0c;
--surface: #19191d;
--accent: #bfff00;
--muted: #a1a1aa;
```

---

## Что пока заглушки

- CTA ведут на `#contacts` или `tel:+79123940485`  
- VK / Telegram — ссылки `#`  
- Карта — статичный PNG из макета (не виджет Яндекс.Карт)  
- Онлайн-запись / формы / аналитика — вне текущего scope  

---

## Сборка и деплой

```bash
npm run build
```

Артефакт: папка `dist/`.

### GitHub Pages

Сайт публикуется через GitHub Actions по [инструкции Astro](https://docs.astro.build/en/guides/deploy/github/).

- URL: **https://hhrum.github.io/autolux-landing/**
- Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- В `astro.config.mjs`: `site` + `base: '/autolux-landing'`

После пуша в `main` открой **Settings → Pages** и выбери Source: **GitHub Actions** (один раз).

---

## Админка (`/admin`)

Мобильный редактор контента. Публикация идёт через GitHub API (Octokit) в ветку `draft`, затем merge в `main` (PR merge). Ключи — в `.env` / `.env.example` (`VITE_GH_*`).

**Безопасность (POC):** `VITE_GH_TOKEN` попадает в клиентский бандл админки — только для закрытого POC. В проде нужен свой REST API и server-side token (`RestApiAdapter` вместо `GitHubOctokitAdapter`). Не коммитьте `.env`.

Картинки в этой итерации: локальная замена только для превью, в Git не пушатся.

---

## Документация Astro

- [Routing](https://docs.astro.build/en/guides/routing/)  
- [Components](https://docs.astro.build/en/basics/astro-components/)  
- [Styling](https://docs.astro.build/en/guides/styling/)  
- [Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)  
