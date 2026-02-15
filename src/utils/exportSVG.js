/**
 * 將 SVG 元素匯出為 .svg 檔案下載。
 * @param {SVGElement} svgEl - 要匯出的 SVG DOM 元素
 */
export function exportSVG(svgEl) {
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgEl)
  const blob = new Blob(
    ['<?xml version="1.0" encoding="UTF-8"?>\n' + svgString],
    { type: 'image/svg+xml;charset=utf-8' }
  )

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'qualitative-map.svg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
