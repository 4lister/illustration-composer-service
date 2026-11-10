import { EXTRA_SOURCE_MAP, SOURCE_COLOR_ROLES } from '../data/palettes'
import type { Palette, PaletteColors } from '../types'

const COLOR_ATTR = /(fill|stroke)=["'](#?[A-Fa-f0-9]{3,8}|none|transparent|white|black)["']/gi
const STYLE_COLOR = /((?:fill|stroke)\s*:\s*)(#[A-Fa-f0-9]{3,8}|[a-z]+)/gi

function normalizeHex(value: string): string | null {
  const v = value.trim().toLowerCase()
  if (v === 'none' || v === 'transparent' || v === 'white' || v === 'black') return null
  if (!v.startsWith('#')) return null
  if (v.length === 4) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`.toUpperCase()
  }
  return v.toUpperCase()
}

function roleForSource(hex: string): keyof PaletteColors | null {
  return SOURCE_COLOR_ROLES[hex] ?? EXTRA_SOURCE_MAP[hex] ?? null
}

export function recolorSvg(svgText: string, palette: Palette, mode: 'main' | 'bg' = 'main'): string {
  const colors = palette.colors

  const mapColor = (raw: string): string => {
    const hex = normalizeHex(raw)
    if (!hex) return raw
    const role = roleForSource(hex)
    if (!role) return raw

    if (mode === 'bg') {
      // Background objects stay monochrome within the palette tint family
      if (role === 'outline' || role === 'tintStrong' || role === 'bgStrong') return colors.tintStrong
      return colors.tint
    }

    return colors[role]
  }

  let out = svgText.replace(COLOR_ATTR, (_m, attr: string, value: string) => {
    if (/^none$/i.test(value) || /^transparent$/i.test(value)) return `${attr}="${value}"`
    return `${attr}="${mapColor(value)}"`
  })

  out = out.replace(STYLE_COLOR, (_m, prefix: string, value: string) => {
    if (/^none$/i.test(value) || /^transparent$/i.test(value)) return `${prefix}${value}`
    return `${prefix}${mapColor(value)}`
  })

  return out
}

export function injectSvgRootAttrs(svgText: string, attrs: Record<string, string>): string {
  return svgText.replace(/<svg\b([^>]*)>/i, (_m, existing: string) => {
    const cleaned = existing
      .replace(/\s(width|height)=["'][^"']*["']/gi, '')
      .replace(/\s(x|y)=["'][^"']*["']/gi, '')
    const extra = Object.entries(attrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ')
    return `<svg${cleaned} ${extra}>`
  })
}

export function stripXmlNsNoise(svgText: string): string {
  return svgText
    .replace(/<\?xml[^>]*>/i, '')
    .replace(/<!DOCTYPE[^>]*>/i, '')
    .trim()
}
