# Конструктор иллюстраций

Многослойное конструктор SVG-иллюстраций с поддержкой композиции объектов по метафоре или набору именованных графических элементов.

---

## 🚀 Быстрый старт

### Установка и запуск 

```bash
npm install && npm run dev
```

Откройте `http://localhost:5173` в браузере для просмотра приложения.

---

### Сборка для продакшена

```bash
npm run build
```

После сборки готовый `dist` сжатые файлы (HTML + SVG) находятся в директории `dist/` — их можно развернуть на любом сервере, который может отдавать статический контент.

---

### 🧪 UI-валидация работы фильтра decorative objects

После запуска проекта через `npm run dev` проведите проверку фильтра декоративных объектов:

1. **Откройте** `http://localhost:5173` в браузере.
2. **Создайте композицию** по метафоре, например: `'музыкальный стартап ищет инвестиции'`.
3. **Проверьте слот декоративных объектов**: должны отображаться **только** объекты с ID из списка `['vase', 'block', 'chip', 'lamp', 'folder']`.
4. **Проверьте отсутствие не-декоративных объектов**: объекты `book`, `phone` и другие должны **не появляться** в фоне/декоре.

Это обеспечивает корректную фильтрацию согласно исправлению в `src/lib/compose.ts`.

---

---

## 📁 Архитектура проекта

Проект имеет модульную структуру: __SVG-библиотека__ отделена от логики. Это позволяет легко масштабировать набор графических примитивов и логическое ядро — добавлять новые методы обработки или алгоритмы подбора объектов без изменения друг друга.

```javascript
illustration-constructor/
├── index.html                 # Главный HTML-файл
├── vite.config.ts            # Конфигурация Vite для сборки и препроцессинга SVG
├── tsconfig.json             # Базовый конфиг TypeScript для всего проекта
├── package.json              # Зависимости и скрипты проекта
├── README.md                 # Документация (этот файл)
├── src/
│   ├── main.tsx              # Точка входа приложения — компонент App с состоянием
│   ├── App.css               # Стили для основного контента
│   ├── index.css             # Глобальные переменные, сброс, базовые стили
│   │
│   ├── components/           # React-компоненты (Canvas, Sidebar, etc.)
│   │   ├── Canvas.tsx        # Хранит состояние и рендеринг сцены
│   │   └── ...               # Дополнительные компоненты
│   │
│   ├── data/library.ts       # Конфигурация объектов SVG-библиотеки
│   │   ├── FORMATS           # Наборы размеров для экспорта
│   │   ├── OBJECTS           # Описание объектов из библиотеки
│   │   └── ...               # Дополнительные данные
│   │
│   ├── lib/                  # Локальные утилиты (без внешних API)
│   │   ├── compose.ts        # Методики композиции объектов в одну картинку
│   │   ├── exportSvg.ts      # Генерация SVG и скачивание файла
│   │   └── matchMetaphor.ts  # Алгоритмы подбора объектов по метафоре или именам
│   │
│   └── types.ts              # Типы данных проекта
├── public/
│   └── library/             # SVG-активы из библиотеки графических примитивов
│       ├── objects/          # Основные объекты (с ролью и размером)
│       ├── backgrounds/      # Фон под палитры
│       └── ...               # Дополнительные ресурсы
└── ...                      # Node модули
```

### Ключевые характеристики архитектуры

- __Модульность__: SVG-библиотека (`public/library/`) и бизнес-логика (`src/lib/`) отделены. Легко добавлять новые объекты, подходы к композиции или методы экспорта без изменения друг друга.
- __Типоизирование__: TypeScript используется с целью строгости типов. Все интерфейсы описаны в `types.ts`.
- __Локальность__: Нет внешних API вызовов — вся логика подбора объектов по метафоре находится локально. Проект работает офлайн после загрузки.
- __Универсальность__: Поддержка экспорта в различных размерах (`square`, `vertical`, `wide`), цветовых гаммах (`purple`, `orange`, `teal`) и с фоном/без фона.

---

## 🔧 Установка зависимостей

```bash
npm install react@^18 vite typescript @vitejs/plugin-react tailwindcss
```

