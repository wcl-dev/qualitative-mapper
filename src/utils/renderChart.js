import * as d3 from 'd3'

const GROUP_COLORS = [
  '#4E79A7', '#F28E2B', '#E15759', '#76B7B2',
  '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7',
  '#9C755F', '#BAB0AC',
]

function parseGroup(groupValue) {
  if (typeof groupValue !== 'string') return [String(groupValue)]
  const trimmed = groupValue.trim()
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed)
      if (Array.isArray(arr)) return arr.map(s => String(s).trim())
    } catch (_) { /* not JSON, treat as plain string */ }
  }
  return [trimmed]
}

function estimateLabelRadius(text, fontSize) {
  let width = 0
  for (const ch of text) {
    width += ch.charCodeAt(0) > 0x2E80 ? fontSize * 0.95 : fontSize * 0.55
  }
  return Math.max(width / 2, fontSize / 2) + 4
}

/**
 * 使用 D3.js 在 SVG 元素上渲染矩陣對比兼組織分群圖。
 */
export function renderChart(svgEl, data, width, height) {
  const { nodes, links, settings = {} } = data
  const margin = { top: 40, right: 40, bottom: 60, left: 60 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('width', width).attr('height', height)

  // ─── 縮放容器（zoom 作用在這層）───
  const zoomG = svg.append('g').attr('class', 'zoom-container')

  const g = zoomG.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const zoom = d3.zoom()
    .scaleExtent([0.3, 5])
    .on('zoom', (event) => {
      zoomG.attr('transform', event.transform)
    })

  svg.call(zoom)
  svg.on('dblclick.zoom', () => {
    svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity)
  })

  // ─── 座標映射（第一象限，從 0 開始）───
  const xMax = d3.max(nodes, d => +d.X) || 1
  const yMax = d3.max(nodes, d => +d.Y) || 1

  const xScale = d3.scaleLinear().domain([0, xMax]).range([0, innerW]).nice()
  const yScale = d3.scaleLinear().domain([0, yMax]).range([innerH, 0]).nice()

  const sizeExtent = d3.extent(nodes, d => +d.Size)
  const sizeScale = d3.scaleSqrt().domain(sizeExtent).range([6, 30])

  // ─── 群組解析（支援 JSON 陣列）───
  const allGroupNames = [...new Set(nodes.flatMap(d => parseGroup(d.Group)))]
  const colorScale = d3.scaleOrdinal().domain(allGroupNames).range(GROUP_COLORS)

  // ─── 座標軸（L 型，第一象限）───
  const axisGroup = g.append('g')
    .attr('class', 'axes-layer')
    .attr('display', 'none')

  const xAxisGen = d3.axisBottom(xScale).ticks(8)
  axisGroup.append('g')
    .attr('class', 'x-axis-ticks')
    .attr('transform', `translate(0, ${innerH})`)
    .call(xAxisGen)
    .call(sel => sel.select('.domain').attr('stroke', '#aaa'))
    .call(sel => sel.selectAll('.tick line').attr('stroke', '#ccc'))
    .call(sel => sel.selectAll('.tick text')
      .attr('fill', '#888')
      .attr('font-size', '10px')
      .attr('font-family', "'Inter', system-ui, sans-serif"))

  const yAxisGen = d3.axisLeft(yScale).ticks(8)
  axisGroup.append('g')
    .attr('class', 'y-axis-ticks')
    .call(yAxisGen)
    .call(sel => sel.select('.domain').attr('stroke', '#aaa'))
    .call(sel => sel.selectAll('.tick line').attr('stroke', '#ccc'))
    .call(sel => sel.selectAll('.tick text')
      .attr('fill', '#888')
      .attr('font-size', '10px')
      .attr('font-family', "'Inter', system-ui, sans-serif"))

  if (settings.XAxisLabel) {
    axisGroup.append('text')
      .attr('x', innerW)
      .attr('y', innerH + 42)
      .attr('text-anchor', 'end')
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('font-family', "'Inter', system-ui, sans-serif")
      .attr('fill', '#777')
      .text(settings.XAxisLabel + ' →')
  }

  if (settings.YAxisLabel) {
    axisGroup.append('text')
      .attr('x', 6)
      .attr('y', -12)
      .attr('text-anchor', 'start')
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .attr('font-family', "'Inter', system-ui, sans-serif")
      .attr('fill', '#777')
      .text('↑ ' + settings.YAxisLabel)
  }

  // ─── 分群包絡線（Convex Hull，支援多群組）───
  const hullGroup = g.append('g').attr('class', 'hulls')

  allGroupNames.forEach(group => {
    const groupNodes = nodes.filter(d => parseGroup(d.Group).includes(group))
    if (groupNodes.length < 3) return

    const points = groupNodes.map(d => [xScale(+d.X), yScale(+d.Y)])
    const hull = d3.polygonHull(points)
    if (!hull) return

    const centroid = d3.polygonCentroid(hull)
    const expandedHull = hull.map(([x, y]) => {
      const dx = x - centroid[0]
      const dy = y - centroid[1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      const expand = 25
      return [x + (dx / dist) * expand, y + (dy / dist) * expand]
    })

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

  const pairKey = (s, t) => [s, t].sort().join('\0')
  const linkPairGroups = new Map()
  links.forEach(link => {
    const key = pairKey(link.Source, link.Target)
    if (!linkPairGroups.has(key)) linkPairGroups.set(key, [])
    linkPairGroups.get(key).push(link)
  })

  const linkMidpoints = new Map()

  links.forEach(link => {
    const source = nodeMap.get(link.Source)
    const target = nodeMap.get(link.Target)
    if (!source || !target) return

    const x1 = xScale(+source.X), y1 = yScale(+source.Y)
    const x2 = xScale(+target.X), y2 = yScale(+target.Y)

    const key = pairKey(link.Source, link.Target)
    const siblings = linkPairGroups.get(key)
    const idx = siblings.indexOf(link)
    const total = siblings.length

    const sorted = [link.Source, link.Target].sort()
    const sA = nodeMap.get(sorted[0]), sB = nodeMap.get(sorted[1])
    const sdx = xScale(+sB.X) - xScale(+sA.X)
    const sdy = yScale(+sB.Y) - yScale(+sA.Y)
    const slen = Math.sqrt(sdx * sdx + sdy * sdy) || 1
    const nx = -sdy / slen, ny = sdx / slen

    const curveOffset = total === 1 ? 0 : (idx - (total - 1) / 2) * 50

    const cx = (x1 + x2) / 2 + nx * curveOffset
    const cy = (y1 + y2) / 2 + ny * curveOffset

    const mx = 0.25 * x1 + 0.5 * cx + 0.25 * x2
    const my = 0.25 * y1 + 0.5 * cy + 0.25 * y2
    linkMidpoints.set(link, { x: mx, y: my })

    linkGroup.append('path')
      .attr('d', `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`)
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', strokeScale(+link.Strength))
      .attr('stroke-dasharray', link.Type === 'dashed' ? '6,3' : 'none')
  })

  // ─── 節點（多群組以扇形併陳顏色）───
  const nodeGroup = g.append('g').attr('class', 'nodes')

  nodes.forEach(d => {
    const cx = xScale(+d.X), cy = yScale(+d.Y)
    const r = sizeScale(+d.Size)
    const nodeGroups = parseGroup(d.Group)
    const nodeG = nodeGroup.append('g').attr('transform', `translate(${cx},${cy})`)

    if (nodeGroups.length === 1) {
      nodeG.append('circle')
        .attr('r', r)
        .attr('fill', colorScale(nodeGroups[0]))
        .attr('fill-opacity', 0.85)
    } else {
      const pie = d3.pie().value(1).sort(null)
      const arc = d3.arc().innerRadius(0).outerRadius(r)
      pie(nodeGroups).forEach(a => {
        nodeG.append('path')
          .attr('d', arc(a))
          .attr('fill', colorScale(a.data))
          .attr('fill-opacity', 0.85)
      })
    }

    nodeG.append('circle')
      .attr('r', r)
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
  })

  // ─── 標籤力模擬（無 repeller，強吸引 + 弱碰撞）───
  const NODE_FONT = 14
  const LINK_FONT = 12

  const nodeLabelData = nodes.map(d => {
    const r = sizeScale(+d.Size)
    const ty = yScale(+d.Y) - r - NODE_FONT / 2 - 2
    return {
      type: 'node',
      label: d.Name,
      fontSize: NODE_FONT,
      x: xScale(+d.X),
      y: ty,
      targetX: xScale(+d.X),
      targetY: ty,
      labelRadius: estimateLabelRadius(d.Name, NODE_FONT),
    }
  })

  const linkLabelData = links
    .filter(link => link.Label && linkMidpoints.has(link))
    .map(link => {
      const mid = linkMidpoints.get(link)
      return {
        type: 'link',
        label: link.Label,
        fontSize: LINK_FONT,
        x: mid.x,
        y: mid.y,
        targetX: mid.x,
        targetY: mid.y,
        labelRadius: estimateLabelRadius(link.Label, LINK_FONT),
      }
    })

  const allLabels = [...nodeLabelData, ...linkLabelData]

  if (allLabels.length > 0) {
    const labelSim = d3.forceSimulation(allLabels)
      .force('x', d3.forceX(d => d.targetX)
        .strength(d => d.type === 'node' ? 0.8 : 0.3))
      .force('y', d3.forceY(d => d.targetY)
        .strength(d => d.type === 'node' ? 0.8 : 0.3))
      .force('collide', d3.forceCollide(d => d.labelRadius).strength(0.5))
      .stop()

    for (let i = 0; i < 200; i++) labelSim.tick()
  }

  const labelGroup = g.append('g').attr('class', 'labels')
  const linkLabelGroup = g.append('g').attr('class', 'link-labels')

  allLabels.forEach(d => {
    const isNode = d.type === 'node'
    const parent = isNode ? labelGroup : linkLabelGroup
    const labelG = parent.append('g')

    const labelText = labelG.append('text')
      .attr('x', d.x)
      .attr('y', d.y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', `${d.fontSize}px`)
      .attr('font-family', "'Inter', system-ui, sans-serif")
      .attr('fill', isNode ? '#333' : '#666')
      .text(d.label)

    const bbox = labelText.node().getBBox()
    const px = isNode ? 2 : 3
    labelG.insert('rect', 'text')
      .attr('x', bbox.x - px)
      .attr('y', bbox.y - 1)
      .attr('width', bbox.width + px * 2)
      .attr('height', bbox.height + 2)
      .attr('fill', 'white')
      .attr('fill-opacity', isNode ? 0.85 : 0.8)
      .attr('rx', 2)
  })

  // ─── 圖例（固定於右下角，不隨 zoom 移動，避開原點與座標軸）───
  const legend = svg.append('g').attr('class', 'legend')

  allGroupNames.forEach((group, i) => {
    const legendItem = legend.append('g')
      .attr('transform', `translate(0, ${i * 24})`)

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

  const legendBBox = legend.node().getBBox()
  const lPad = 10
  legend.insert('rect', ':first-child')
    .attr('x', legendBBox.x - lPad)
    .attr('y', legendBBox.y - lPad)
    .attr('width', legendBBox.width + lPad * 2)
    .attr('height', legendBBox.height + lPad * 2)
    .attr('fill', 'white')
    .attr('fill-opacity', 0.92)
    .attr('stroke', '#e5e7eb')
    .attr('rx', 6)

  const legendTotalW = legendBBox.width + lPad * 2
  const legendTotalH = legendBBox.height + lPad * 2
  legend.attr('transform',
    `translate(${width - legendTotalW - 16}, ${height - legendTotalH - 12})`)
}
