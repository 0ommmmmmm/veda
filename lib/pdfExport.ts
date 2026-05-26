/**
 * html2canvas cannot parse lab(), oklch(), or color-mix() in computed styles.
 * Force hex/rgb inline styles on the printable subtree before capture.
 */
const COLORS = {
  white: '#ffffff',
  text: '#111827',
  muted: '#4b5563',
  border: '#e5e7eb',
  badgeBg: '#f3f4f6',
  badgeText: '#374151',
  line: '#9ca3af',
} as const

function isTransparent(color: string): boolean {
  return (
    !color ||
    color === 'transparent' ||
    color === 'rgba(0, 0, 0, 0)' ||
    color === 'rgba(0,0,0,0)'
  )
}

function pickBackground(el: HTMLElement, computedBg: string): string {
  if (isTransparent(computedBg)) return ''
  const cls = el.className
  if (typeof cls === 'string' && (cls.includes('bg-gray-50') || cls.includes('bg-gray-100'))) {
    return COLORS.badgeBg
  }
  return COLORS.white
}

function pickTextColor(el: HTMLElement): string {
  const cls = typeof el.className === 'string' ? el.className : ''
  if (
    cls.includes('text-gray-600') ||
    cls.includes('text-gray-500') ||
    cls.includes('text-gray-700') ||
    cls.includes('text-muted')
  ) {
    return COLORS.muted
  }
  if (cls.includes('text-gray-300') || cls.includes('text-gray-400')) {
    return COLORS.muted
  }
  return COLORS.text
}

function getComputedStyleForDoc(el: Element, doc: Document): CSSStyleDeclaration {
  const view = doc.defaultView ?? window
  return view.getComputedStyle(el)
}

export function sanitizeNodeForPdf(
  root: HTMLElement,
  doc: Document = document
): void {
  root.classList.add('pdf-export-mode')

  const elements: HTMLElement[] = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]

  for (const el of elements) {
    el.style.setProperty('box-shadow', 'none', 'important')
    el.style.setProperty('text-shadow', 'none', 'important')
    el.style.setProperty('outline', 'none', 'important')

    const computed = getComputedStyleForDoc(el, doc)

    const bg = pickBackground(el, computed.backgroundColor)
    if (bg) {
      el.style.setProperty('background-color', bg, 'important')
    } else if (!isTransparent(computed.backgroundColor)) {
      el.style.setProperty('background-color', COLORS.white, 'important')
    }

    el.style.setProperty('color', pickTextColor(el), 'important')

    const borderProps = [
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'borderColor',
    ] as const

    for (const prop of borderProps) {
      const value = computed[prop]
      if (value && !isTransparent(value) && computed.borderWidth !== '0px') {
        const cssProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
        el.style.setProperty(cssProp, COLORS.border, 'important')
      }
    }

    if (el.tagName === 'INPUT' && el.getAttribute('type') === 'radio') {
      el.style.setProperty('accent-color', COLORS.text, 'important')
    }
  }
}

export function clearPdfExportMode(root: HTMLElement): void {
  root.classList.remove('pdf-export-mode')
  const elements: HTMLElement[] = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
  for (const el of elements) {
    el.style.removeProperty('box-shadow')
    el.style.removeProperty('text-shadow')
    el.style.removeProperty('outline')
    el.style.removeProperty('background-color')
    el.style.removeProperty('color')
    el.style.removeProperty('border-color')
    el.style.removeProperty('border-top-color')
    el.style.removeProperty('border-right-color')
    el.style.removeProperty('border-bottom-color')
    el.style.removeProperty('border-left-color')
    el.style.removeProperty('accent-color')
  }
}