> Примечание: В текущем проекте используется нативная сборка Vite с настраиваемой конфигурацией, без Tailwind. Подключенные зависимости указаны в `package.json`.

---

## 📚 Документация API / Модулей

### 1. Точка входа — `src/main.tsx`

Основной файл приложения, запускающий Vite и React приложение:

```typescript
import { render } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')
render(<App />, root)
```

### 2. Приложение — `src/App.tsx`

Компонент приложения с состоянием и рендерингом основных элементов:

- __Состояние__: `size`, `paletteId`, `formatId`, `showBackground`, `metaphor`, `names`, `items`, `selectedUid`.
- __Действия__: Композиция объектов по метафоре (`onComposeMetaphor`) или набору имен (`onComposeNames`).

```typescript
import { useState } from 'react'
// ...

const onComposeMetaphor = () => {
  const objs = matchMetaphor(metaphor, 5)
  if (!objs.length) return alert('Не удалось подобрать объекты по метафоре.')
  setItems(composeObjects(objs, format, { includeBackground: true }))
}
```

### 3. Библиотека объектов — `src/data/library.ts`

Файл с конфигурацией SVG-объектов. Содержит:

- __`FORMATS`__: Наборы размеров для экспорта (`square`, `vertical`, `wide`).
- __`OBJECTS`__: Описания объектов из библиотеки (роль `main/bg` и размер `L/S`).
- __`PALETTES`__: Наборы цветовых палитр.

```typescript
export const FORMATS: Array<{ id: FormatId; name: string }> = [...]

export const OBJECTS: Array<{
  id: string;
  role: 'main' | 'bg';
  size: 'L' | 'S';
}> = [...]

export const PALETTES: Record<PaletteId, { main: string; accent: string; muted: string; text: string }>
```

### 4. Композиция — `src/lib/compose.ts`

Локальная утилита для объединения объектов в одну композицию и вычисления их положений на холсте:

- __Вход__: Массив объектов, формат экспорта, флаг включения фона.
- __Выход__: Состояние CanvasItem с абсолютными позициями каждого объекта.

```typescript
import type { FormatId, LibraryObject } from '../types'

export function composeObjects(objects: Array<LibraryObject>, format: Format, includeBackground: boolean): Array<CanvasItem>
// ... implementation details
```

### 5. Экспорт — `src/lib/exportSvg.ts`

Генерация SVG-контента из состоятельного Canvas и скачивание файла через браузер:

- __Вход__: Состояние Canvas, формат экспорта.
- __Выход__: Методы `buildExportSvg()` (строка с SVG) и `downloadSvg()` (автоматическое скачивание).

```typescript
export function buildExportSvg(canvasState: CanvasItem[], format: Format): string

export function downloadSvg(svgContent: string, filename: string)
// ... implementation details
```

### 6. Подбор объектов — `src/lib/matchMetaphor.ts`

Локальные алгоритмы подбора объектов по метафоре или набору имен (без внешнего API):

- __`matchMetaphor`__: Находит объекты из библиотеки, соответствующие заданной метафоре.
- __`matchNames`__: По именованным графическим элементам (например: `книга`, `наушники`).

```typescript
export function matchMetaphor(metaphor: string, maxObjects: number): Array<LibraryObject>
export function matchNames(names: string): Array<LibraryObject>
// ... implementation details
```

### 7. Типы — `src/types.ts`

Декларация типов данных:

- __`CanvasItem`__: Компонент холста с абсолютными позициями.
- __`FormatId`__: ID формата экспорта (`square`, `vertical`, `wide`).
- __`LibraryObject`__: Описание объекта из библиотеки.
- __`PaletteId`__: ID цветовой палитры (`purple`, `orange`, `teal`).
- __`SizeId`__: Размер объектов (`L`, `S`).
- __`VariantId`__: Ветвление объектов (например, для вариантов размера).

```typescript
export type CanvasItem = { uid: string; x: number; y: number; ... }
export type FormatId = 'square' | 'vertical' | 'wide'
export type LibraryObject = { id: string; role: 'main' | 'bg'; size: 'L' | 'S'; ... }
// ...
```

---

## ⚙️ Конфигурация Vite и TypeScript

### `vite.config.ts`

Конфигурация сборочного инструмента:

