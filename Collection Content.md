# Content Collections — «база данных» лендинга

Весь редактируемый текст и медиа лендинга живут в **Astro Content Collections**. Это не SQL-база: файлы Markdown/JSON на диске, которые Astro валидирует по схемам и отдаёт компонентам через `getCollection` / `getEntry`.

После правок контента достаточно обновить страницу в Dev-сервере (при необходимости перезапустите: `astro dev stop` → `astro dev --background`).

---

## Карта: что где править

| Что меняете | Файл / папка | Формат |
|---|---|---|
| Услуги (карточки) | `src/content/services/*.md` | Markdown |
| Тарифы / прайс | `src/content/plans/*.md` | Markdown |
| Отзывы | `src/content/reviews/*.md` | Markdown |
| Заголовки секций (badge, title) | `src/data/sections.json` | JSON |
| Бренд, телефон, логотип | `src/data/brand.json` | JSON |
| Меню в шапке | `src/data/navigation.json` | JSON |
| Hero (первый экран) | `src/data/hero.json` | JSON |
| Преимущества | `src/data/value-props.json` | JSON |
| До / После | `src/data/before-after.json` | JSON |
| Зона комфорта | `src/data/comfort.json` | JSON |
| Контакты, соцсети, карта | `src/data/contacts.json` | JSON |
| Копирайт в футере | `src/data/footer.json` | JSON |
| Картинки | `src/assets/images/` | PNG и др. |
| Схемы и список коллекций | `src/content.config.ts` | TypeScript |
| Хелперы чтения | `src/lib/content.ts` | TypeScript |

Компоненты в `src/components/*.astro` **не** содержат маркетинговый текст — только разметку и стили. Текст берётся из коллекций.

---

## Как это устроено

```
src/
├── content.config.ts          ← реестр коллекций + Zod-схемы
├── content/                   ← Markdown-коллекции (списки)
│   ├── services/
│   ├── plans/
│   └── reviews/
├── data/                      ← JSON-коллекции (конфиг и списки без body)
├── assets/images/             ← картинки, на которые ссылаются поля image / before / after
└── lib/content.ts             ← getSingleton(), getSection()
```

1. **`src/content.config.ts`** описывает каждую коллекцию: откуда грузить файлы (`glob` / `file`) и какая у них схема.
2. Astro при `dev` / `build` читает файлы, проверяет схему, кладёт данные в content store.
3. Компоненты запрашивают данные через `astro:content` и хелперы из `src/lib/content.ts`.

