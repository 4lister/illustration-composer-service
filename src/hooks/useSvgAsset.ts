import { useEffect, useState } from 'react'
import { getPalette } from '../data/palettes'
import { recolorSvg, stripXmlNsNoise } from '../lib/recolor'
import type { PaletteId, VariantId } from '../types'

const cache = new Map<string, string>()

export function useSvgAsset(
  path: string | null,
  paletteId: PaletteId,
  variant: VariantId = 'main',
): { svg: string | null; error: string | null } {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!path) {
      setSvg(null)
      return
    }

    let cancelled = false
    const load = async () => {
      try {
        let raw = cache.get(path)
        if (!raw) {
          const res = await fetch(path)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          raw = stripXmlNsNoise(await res.text())
          cache.set(path, raw)
        }
        if (cancelled) return
        const palette = getPalette(paletteId)
        setSvg(recolorSvg(raw, palette, variant))
        setError(null)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'load error')
          setSvg(null)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [path, paletteId, variant])

  return { svg, error }
}