- __Типы__: Включены для React JSX.
- __Плагины__: Настройка препроцессинга SVG для корректного импортирования файлов из `public/library/`.
- __Ассеты__: SVG файлы обрабатываются при сборке, превращаясь в импортируемые модули.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Aliases for library files if needed
    },
  },
})
```

### `tsconfig.json`

Базовая конфигурация TypeScript для всего проекта:

- __Цель компиляции__: ES2023.
- __Сборка__: Используется режим bundler (`moduleResolution: 'bundler'`).
- __Строгость типов__: Включены строгие правила без неопределённых имен и параметров.

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### `tsconfig.app.json` и `tsconfig.node.json`

Отдельные файлы для точечной сборки:

- __`tsconfig.app.json`__: Конфигурация для компонентов React (`src/`).
- __`tsconfig.node.json`__: Конфигурация для конфигурационных файлов проекта (например, `vite.config.ts`).

---

## 🎨 Настройки композиции и экспорта

### Форматы экспорта

| Формат | Описание | Использование | |---------|--------------------|------------------------| | square | Квадратная область | Соцсети (Instagram) | | vertical| Вертикальная область | Посты в вертикаль | | wide | Горизонтальная область | Панели, баннеры |

### Цветовые палитры

- __`purple`__: Фиолетовая гамма с теплыми оттенками.
- __`orange`__: Оранжевая палитра для энергичных иллюстраций.
- __`teal`__: Бирюзовая комбинация для современных дизайнов.

Каждая палитра включает основные и акцентные цвета, а также фоновые оттенки и текст на фоне.

### Размеры объектов

- __`L` (Large)__: Большие объекты — подходят в качестве фонового элемента или центрального объекта композиции.
- __`S` (Small)__: Маленькие элементы — используются для дополнительных деталей.

---

## 🔧 Использование API / модулей

### Пример: Создать композицию по метафоре

```typescript
// Включим метаданные в App.tsx
const metaphor = 'музыкальный стартап ищет инвестиции'

// Подбор объектов
const objs = matchMetaphor(metaphor, 5) // maxObjects=5

// Композиция в выбранном формате
const items = composeObjects(objs, formatId, { includeBackground: true })

// Скачивание готового SVG
downloadSvg(buildExportSvg(items, format), 'investiture.svg')
```

### Пример: Создать композицию по именам

```typescript
const names = 'книга, наушники, лампа'
const objs = matchNames(names) // Поиск объектов с данными именами
const items = composeObjects(objs, formatId, { includeBackground: true })
```

---

## 🐛 Troubleshooting

| Проблема | Решение | |------------------------------------|-----------------------------------------------------------| | Ошибка импорта SVG | Проверьте `public/library/objects/` на наличие корректных путей. | | Отсутствие объектов по метафоре | Попробуйте более простые слова или добавьте новые в `src/data/library.ts`. | | Все объекты отображаются в декоративном слоте (кроме decor) | Убедитесь, что в `compose.ts` фильтр использует `includes` против списка `['vase', 'block', 'chip', 'lamp', 'folder']` вместо тавтологии. | | Неверные цвета | Убедитесь, что палитра выбрана корректно при экспорте. | | Ошибка TypeScript | Перезапустите компиляцию через `npm run dev` или `npm run build`. |

---

## 📦 Форматирование и линтинг

Проект включает в себя строгие правила линтера TypeScript:

- __`noUnusedLocals`__: Неопределённые переменные вызывают ошибку.
- __`noUnusedParameters`__: Без использования параметры вызовут компиляцию с ошибкой.
- __`verbatimModuleSyntax`__: Использование `import/export` без синтаксической трансформации.

---

## 🛠️ Развертывание

Сборка проекта выполняется автоматически через Vite:

```bash
npm run build
```

После сборки в директории `dist/` находятся:

- __`index.html`__ — готовый HTML с подключенными стилями и скриптом.
- __`/static/**`__ — обработанные SVG файлы, превращённые в модули (можно использовать как CSS импорты).

Развёртывание на любом сервере или хостинге статического контента (например, GitHub Pages, Netlify, Vercel).

---

## 📜 Лицензия

MIT License — см. файл `LICENSE` в корне проекта.