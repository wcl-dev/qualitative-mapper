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
  const { nodes, links } = data
  const margin = { top: 40, right: 40, bottom: 40, left: 40 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  // 清除先前的內容
  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('width', width).attr('height', height)

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // ─── 座標映射 ───
  const xExtent = d3.extent(nodes, d => +d.X)
  const yExtent = d3.extent(nodes, d => +d.Y)

  const xScale = d3.scaleLinear().domain(xExtent).range([0, innerW]).nice()
  const yScale = d3.scaleLinear().domain(yExtent).range([innerH, 0]).nice()

  // 動態中心點（平均值）
  const xMean = d3.mean(nodes, d => +d.X)
  const yMean = d3.mean(nodes, d => +d.Y)

  // 節點大小映射（面積比例）
  const sizeExtent = d3.extent(nodes, d => +d.Size)
  const sizeScale = d3.scaleSqrt().domain(sizeExtent).range([6, 30])

  // 分群顏色映射
  const groups = [...new Set(nodes.map(d => d.Group))]
  const colorScale = d3.scaleOrdinal().domain(groups).range(GROUP_COLORS)

  // ─── 座標軸（交會於動態中心點）───
  const axisGroup = g.append('g').attr('class', 'axes')

  // 垂直軸線（通過 xMean）
  axisGroup.append('line')
    .attr('x1', xScale(xMean)).attr('y1', 0)
    .attr('x2', xScale(xMean)).attr('y2', innerH)
    .attr('stroke', '#ccc').attr('stroke-width', 1).attr('stroke-dasharray', '4,4')

  // 水平軸線（通過 yMean）
  axisGroup.append('line')
    .attr('x1', 0).attr('y1', yScale(yMean))
    .attr('x2', innerW).attr('y2', yScale(yMean))
    .attr('stroke', '#ccc').attr('stroke-width', 1).attr('stroke-dasharray', '4,4')

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
    .force('collide', d3.forceCollide(12))
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
    .attr('font-size', '11px')
    .attr('font-family', "'Inter', system-ui, sans-serif")
    .attr('fill', '#333')
    .text(d => d.Name)

  // ─── 圖例 ───
  const legend = svg.append('g')
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
      .attr('y', 4)
      .attr('font-size', '11px')
      .attr('font-family', "'Inter', system-ui, sans-serif")
      .attr('fill', '#555')
      .text(group)
  })
}
