import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { backgroundPath, findObject } from '../data/library'
import { useSvgAsset } from '../hooks/useSvgAsset'
import type { CanvasFormat, CanvasItem, PaletteId, SizeId } from '../types'
import { SvgObject } from './SvgObject'

interface Props {
  items: CanvasItem[]
  format: CanvasFormat
  size: SizeId
  paletteId: PaletteId
  showBackground: boolean
  selectedUid: string | null
  onSelect: (uid: string | null) => void
  onChangeItem: (uid: string, patch: Partial<CanvasItem>) => void
}

export function Canvas({
  items,
  format,
  size,
  paletteId,
  showBackground,
  selectedUid,
  onSelect,
  onChangeItem,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [drag, setDrag] = useState<{
    uid: string
    startX: number
    startY: number
    origX: number
    origY: number
  } | null>(null)

  const bgPath = showBackground ? backgroundPath(size, paletteId) : null
  const { svg: bgSvg } = useSvgAsset(bgPath, paletteId, 'main')

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const update = () => {
      const pad = 32
      const s = Math.min((el.clientWidth - pad) / format.width, (el.clientHeight - pad) / format.height, 1)
      setScale(Number.isFinite(s) && s > 0 ? s : 1)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [format.height, format.width])

  const toLocal = useCallback(
    (clientX: number, clientY: number) => {
      const el = stageRef.current
      if (!el) return { x: 0, y: 0 }
      const rect = el.getBoundingClientRect()
      const offsetX = (rect.width - format.width * scale) / 2
      const offsetY = (rect.height - format.height * scale) / 2
      return {
        x: (clientX - rect.left - offsetX) / scale,
        y: (clientY - rect.top - offsetY) / scale,
      }
    },
    [format.height, format.width, scale],
  )

  const onPointerDown = (e: ReactPointerEvent, item: CanvasItem) => {
    e.stopPropagation()
    onSelect(item.uid)
    const local = toLocal(e.clientX, e.clientY)
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    setDrag({
      uid: item.uid,
      startX: local.x,
      startY: local.y,
      origX: item.x,
      origY: item.y,
    })
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag) return
    const local = toLocal(e.clientX, e.clientY)
    onChangeItem(drag.uid, {
      x: drag.origX + (local.x - drag.startX),
      y: drag.origY + (local.y - drag.startY),
    })
  }

  const onPointerUp = () => setDrag(null)

  const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className="canvas-wrap">
      <div
        ref={stageRef}
        className="canvas-stage"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={() => onSelect(null)}
      >
        <div
          className="canvas-scaler"
          style={{
            width: format.width * scale,
            height: format.height * scale,
          }}
        >
          <div
            className="canvas-inner"
            style={{
              width: format.width,
              height: format.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <div className="canvas-bg">
              {showBackground && bgSvg ? (
                <div
                  style={{ width: '100%', height: '100%' }}
                  dangerouslySetInnerHTML={{
                    __html: bgSvg.replace(
                      /<svg\b([^>]*)>/i,
                      `<svg$1 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%">`,
                    ),
                  }}
                />
              ) : (
                <div className="canvas-bg-fallback" data-palette={paletteId} />
              )}
            </div>

            {sorted.map((item) => {
              const meta = findObject(item.objectId)
              if (!meta) return null
              const w = meta.width * item.scale
              const h = meta.height * item.scale
              const selected = item.uid === selectedUid
              return (
                <div
                  key={item.uid}
                  className={`canvas-item${selected ? ' is-selected' : ''}${item.variant === 'bg' ? ' is-bg' : ''}`}
                  style={{
                    left: item.x,
                    top: item.y,
                    width: w,
                    height: h,
                    zIndex: item.zIndex,
                    transform: `rotate(${item.rotation}deg)`,
                  }}
                  onPointerDown={(e) => onPointerDown(e, item)}
                >
                  <SvgObject
                    objectId={item.objectId}
                    size={size}
                    variant={item.variant}
                    paletteId={paletteId}
                    width={w}
                    height={h}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <p className="canvas-hint">Перетаскивайте объекты · клик — выбор · экспорт сохраняет векторный SVG</p>
    </div>
  )
}
