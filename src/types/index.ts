export type SizeId = 'L' | 'S'
export type VariantId = 'main' | 'bg'
export type FormatId = 'square' | 'wide' | 'tall'
export type PaletteId = string

export interface PaletteColors {
  outline: string
  cream: string
  accent: string
  accentSoft: string
  tint: string
  tintMid: string
  tintStrong: string
  bg: string
  bgMid: string
  bgStrong: string
  secondary: string
}

export interface Palette {
  id: PaletteId
  name: string
  nameRu: string
  colors: PaletteColors
}

export interface LibraryObject {
  id: string
  name: string
  nameRu: string
  tags: string[]
  /** Natural width/height from L main SVG viewBox for layout */
  width: number
  height: number
}

export interface CanvasItem {
  uid: string
  objectId: string
  variant: VariantId
  x: number
  y: number
  scale: number
  rotation: number
  zIndex: number
}

export interface CanvasFormat {
  id: FormatId
  name: string
  width: number
  height: number
}