Документация Astro: [Content collections](https://docs.astro.build/en/guides/content-collections/).

---

## Markdown-коллекции (услуги, тарифы, отзывы)

Один файл = одна запись. Имя файла без `.md` становится `id` записи (`express.md` → `express`).

### Общий шаблон

```md
---
# frontmatter — структурированные поля (см. схему коллекции)
order: 1
---

Текст тела (body). Для услуг и отзывов — описание/текст отзыва.
Для тарифов — доп. строка под таблицей цен.
```

Поле **`order`** задаёт порядок на странице (меньше = выше). Без него порядок не гарантирован.

### `src/content/services/` — блок «Услуги»

| Поле | За что отвечает |
|---|---|
| `title` | Название услуги |
| `price` | Цена («от 600 ₽») |
| `image` | Путь к картинке относительно md-файла |
| `href` | Ссылка «Подробнее» |
| `order` | Порядок карточек |
| **body** | Описание под заголовком |

Пример пути к картинке: `../../assets/images/service-express.png`.

**Добавить услугу:** скопируйте любой `.md` в папке, поменяйте поля и `order`, положите картинку в `src/assets/images/`.

**Удалить:** удалите соответствующий `.md` (и картинку, если больше не нужна).

### `src/content/plans/` — блок «Тарифы»

| Поле | За что отвечает |
|---|---|
| `name` | Название тарифа |
| `from` | Цена «от …» в шапке карточки |
| `featured` | `true` — выделенная карточка (акцентная рамка) |
| `rows` | Строки прайса: `label` + `price` |
| `order` | Порядок карточек |
| **body** | Текст под таблицей (акции, примечания; переносы строк сохраняются) |

### `src/content/reviews/` — блок «Отзывы»

| Поле | За что отвечает |
|---|---|
| `name` | Имя клиента |
| `car` | Автомобиль |
| `rating` | Рейтинг для десктопа (`5.0 ★★★★★`) |
| `ratingShort` | Короткий рейтинг для мобилки (`5.0 ★`) |
| `order` | Порядок карточек |
| **body** | Текст отзыва |

Заголовок секции отзывов и общий рейтинг Яндекса — в `sections.json` → ключ `reviews`.

---

## JSON-коллекции

### `sections.json` — заголовки секций

Ключ объекта = id секции. Общие поля: `badge`, `title`.

| Ключ | Секция на сайте |
|---|---|
| `services` | Услуги |
| `pricelist` | Тарифы |
| `valueProps` | Преимущества |
| `beforeAfter` | До / После |
| `comfort` | Зона ожидания |
| `reviews` | Отзывы (+ `titleShort`, `rating`, `ratingShort`) |
| `contacts` | Контакты |

Менять только текст. Не переименовывайте ключи без правки компонентов (`getSection('…')`).

### `brand.json` — бренд

Используется в шапке и футере: `name`, `tagline`, `phone`, `phoneHref`, `logo`.

`phoneHref` — ссылка вида `tel:+79123940485` (без пробелов и скобок).

### `navigation.json` — меню

Массив пунктов: `id`, `label`, `href`, `order`.  
`href` обычно якорный (`#services`). Порядок сортируется по `order`.

### `hero.json` — первый экран

| Поле | За что отвечает |
|---|---|
| `image` | Фоновая картинка |
| `badge` | Плашка над заголовком |
| `titleBefore` / `titleAccent` / `titleAfter` | Заголовок: обычный + акцентный фрагмент + хвост |
| `description` | Подзаголовок |
| `primaryCta` / `secondaryCta` | Кнопки: `label` + `href` |
| `stats` | Нижняя полоса: `label` + `value` |

### `value-props.json` — преимущества

Массив карточек: `id`, `icon`, `title`, `description`, `order`.

Допустимые `icon`: `shield`, `sparkles`, `wind`, `clock` (должны совпадать с именами в `Icon.astro`).

### `before-after.json` — кейсы «До / После»

Массив: `id`, `title`, `description`, `before`, `after`, `order`.  
`before` / `after` — пути к картинкам относительно `src/data/` (например `../assets/images/before-seats.png`).

### `comfort.json` — зона ожидания

`image`, `description`, `amenities` (массив строк-буллетов).  
Заголовок секции — в `sections.json` → `comfort`.

### `contacts.json` — контакты

| Поле | За что отвечает |
|---|---|
| `map` | Картинка карты |
| `items` | Адрес / телефон / режим: `icon`, `label`, `value`, опционально `valueShort`, `href` |
| `socials` | Кнопки соцсетей: `label`, `href`, `variant` (`vk` \| `tg`) |

Иконки пунктов: `map`, `phone`, `clock`.

### `footer.json`

Только `copyright`.

---

## Картинки

1. Положите файл в `src/assets/images/`.
2. В JSON/MD укажите **относительный** путь от файла контента до картинки.
3. Схема с `image()` проверяет, что файл существует, и отдаёт объекту `.src` для `<img>`.

| Контент | Пример пути к картинке |
|---|---|
| `src/content/services/*.md` | `../../assets/images/service-express.png` |
| `src/data/*.json` | `../assets/images/hero.png` |

---

## Связь секций и компонентов

| Блок на странице | Компонент | Источники данных |
|---|---|---|
| Шапка | `Header.astro` | `brand`, `navigation` |
| Hero | `Hero.astro` | `hero` |
| Услуги | `Services.astro` | `sections.services` + `services` |
| Тарифы | `Pricelist.astro` | `sections.pricelist` + `plans` |
| Преимущества | `ValueProps.astro` | `sections.valueProps` + `valueProps` |
| До / После | `BeforeAfter.astro` | `sections.beforeAfter` + `beforeAfter` |
| Комфорт | `Comfort.astro` | `sections.comfort` + `comfort` |
| Отзывы | `Reviews.astro` | `sections.reviews` + `reviews` |
| Контакты | `Contacts.astro` | `sections.contacts` + `contacts` |
| Футер | `Footer.astro` | `brand`, `footer` |

Хелперы:

- `getSingleton('hero' | 'brand' | …)` — единственная запись из JSON-файла.
- `getSection('services' | …)` — метаданные секции из `sections.json`.

---

## Типичные задачи

**Поменять телефон везде**  
`brand.json` (`phone`, `phoneHref`) и при необходимости строку в `contacts.json` → `items` с `icon: "phone"`.

**Добавить отзыв**  
Новый файл в `src/content/reviews/`, выставить `order`.

**Изменить цены тарифа**  
Открыть нужный `.md` в `src/content/plans/`, править `rows` и/или `from`.

**Сменить заголовок секции**  
Только `src/data/sections.json`, без правки Astro-компонентов.

**Добавить пункт меню**  
Запись в `navigation.json` + якорь `id="…"` на секции (если якоря ещё нет).

---

## Если что-то сломалось

- Ошибка схемы / «Missing content…» — проверьте поля по `src/content.config.ts` и что файлы на месте.
- После смены `content.config.ts` перезапустите Dev: `astro dev stop` → `astro dev --background`.
- Неверный путь к картинке — Astro ругнётся на `image()` при sync/build.
- Порядок карточек «скачет» — задайте уникальные `order` и не полагайтесь на порядок файлов на диске.
