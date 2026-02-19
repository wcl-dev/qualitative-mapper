/**
 * 將 SVG 元素匯出為 .svg 檔案下載。
 * 重置 zoom 變形、將圖例移至圖表下方，以 viewBox 確保文字可讀且無遮擋。
 */
export function exportSVG(svgEl) {
  const zoomContainer = svgEl.querySelector('.zoom-container')
  const legend = svgEl.querySelector('.legend')

  const savedZoom = zoomContainer?.getAttribute('transform') || ''
  const savedLegendTransform = legend?.getAttribute('transform') || ''
  const savedWidth = svgEl.getAttribute('width')
  const savedHeight = svgEl.getAttribute('height')
  const savedViewBox = svgEl.getAttribute('viewBox')
  const savedClass = svgEl.getAttribute('class')

  // 重置 zoom
  if (zoomContainer) zoomContainer.setAttribute('transform', '')

  // 暫時隱藏圖例，量測純圖表內容邊界
  if (legend) legend.setAttribute('display', 'none')
  const chartBBox = svgEl.getBBox()
  if (legend) legend.removeAttribute('display')

  // 將圖例移至圖表下方（右對齊），避免遮擋任何內容
  if (legend) {
    const lb = legend.getBBox()
    const tx = chartBBox.x + chartBBox.width - lb.width - lb.x
    const ty = chartBBox.y + chartBBox.height + 20 - lb.y
    legend.setAttribute('transform', `translate(${tx}, ${ty})`)
  }

  // 量測含圖例的最終邊界
  const fullBBox = svgEl.getBBox()
  const pad = 24
  const vbX = fullBBox.x - pad
  const vbY = fullBBox.y - pad
  const vbW = fullBBox.width + pad * 2
  const vbH = fullBBox.height + pad * 2

  svgEl.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`)

  const aspect = vbW / vbH
  const exportHeight = 900
  const exportWidth = Math.round(exportHeight * aspect)
  svgEl.setAttribute('width', exportWidth)
  svgEl.setAttribute('height', exportHeight)
  if (savedClass) svgEl.removeAttribute('class')

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgEl)

  // 還原所有暫時修改
  if (zoomContainer) zoomContainer.setAttribute('transform', savedZoom)
  if (legend) legend.setAttribute('transform', savedLegendTransform)
  if (savedWidth) svgEl.setAttribute('width', savedWidth)
  if (savedHeight) svgEl.setAttribute('height', savedHeight)
  if (savedViewBox) svgEl.setAttribute('viewBox', savedViewBox)
  else svgEl.removeAttribute('viewBox')
  if (savedClass) svgEl.setAttribute('class', savedClass)

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
