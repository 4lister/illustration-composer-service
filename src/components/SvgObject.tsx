import { useSvgAsset } from '../hooks/useSvgAsset'
import type { PaletteId, SizeId, VariantId } from '../types'
import { assetPath } from '../data/library'

interface Props {
  objectId: string
  size: SizeId
  variant: VariantId
  paletteId: PaletteId
  width: number
  height: number
  className?: string
}

export function SvgObject({ objectId, size, variant, paletteId, width, height, className }: Props) {
  const path = assetPath(objectId, size, variant)
  const { svg, error } = useSvgAsset(path, paletteId, variant)

  if (error) {
    return (
      <div className={className} style={{ width, height, opacity: 0.4 }}>
        !
      </div>
    )
  }

  if (!svg) {
    return <div className={`svg-skeleton ${className ?? ''}`} style={{ width, height }} />
  }

  return (
    <div
      className={className}
      style={{ width, height, lineHeight: 0 }}
      dangerouslySetInnerHTML={{
        __html: svg.replace(
          /<svg\b([^>]*)>/i,
          `<svg$1 width="${width}" height="${height}" style="width:100%;height:100%;display:block" preserveAspectRatio="xMidYMid meet">`,
        ),
      }}
    />
  )
}
