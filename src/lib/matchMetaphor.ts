import { LIBRARY, findObjectByName } from '../data/library'
import type { LibraryObject } from '../types'

const STOP = new Set([
  'и', 'в', 'во', 'на', 'с', 'со', 'к', 'по', 'для', 'из', 'о', 'об', 'а', 'но', 'или', 'это', 'как',
  'the', 'a', 'an', 'of', 'to', 'for', 'and', 'or', 'in', 'on', 'with', 'my', 'our',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-zA-Zа-яА-ЯёЁ0-9]+/u)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t))
}

function scoreObject(tokens: string[], obj: LibraryObject): number {
  let score = 0
  for (const token of tokens) {
    for (const tag of obj.tags) {
      const t = tag.toLowerCase()
      if (t === token) score += 4
      else if (t.includes(token) || token.includes(t)) score += 2
    }
    if (obj.nameRu.toLowerCase().includes(token) || obj.name.toLowerCase().includes(token)) {
      score += 3
    }
  }
  return score
}

/** Scenario 1: metaphor / headline → ranked object ids */
export function matchMetaphor(text: string, limit = 4): LibraryObject[] {
  const tokens = tokenize(text)
  if (!tokens.length) return []

  return LIBRARY.map((obj) => ({ obj, score: scoreObject(tokens, obj) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.obj)
}

/** Scenario 2: comma/space separated component names */
export function matchNames(text: string): LibraryObject[] {
  const parts = text
    .split(/[,;\n]+/)
    .map((p) => p.trim())
    .filter(Boolean)

  if (!parts.length) {
    // also allow space-separated known names
    const tokens = tokenize(text)
    const found: LibraryObject[] = []
    for (const t of tokens) {
      const obj = findObjectByName(t)
      if (obj && !found.some((f) => f.id === obj.id)) found.push(obj)
    }
    return found
  }

  const found: LibraryObject[] = []
  for (const part of parts) {
    const obj = findObjectByName(part) ?? matchMetaphor(part, 1)[0]
    if (obj && !found.some((f) => f.id === obj.id)) found.push(obj)
  }
  return found
}
