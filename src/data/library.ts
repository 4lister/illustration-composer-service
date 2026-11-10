import type { CanvasFormat, LibraryObject, SizeId, VariantId } from '../types'

export const LIBRARY: LibraryObject[] = [
  {
    id: 'book',
    name: 'Notebook',
    nameRu: 'Книга',
    tags: ['книга', 'блокнот', 'тетрадь', 'записи', 'учёба', 'знание', 'чтение', 'идеи', 'заметки', 'notebook', 'book'],
    width: 1446,
    height: 977,
  },
  {
    id: 'phone',
    name: 'Phone',
    nameRu: 'Телефон',
    tags: ['телефон', 'смартфон', 'мобильный', 'приложение', 'экран', 'связь', 'цифровой', 'phone', 'mobile', 'app'],
    width: 797,
    height: 462,
  },
  {
    id: 'puzzle',
    name: 'Puzzle',
    nameRu: 'Пазлы',
    tags: ['пазл', 'пазлы', 'головоломка', 'решение', 'сборка', 'части', 'интеграция', 'puzzle', 'fit'],
    width: 545,
    height: 314,
  },
  {
    id: 'coin',
    name: 'Coin',
    nameRu: 'Монета',
    tags: ['монета', 'деньги', 'финансы', 'оплата', 'экономика', 'бюджет', 'coin', 'money', 'finance'],
    width: 287,
    height: 189,
  },
  {
    id: 'headphones',
    name: 'Headphones',
    nameRu: 'Наушники',
    tags: ['наушники', 'музыка', 'звук', 'аудио', 'подкаст', 'слушание', 'headphones', 'music', 'audio'],
    width: 889,
    height: 692,
  },
  {
    id: 'lamp',
    name: 'Lamp',
    nameRu: 'Лампа',
    tags: ['лампа', 'свет', 'идея', 'озарение', 'вдохновение', 'работа', 'lamp', 'light', 'idea'],
    width: 946,
    height: 1129,
  },
  {
    id: 'wallet',
    name: 'Wallet',
    nameRu: 'Кошелёк',
    tags: ['кошелёк', 'кошелек', 'деньги', 'карта', 'платёж', 'финансы', 'wallet', 'payment'],
    width: 631,
    height: 397,
  },
  {
    id: 'folder',
    name: 'Folder',
    nameRu: 'Папка',
    tags: ['папка', 'документы', 'файлы', 'архив', 'организация', 'офис', 'folder', 'files', 'docs'],
    width: 1241,
    height: 659,
  },
  {
    id: 'pen',
    name: 'Pen',
    nameRu: 'Ручка',
    tags: ['ручка', 'письмо', 'подпись', 'контент', 'творчество', 'pen', 'write', 'writing'],
    width: 509,
    height: 286,
  },
  {
    id: 'vase',
    name: 'Vase',
    nameRu: 'Ваза',
    tags: ['ваза', 'цветы', 'декор', 'дом', 'уют', 'фон', 'vase', 'flowers', 'decor'],
    width: 723,
    height: 489,
  },
  {
    id: 'block',
    name: 'Block',
    nameRu: 'Блок',
    tags: ['блок', 'геометрия', 'подставка', 'фон', 'форма', 'block', 'shape'],
    width: 621,
    height: 330,
  },
  {
    id: 'chip',
    name: 'Chip',
    nameRu: 'Чип',
    tags: ['чип', 'кнопка', 'метка', 'бейдж', 'акцент', 'chip', 'badge', 'button'],
    width: 255,
    height: 143,
  },
]

export const FORMATS: CanvasFormat[] = [
  { id: 'square', name: 'Квадрат', width: 1000, height: 1000 },
  { id: 'wide', name: 'Широкий', width: 1200, height: 630 },
  { id: 'tall', name: 'Высокий', width: 630, height: 1200 },
]

export function assetPath(objectId: string, size: SizeId, variant: VariantId): string {
  return `/library/${size}/${variant}/${objectId}.svg`
}

export function backgroundPath(size: SizeId, paletteId: string): string {
  return `/library/backgrounds/${size}-${paletteId}.svg`
}

export function findObject(id: string): LibraryObject | undefined {
  return LIBRARY.find((o) => o.id === id)
}

export function findObjectByName(query: string): LibraryObject | undefined {
  const q = query.trim().toLowerCase()
  return LIBRARY.find(
    (o) =>
      o.id === q ||
      o.name.toLowerCase() === q ||
      o.nameRu.toLowerCase() === q ||
      o.tags.some((t) => t.toLowerCase() === q),
  )
}
