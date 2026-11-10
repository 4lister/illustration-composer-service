import { findObject } from '../data/library'
import type { CanvasFormat, CanvasItem, LibraryObject, VariantId } from '../types'

let uidSeq = 0
export function nextUid(): string {
  uidSeq += 1
  return `item-${Date.now().toString(36)}-${uidSeq}`
}

interface Slot {
  xRatio: number
  yRatio: number
  scale: number
  rotation: number
  variant: VariantId
}

/** Relative layout slots for auto-composition (proportions preserved per object). */
const SLOTS_BY_FORMAT: Record<string, Slot[]> = {
  square: [
    { xRatio: 0.18, yRatio: 0.28, scale: 0.28, rotation: -6, variant: 'main' },
    { xRatio: 0.48, yRatio: 0.22, scale: 0.32, rotation: 4, variant: 'main' },
    { xRatio: 0.55, yRatio: 0.52, scale: 0.22, rotation: -3, variant: 'main' },
    { xRatio: 0.12, yRatio: 0.58, scale: 0.2, rotation: 8, variant: 'bg' },
    { xRatio: 0.72, yRatio: 0.62, scale: 0.18, rotation: -10, variant: 'bg' },
  ],
  wide: [
    { xRatio: 0.08, yRatio: 0.22, scale: 0.22, rotation: -4, variant: 'main' },
    { xRatio: 0.38, yRatio: 0.12, scale: 0.26, rotation: 3, variant: 'main' },
    { xRatio: 0.62, yRatio: 0.28, scale: 0.2, rotation: -2, variant: 'main' },
    { xRatio: 0.78, yRatio: 0.45, scale: 0.16, rotation: 6, variant: 'bg' },
    { xRatio: 0.22, yRatio: 0.55, scale: 0.14, rotation: -8, variant: 'bg' },
  ],
  tall: [
    { xRatio: 0.18, yRatio: 0.12, scale: 0.28, rotation: -5, variant: 'main' },
    { xRatio: 0.28, yRatio: 0.38, scale: 0.3, rotation: 4, variant: 'main' },
    { xRatio: 0.2, yRatio: 0.62, scale: 0.24, rotation: -3, variant: 'main' },
    { xRatio: 0.55, yRatio: 0.2, scale: 0.18, rotation: 10, variant: 'bg' },
    { xRatio: 0.5, yRatio: 0.72, scale: 0.16, rotation: -12, variant: 'bg' },
  ],
}

export function composeObjects(
  objects: LibraryObject[],
  format: CanvasFormat,
  options?: { includeBackground?: boolean },
): CanvasItem[] {
  const includeBg = options?.includeBackground ?? true
  const slots = SLOTS_BY_FORMAT[format.id] ?? SLOTS_BY_FORMAT.square
  const mainObjs = objects.slice(0, 3)
  const bgCandidates = objects.slice(3)

  // Prefer vase/block/chip as background decoration when available
  const decor = (bgCandidates.length ? bgCandidates : objects)
    .filter((o) => ['vase', 'block', 'chip', 'lamp', 'folder'].includes(o.id))
    .slice(0, 2)

  const planned: { obj: LibraryObject; slot: Slot }[] = []
  mainObjs.forEach((obj, i) => {
    const slot = slots.filter((s) => s.variant === 'main')[i] ?? slots[i]
    if (slot) planned.push({ obj, slot: { ...slot, variant: 'main' } })
  })

  if (includeBg) {
    decor.forEach((obj, i) => {
      const slot = slots.filter((s) => s.variant === 'bg')[i]
      if (slot && !planned.some((p) => p.obj.id === obj.id && p.slot.variant === 'bg')) {
        planned.push({ obj, slot })
      }
    })
  }

  return planned.map(({ obj, slot }, index) => {
    const meta = findObject(obj.id) ?? obj
    const drawW = meta.width * slot.scale
    const drawH = meta.height * slot.scale
    return {
      uid: nextUid(),
      objectId: obj.id,
      variant: slot.variant,
      x: slot.xRatio * format.width - drawW / 2,
      y: slot.yRatio * format.height - drawH / 2,
      scale: slot.scale,
      rotation: slot.rotation,
      zIndex: slot.variant === 'bg' ? index : index + 10,
    }
  })
}

export function createManualItem(
  objectId: string,
  format: CanvasFormat,
  variant: VariantId = 'main',
  existingCount = 0,
): CanvasItem {
  const meta = findObject(objectId)
  const scale = format.id === 'wide' ? 0.2 : format.id === 'tall' ? 0.24 : 0.26
  const w = (meta?.width ?? 400) * scale
  const h = (meta?.height ?? 400) * scale
  const offset = (existingCount % 5) * 28
  return {
    uid: nextUid(),
    objectId,
    variant,
    x: format.width / 2 - w / 2 + offset,
    y: format.height / 2 - h / 2 + offset,
    scale,
    rotation: 0,
    zIndex: 20 + existingCount,
  }
}
