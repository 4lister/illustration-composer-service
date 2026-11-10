import type { Palette } from '../types'

/**
 * Source SVG library is authored in the purple scheme.
 * Recolor maps these canonical fills onto the active palette roles.
 */
export const SOURCE_COLOR_ROLES: Record<string, keyof Palette['colors']> = {
  '#181817': 'outline',
  '#F9ECB0': 'cream',
  '#F9A3AA': 'accent',
  '#FFE3E1': 'accentSoft',
  '#D7CDF5': 'tint',
  '#AA9BF0': 'tintMid',
  '#7864D7': 'tintStrong',
}

/** Extra fills that appear in some S / teal example assets */
export const EXTRA_SOURCE_MAP: Record<string, keyof Palette['colors']> = {
  '#80DADA': 'secondary',
  '#BEEBEB': 'bg',
  '#D27532': 'bgStrong',
  '#FAC896': 'bgMid',
  '#FDD7B9': 'bg',
  '#5ABEBE': 'bgStrong',
  '#6D7BFC': 'accent',
  '#B6C6FE': 'accentSoft',
  '#FFD4F2': 'cream',
}

export const PALETTES: Palette[] = [
  {
    id: 'purple',
    name: 'Purple',
    nameRu: 'Фиолетовая',
    colors: {
      outline: '#181817',
      cream: '#F9ECB0',
      accent: '#F9A3AA',
      accentSoft: '#FFE3E1',
      tint: '#D7CDF5',
      tintMid: '#AA9BF0',
      tintStrong: '#7864D7',
      bg: '#D7CDF5',
      bgMid: '#AA9BF0',
      bgStrong: '#7864D7',
      secondary: '#AA9BF0',
    },
  },
  {
    id: 'orange',
    name: 'Orange',
    nameRu: 'Оранжевая',
    colors: {
      outline: '#181817',
      cream: '#F9ECB0',
      accent: '#D27532',
      accentSoft: '#FAC896',
      tint: '#FDD7B9',
      tintMid: '#FAC896',
      tintStrong: '#D27532',
      bg: '#FDD7B9',
      bgMid: '#FAC896',
      bgStrong: '#D27532',
      secondary: '#80DADA',
    },
  },
  {
    id: 'teal',
    name: 'Teal',
    nameRu: 'Бирюзовая',
    colors: {
      outline: '#181817',
      cream: '#FFD4F2',
      accent: '#6D7BFC',
      accentSoft: '#B6C6FE',
      tint: '#BEEBEB',
      tintMid: '#80DADA',
      tintStrong: '#5ABEBE',
      bg: '#BEEBEB',
      bgMid: '#80DADA',
      bgStrong: '#5ABEBE',
      secondary: '#80DADA',
    },
  },
]

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0]
}
