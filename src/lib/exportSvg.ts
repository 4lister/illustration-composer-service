import { backgroundPath } from '../data/library'
import { getPalette } from '../data/palettes'
import { findObject } from '../data/library'
import { assetPath } from '../data/library'
import type { CanvasFormat, CanvasItem, PaletteId, SizeId } from '../types'
import { injectSvgRootAttrs, recolorSvg, stripXmlNsNoise } from './recolor'

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load ${url}`)
  return res.text()
}

export async function buildExportSvg(params: {
  items: CanvasItem[]
  format: CanvasFormat
  size: SizeId
  paletteId: PaletteId
  background: boolean
}): Promise<string> {
  const { items, format, size, paletteId, background } = params
  const palette = getPalette(paletteId)
  const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex)

  const parts: string[] = []

  if (background) {
    try {
      const bgRaw = stripXmlNsNoise(await fetchText(backgroundPath(size, paletteId)))
      const bg = injectSvgRootAttrs(recolorSvg(bgRaw, palette, 'main'), {
        width: String(format.width),
        height: String(format.height),
        x: '0',
        y: '0',
        preserveAspectRatio: 'none',
      })
      // nest as group with scaled content if needed
      parts.push(`<g data-role="background">${bg}</g>`)
    } catch {
      parts.push(
        `<rect width="${format.width}" height="${format.height}" fill="${palette.colors.bg}"/>`,
      )
    }
  } else {
    parts.push(
      `<rect width="${format.width}" height="${format.height}" fill="${palette.colors.bg}"/>`,
    )
  }

  for (const item of sorted) {
    const meta = findObject(item.objectId)
    if (!meta) continue
    const raw = stripXmlNsNoise(await fetchText(assetPath(item.objectId, size, item.variant)))
    const recolored = recolorSvg(raw, palette, item.variant)
    const w = meta.width * item.scale
    const h = meta.height * item.scale
    const nested = injectSvgRootAttrs(recolored, {
      width: String(w),
      height: String(h),
      x: '0',
      y: '0',
      overflow: 'visible',
    })
    parts.push(
      `<g data-object="${item.objectId}" data-variant="${item.variant}" transform="translate(${item.x} ${item.y}) rotate(${item.rotation} ${w / 2} ${h / 2})">${nested}</g>`,
    )
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${format.width}" height="${format.height}" viewBox="0 0 ${format.width} ${format.height}" fill="none">
${parts.join('\n')}
</svg>`
}

export function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
