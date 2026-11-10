import { LIBRARY } from '../data/library'
import { PALETTES } from '../data/palettes'
import type { CanvasItem, FormatId, PaletteId, SizeId, VariantId } from '../types'
import { SvgObject } from './SvgObject'

interface Props {
  size: SizeId
  paletteId: PaletteId
  formatId: FormatId
  showBackground: boolean
  metaphor: string
  names: string
  items: CanvasItem[]
  selectedUid: string | null
  onSize: (s: SizeId) => void
  onPalette: (id: PaletteId) => void
  onFormat: (id: FormatId) => void
  onShowBackground: (v: boolean) => void
  onMetaphor: (v: string) => void
  onNames: (v: string) => void
  onComposeMetaphor: () => void
  onComposeNames: () => void
  onAddObject: (objectId: string, variant: VariantId) => void
  onDeleteSelected: () => void
  onDuplicateSelected: () => void
  onRotateSelected: (delta: number) => void
  onToggleVariant: () => void
  onBringForward: () => void
  onSendBackward: () => void
  onClear: () => void
  onExport: () => void
  onLoadPreset: (id: string) => void
}

export function Sidebar(props: Props) {
  const selected = props.items.find((i) => i.uid === props.selectedUid)

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <p className="brand">SVG Constructor</p>
        <h1>Конструктор иллюстраций</h1>
        <p className="lede">Сборка композиций из библиотеки Figma без генерации новых объектов.</p>
      </header>

      <section className="panel">
        <h2>Размер</h2>
        <div className="seg">
          {(['L', 'S'] as SizeId[]).map((s) => (
            <button key={s} type="button" className={props.size === s ? 'active' : ''} onClick={() => props.onSize(s)}>
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Цветовая схема</h2>
        <div className="palette-list">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`palette-btn${props.paletteId === p.id ? ' active' : ''}`}
              onClick={() => props.onPalette(p.id)}
            >
              <span className="swatches">
                <i style={{ background: p.colors.bg }} />
                <i style={{ background: p.colors.accent }} />
                <i style={{ background: p.colors.cream }} />
                <i style={{ background: p.colors.tintStrong }} />
              </span>
              <span>{p.nameRu}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Формат холста</h2>
        <div className="seg">
          {(
            [
              ['square', '1:1'],
              ['wide', 'Широкий'],
              ['tall', 'Высокий'],
            ] as [FormatId, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={props.formatId === id ? 'active' : ''}
              onClick={() => props.onFormat(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={props.showBackground}
            onChange={(e) => props.onShowBackground(e.target.checked)}
          />
          Фон из палитры
        </label>
      </section>

      <section className="panel">
        <h2>Сценарий 1 — метафора</h2>
        <textarea
          value={props.metaphor}
          onChange={(e) => props.onMetaphor(e.target.value)}
          placeholder="Например: музыкальный стартап ищет инвестиции"
          rows={3}
        />
        <button type="button" className="primary" onClick={props.onComposeMetaphor}>
          Собрать по метафоре
        </button>
      </section>

      <section className="panel">
        <h2>Сценарий 2 — имена</h2>
        <textarea
          value={props.names}
          onChange={(e) => props.onNames(e.target.value)}
          placeholder="книга, наушники, лампа"
          rows={2}
        />
        <button type="button" className="primary" onClick={props.onComposeNames}>
          Собрать по именам
        </button>
      </section>

      <section className="panel">
        <h2>Библиотека</h2>
        <div className="lib-grid">
          {LIBRARY.map((obj) => (
            <div key={obj.id} className="lib-card">
              <div className="lib-thumb">
                <SvgObject
                  objectId={obj.id}
                  size={props.size}
                  variant="main"
                  paletteId={props.paletteId}
                  width={72}
                  height={56}
                />
              </div>
              <span className="lib-name">{obj.nameRu}</span>
              <div className="lib-actions">
                <button type="button" onClick={() => props.onAddObject(obj.id, 'main')}>
                  Main
                </button>
                <button type="button" onClick={() => props.onAddObject(obj.id, 'bg')}>
                  Bg
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Выбранный объект</h2>
        {selected ? (
          <div className="tools">
            <button type="button" onClick={() => props.onRotateSelected(-15)}>
              −15°
            </button>
            <button type="button" onClick={() => props.onRotateSelected(15)}>
              +15°
            </button>
            <button type="button" onClick={props.onToggleVariant}>
              {selected.variant === 'main' ? '→ Фон' : '→ Main'}
            </button>
            <button type="button" onClick={props.onDuplicateSelected}>
              Дублировать
            </button>
            <button type="button" onClick={props.onBringForward}>
              Выше
            </button>
            <button type="button" onClick={props.onSendBackward}>
              Ниже
            </button>
            <button type="button" className="danger" onClick={props.onDeleteSelected}>
              Удалить
            </button>
          </div>
        ) : (
          <p className="muted">Выберите объект на холсте</p>
        )}
      </section>

      <section className="panel">
        <h2>Пресеты / экспорт</h2>
        <div className="tools">
          <button type="button" onClick={() => props.onLoadPreset('finance')}>
            Пример: финансы
          </button>
          <button type="button" onClick={() => props.onLoadPreset('music')}>
            Пример: музыка
          </button>
          <button type="button" onClick={() => props.onLoadPreset('study')}>
            Пример: учёба
          </button>
          <button type="button" onClick={props.onClear}>
            Очистить
          </button>
          <button type="button" className="primary" onClick={props.onExport}>
            Скачать SVG
          </button>
        </div>
      </section>
    </aside>
  )
}
