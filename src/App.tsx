import { useCallback, useEffect, useMemo, useState } from 'react'
import { Canvas } from './components/Canvas'
import { Sidebar } from './components/Sidebar'
import { FORMATS, findObject } from './data/library'
import { composeObjects, createManualItem, nextUid } from './lib/compose'
import { buildExportSvg, downloadSvg } from './lib/exportSvg'
import { matchMetaphor, matchNames } from './lib/matchMetaphor'
import type { CanvasItem, FormatId, LibraryObject, PaletteId, SizeId, VariantId } from './types'

const PRESETS: Record<string, { metaphor: string; palette: PaletteId }> = {
  finance: { metaphor: 'кошелёк монета папка финансы оплата', palette: 'orange' },
  music: { metaphor: 'наушники музыка телефон подкаст', palette: 'teal' },
  study: { metaphor: 'книга лампа ручка учёба идеи', palette: 'purple' },
}

export default function App() {
  const [size, setSize] = useState<SizeId>('L')
  const [paletteId, setPaletteId] = useState<PaletteId>('purple')
  const [formatId, setFormatId] = useState<FormatId>('square')
  const [showBackground, setShowBackground] = useState(true)
  const [metaphor, setMetaphor] = useState('музыкальный стартап ищет инвестиции')
  const [names, setNames] = useState('книга, наушники, лампа')
  const [items, setItems] = useState<CanvasItem[]>([])
  const [selectedUid, setSelectedUid] = useState<string | null>(null)

  const format = useMemo(() => FORMATS.find((f) => f.id === formatId) ?? FORMATS[0], [formatId])

  const patchItem = useCallback((uid: string, patch: Partial<CanvasItem>) => {
    setItems((prev) => prev.map((i) => (i.uid === uid ? { ...i, ...patch } : i)))
  }, [])

  const onComposeMetaphor = () => {
    const objs = matchMetaphor(metaphor, 5)
    if (!objs.length) {
      alert('Не удалось подобрать объекты по метафоре. Попробуйте другие слова.')
      return
    }
    setItems(composeObjects(objs, format, { includeBackground: true }))
    setSelectedUid(null)
  }

  const onComposeNames = () => {
    const objs = matchNames(names)
    if (!objs.length) {
      alert('Не найдены объекты. Используйте имена: книга, телефон, пазлы, монета, наушники, лампа, кошелёк, папка, ручка, ваза…')
      return
    }
    setItems(composeObjects(objs, format, { includeBackground: true }))
    setSelectedUid(null)
  }

  const onAddObject = (objectId: string, variant: VariantId) => {
    setItems((prev) => [...prev, createManualItem(objectId, format, variant, prev.length)])
  }

  const onDeleteSelected = () => {
    if (!selectedUid) return
    setItems((prev) => prev.filter((i) => i.uid !== selectedUid))
    setSelectedUid(null)
  }

  const onDuplicateSelected = () => {
    const item = items.find((i) => i.uid === selectedUid)
    if (!item) return
    const copy: CanvasItem = {
      ...item,
      uid: nextUid(),
      x: item.x + 24,
      y: item.y + 24,
      zIndex: item.zIndex + 1,
    }
    setItems((prev) => [...prev, copy])
    setSelectedUid(copy.uid)
  }

  const onRotateSelected = (delta: number) => {
    if (!selectedUid) return
    patchItem(selectedUid, {
      rotation: (items.find((i) => i.uid === selectedUid)?.rotation ?? 0) + delta,
    })
  }

  const onToggleVariant = () => {
    const item = items.find((i) => i.uid === selectedUid)
    if (!item) return
    patchItem(item.uid, { variant: item.variant === 'main' ? 'bg' : 'main' })
  }

  const onBringForward = () => {
    const item = items.find((i) => i.uid === selectedUid)
    if (!item) return
    patchItem(item.uid, { zIndex: item.zIndex + 1 })
  }

  const onSendBackward = () => {
    const item = items.find((i) => i.uid === selectedUid)
    if (!item) return
    patchItem(item.uid, { zIndex: item.zIndex - 1 })
  }

  const onLoadPreset = (id: string) => {
    const preset = PRESETS[id]
    if (!preset) return
    setPaletteId(preset.palette)
    setMetaphor(preset.metaphor)
    const objs = matchMetaphor(preset.metaphor, 5)
    setItems(composeObjects(objs, format, { includeBackground: true }))
    setSelectedUid(null)
  }

  const onExport = async () => {
    try {
      const svg = await buildExportSvg({
        items,
        format,
        size,
        paletteId,
        background: showBackground,
      })
      downloadSvg(svg, `composition-${paletteId}-${size}-${format.id}.svg`)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка экспорта')
    }
  }

  // Initial demo composition
  useEffect(() => {
    const objs = ['headphones', 'phone', 'coin', 'vase']
      .map((id) => findObject(id))
      .filter((o): o is LibraryObject => Boolean(o))
    setItems(composeObjects(objs, FORMATS[0], { includeBackground: true }))
  }, [])

  return (
    <div className="app">
      <Sidebar
        size={size}
        paletteId={paletteId}
        formatId={formatId}
        showBackground={showBackground}
        metaphor={metaphor}
        names={names}
        items={items}
        selectedUid={selectedUid}
        onSize={setSize}
        onPalette={setPaletteId}
        onFormat={setFormatId}
        onShowBackground={setShowBackground}
        onMetaphor={setMetaphor}
        onNames={setNames}
        onComposeMetaphor={onComposeMetaphor}
        onComposeNames={onComposeNames}
        onAddObject={onAddObject}
        onDeleteSelected={onDeleteSelected}
        onDuplicateSelected={onDuplicateSelected}
        onRotateSelected={onRotateSelected}
        onToggleVariant={onToggleVariant}
        onBringForward={onBringForward}
        onSendBackward={onSendBackward}
        onClear={() => {
          setItems([])
          setSelectedUid(null)
        }}
        onExport={onExport}
        onLoadPreset={onLoadPreset}
      />
      <main className="workspace">
        <Canvas
          items={items}
          format={format}
          size={size}
          paletteId={paletteId}
          showBackground={showBackground}
          selectedUid={selectedUid}
          onSelect={setSelectedUid}
          onChangeItem={patchItem}
        />
      </main>
    </div>
  )
}
