import * as d3 from 'd3'

// 學術配色方案（柔和、適合出版）
const GROUP_COLORS = [
  '#4E79A7', '#F28E2B', '#E15759', '#76B7B2',
  '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7',
  '#9C755F', '#BAB0AC',
]

/**
 * 使用 D3.js 在 SVG 元素上渲染矩陣對比兼組織分群圖。
 */
export function renderChart(svgEl, data, width, height) {
  const { nodes, links, settings = {} } = data
  const margin = { top: 40, right: 40, bottom: 40, left: 40 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  // 清除先前的內容
  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('width', width).attr('height', height)

  // ─── 縮放容器（zoom 作用在這層）───
  const zoomG = svg.append('g').attr('class', 'zoom-container')

  const g = zoomG.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // ─── 設定 zoom/pan 行為 ───
  const zoom = d3.zoom()
    .scaleExtent([0.3, 5])
    .on('zoom', (event) => {
      zoomG.attr('transform', event.transform)
    })

  svg.call(zoom)
  // 雙擊重置
  svg.on('dblclick.zoom', () => {
    svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity)
  })

  // ─── 座標映射 ───
  const xExtent = d3.extent(nodes, d => +d.X)
  const yExtent = d3.extent(nodes, d => +d.Y)

  // 計算交叉點：優先用 Settings 自訂，否則預設為原點 (0, 0)
  const xCenter = settings.XAxisCenter !== undefined ? +settings.XAxisCenter : 0
  const yCenter = settings.YAxisCenter !== undefined ? +settings.YAxisCenter : 0

  // 擴展 domain 確保交叉點在可見範圍內
  const xDomain = [Math.min(xExtent[0], xCenter), Math.max(xExtent[1], xCenter)]
  const yDomain = [Math.min(yExtent[0], yCenter), Math.max(yExtent[1], yCenter)]

  const xScale = d3.scaleLinear().domain(xDomain).range([0, innerW]).nice()
  const yScale = d3.scaleLinear().domain(yDomain).range([innerH, 0]).nice()

  // 節點大小映射（面積比例）
  const sizeExtent = d3.extent(nodes, d => +d.Size)
  const sizeScale = d3.scaleSqrt().domain(sizeExtent).range([6, 30])

  // 分群顏色映射
  const groups = [...new Set(nodes.map(d => d.Group))]
  const colorScale = d3.scaleOrdinal().domain(groups).range(GROUP_COLORS)

  // ─── 座標軸（永遠渲染，預設隱藏，由外部 CSS toggle）───
  const axisGroup = g.append('g')
    .attr('class', 'axes-layer')
    .attr('display', 'none')  // 預設隱藏

  const overExtend = 2000

  // 垂直軸線（通過 xCenter）
  axisGroup.append('line')
    .attr('x1', xScale(xCenter)).attr('y1', -overExtend)
    .attr('x2', xScale(xCenter)).attr('y2', innerH + overExtend)
    .attr('stroke', '#aaa').attr('stroke-width', 1).attr('stroke-dasharray', '6,4')

  // 水平軸線（通過 yCenter）
  axisGroup.append('line')
    .attr('x1', -overExtend).attr('y1', yScale(yCenter))
    .attr('x2', innerW + overExtend).attr('y2', yScale(yCenter))
    .attr('stroke', '#aaa').attr('stroke-width', 1).attr('stroke-dasharray', '6,4')

  // ─── D3 刻度軸（帶偏移，避免和節點重疊）───

  // X 軸刻度（畫在 yCenter 水平線上，文字大幅偏移到下方）
  const xAxis = d3.axisBottom(xScale).ticks(8).tickSize(16).tickPadding(12)
  const xAxisG = axisGroup.append('g')
    .attr('class', 'x-axis-ticks')
    .attr('transform', `translate(0, ${yScale(yCenter)})`)
    .call(xAxis)
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').attr('stroke', '#bbb').attr('stroke-opacity', 0.6))
    .call(g => g.selectAll('.tick text')
      .attr('fill', '#888')
      .attr('font-size', '10px')
      .attr('font-family', "'Inter', system-ui, sans-serif"))

  // 為 X 軸刻度文字加白色背景
  xAxisG.selectAll('.tick text').each(function () {
    const text = d3.select(this)
    const bbox = this.getBBox()
    const tick = d3.select(this.parentNode)
    tick.insert('rect', 'text')
      .attr('x', bbox.x - 2)
      .attr('y', bbox.y - 1)
      .attr('width', bbox.width + 4)
      .attr('height', bbox.height + 2)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.9)
      .attr('rx', 2)
  })

  // Y 軸刻度（畫在 xCenter 垂直線上，文字大幅偏移到左邊）
  const yAxis = d3.axisLeft(yScale).ticks(8).tickSize(16).tickPadding(12)
  const yAxisG = axisGroup.append('g')
    .attr('class', 'y-axis-ticks')
    .attr('transform', `translate(${xScale(xCenter)}, 0)`)
    .call(yAxis)
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').attr('stroke', '#bbb').attr('stroke-opacity', 0.6))
    .call(g => g.selectAll('.tick text')
      .attr('fill', '#888')
      .attr('font-size', '10px')
      .attr('font-family', "'Inter', system-ui, sans-serif"))

  // 為 Y 軸刻度文字加白色背景
  yAxisG.selectAll('.tick text').each(function () {
    const text = d3.select(this)
    const bbox = this.getBBox()
    const tick = d3.select(this.parentNode)
    tick.insert('rect', 'text')
      .attr('x', bbox.x - 2)
      .attr('y', bbox.y - 1)
      .attr('width', bbox.width + 4)
      .attr('height', bbox.height + 2)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.9)
      .attr('rx', 2)
  })

  // ─── 軸標籤（來自 Settings 工作表）───
  if (settings.XAxisLabel) {
    axisGroup.append('text')
      .attr('x', innerW + 5)
      .attr('y', yScale(yCenter) - 14)
      .attr('text-anchor', 'end')
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('font-family', "'Inter', system-ui, sans-serif")
      .attr('fill', '#777')
      .text(settings.XAxisLabel + ' →')
  }

  if (settings.YAxisLabel) {
    axisGroup.append('text')
      .attr('x', xScale(xCenter) + 14)
      .attr('y', -8)
      .attr('text-anchor', 'start')
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('font-family', "'Inter', system-ui, sans-serif")
      .attr('fill', '#777')
      .text('↑ ' + settings.YAxisLabel)
  }

  // ─── 分群包絡線（Convex Hull）───
  const hullGroup = g.append('g').attr('class', 'hulls')

  groups.forEach(group => {
    const groupNodes = nodes.filter(d => d.Group === group)
    if (groupNodes.length < 3) return // 凸包需至少 3 個點

    const points = groupNodes.map(d => [xScale(+d.X), yScale(+d.Y)])
    const hull = d3.polygonHull(points)
    if (!hull) return

    // 擴展 hull 讓泡泡更圓潤
    const centroid = d3.polygonCentroid(hull)
    const expandedHull = hull.map(([x, y]) => {
      const dx = x - centroid[0]
      const dy = y - centroid[1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      const expand = 25
      return [x + (dx / dist) * expand, y + (dy / dist) * expand]
    })

    // 使用 curve 繪製平滑邊界
    const hullLine = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.8))

    hullGroup.append('path')
      .attr('d', hullLine(expandedHull))
      .attr('fill', colorScale(group))
      .attr('fill-opacity', 0.1)
      .attr('stroke', colorScale(group))
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
  })

  // ─── 連線（Links）───
  const linkGroup = g.append('g').attr('class', 'links')

  const strengthExtent = d3.extent(links, d => +d.Strength)
  const strokeScale = d3.scaleLinear().domain(strengthExtent).range([1, 5])

  const nodeMap = new Map(nodes.map(d => [d.Name, d]))

  links.forEach(link => {
    const source = nodeMap.get(link.Source)
    const target = nodeMap.get(link.Target)
    if (!source || !target) return

    linkGroup.append('line')
      .attr('x1', xScale(+source.X))
      .attr('y1', yScale(+source.Y))
      .attr('x2', xScale(+target.X))
      .attr('y2', yScale(+target.Y))
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', strokeScale(+link.Strength))
      .attr('stroke-dasharray', link.Type === 'dashed' ? '6,3' : 'none')
  })

  // ─── 連線標籤（選填 Label）───
  const linkLabelGroup = g.append('g').attr('class', 'link-labels')

  links.forEach(link => {
    if (!link.Label) return
    const source = nodeMap.get(link.Source)
    const target = nodeMap.get(link.Target)
    if (!source || !target) return

    const mx = (xScale(+source.X) + xScale(+target.X)) / 2
    const my = (yScale(+source.Y) + yScale(+target.Y)) / 2

    // 白色背景矩形（先加，讓文字覆蓋在上面）
    const labelText = linkLabelGroup.append('text')
      .attr('x', mx)
      .attr('y', my)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '11px')
      .attr('font-family', "'Inter', system-ui, sans-serif")
      .attr('fill', '#666')
      .text(link.Label)

    // 取得文字邊界框來畫背景
    const bbox = labelText.node().getBBox()
    linkLabelGroup.insert('rect', 'text')
      .attr('x', bbox.x - 3)
      .attr('y', bbox.y - 1)
      .attr('width', bbox.width + 6)
      .attr('height', bbox.height + 2)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.85)
      .attr('rx', 2)
  })

  // ─── 節點 ───
  const nodeGroup = g.append('g').attr('class', 'nodes')

  nodeGroup.selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('cx', d => xScale(+d.X))
    .attr('cy', d => yScale(+d.Y))
    .attr('r', d => sizeScale(+d.Size))
    .attr('fill', d => colorScale(d.Group))
    .attr('fill-opacity', 0.85)
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)

  // ─── 標籤（帶碰撞偵測）───
  const labelData = nodes.map(d => ({
    ...d,
    x: xScale(+d.X),
    y: yScale(+d.Y),
    r: sizeScale(+d.Size),
  }))

  // 使用 d3-force 模擬來處理標籤防碰撞
  const simulation = d3.forceSimulation(labelData)
    .force('x', d3.forceX(d => xScale(+d.X)).strength(0.8))
    .force('y', d3.forceY(d => yScale(+d.Y) - d.r - 8).strength(0.8))
    .force('collide', d3.forceCollide(16))
    .stop()

  // 手動推進模擬
  for (let i = 0; i < 100; i++) simulation.tick()

  const labelGroup = g.append('g').attr('class', 'labels')

  labelGroup.selectAll('text')
    .data(labelData)
    .join('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .attr('font-family', "'Inter', system-ui, sans-serif")
    .attr('fill', '#333')
    .text(d => d.Name)

  // ─── 圖例 ───
  const legend = zoomG.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - margin.right - 120}, ${margin.top})`)

  groups.forEach((group, i) => {
    const legendItem = legend.append('g')
      .attr('transform', `translate(0, ${i * 22})`)

    legendItem.append('circle')
      .attr('r', 6)
      .attr('fill', colorScale(group))
      .attr('fill-opacity', 0.85)

    legendItem.append('text')
      .attr('x', 14)
      .attr('y', 5)
      .attr('font-size', '13px')
      .attr('font-family', "'Inter', system-ui, sans-serif")
      .attr('fill', '#555')
      .text(group)
  })
}
