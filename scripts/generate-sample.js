import XLSX from 'xlsx'

// ── 測試數據：魚市場利害關係人 ──
const nodes = [
  // 生產端
  { Name: '遠洋漁船船長', X: 1.0, Y: 4.5, Size: 8, Group: '漁夫' },
  { Name: '近海漁民',     X: 1.5, Y: 3.8, Size: 6, Group: '漁夫' },
  { Name: '養殖戶',       X: 0.8, Y: 3.2, Size: 5, Group: '漁夫' },
  // 中間商
  { Name: '產地盤商',     X: 2.8, Y: 4.0, Size: 7, Group: '盤商' },
  { Name: '批發商',       X: 3.2, Y: 3.2, Size: 8, Group: '盤商' },
  { Name: '進口商',       X: 3.5, Y: 4.5, Size: 6, Group: '盤商' },
  // 通路
  { Name: '傳統市場攤販', X: 4.5, Y: 3.0, Size: 6, Group: '市場通路' },
  { Name: '超市量販店',   X: 4.8, Y: 3.8, Size: 7, Group: '市場通路' },
  { Name: '餐廳業者',     X: 5.0, Y: 2.5, Size: 5, Group: '市場通路' },
  // 消費端
  { Name: '一般消費者',   X: 6.0, Y: 3.5, Size: 9, Group: '顧客' },
  { Name: '觀光客',       X: 6.2, Y: 2.8, Size: 4, Group: '顧客' },
  // 政府／跨組織
  { Name: '漁業署',       X: 3.0, Y: 1.0, Size: 7, Group: '政府' },
  { Name: '食藥署',       X: 4.0, Y: 0.8, Size: 6, Group: '政府' },
  { Name: '地方漁會',     X: 2.0, Y: 1.5, Size: 5, Group: '["政府","漁夫"]' },
  { Name: '產銷履歷中心', X: 3.8, Y: 1.8, Size: 4, Group: '["政府","市場通路"]' },
]

const links = [
  // 漁夫 → 盤商
  { Source: '遠洋漁船船長', Target: '產地盤商',     Strength: 7, Type: 'solid',  Label: '供貨' },
  { Source: '近海漁民',     Target: '產地盤商',     Strength: 6, Type: 'solid',  Label: '供貨' },
  { Source: '養殖戶',       Target: '批發商',       Strength: 5, Type: 'solid',  Label: '養殖供貨' },
  { Source: '進口商',       Target: '批發商',       Strength: 6, Type: 'solid',  Label: '進口供貨' },
  // 盤商 → 通路
  { Source: '產地盤商',     Target: '批發商',       Strength: 8, Type: 'solid',  Label: '轉售' },
  { Source: '批發商',       Target: '傳統市場攤販', Strength: 7, Type: 'solid',  Label: '批發' },
  { Source: '批發商',       Target: '超市量販店',   Strength: 6, Type: 'solid',  Label: '配送' },
  { Source: '批發商',       Target: '餐廳業者',     Strength: 5, Type: 'solid',  Label: '供貨' },
  // 通路 → 顧客
  { Source: '傳統市場攤販', Target: '一般消費者',   Strength: 6, Type: 'solid',  Label: '零售' },
  { Source: '超市量販店',   Target: '一般消費者',   Strength: 7, Type: 'solid',  Label: '銷售' },
  { Source: '傳統市場攤販', Target: '觀光客',       Strength: 4, Type: 'dashed' },
  { Source: '餐廳業者',     Target: '觀光客',       Strength: 5, Type: 'solid',  Label: '餐飲服務' },
  // 政府監管（虛線）
  { Source: '漁業署',       Target: '遠洋漁船船長', Strength: 6, Type: 'dashed', Label: '發照監管' },
  { Source: '漁業署',       Target: '近海漁民',     Strength: 5, Type: 'dashed', Label: '漁業規範' },
  { Source: '食藥署',       Target: '超市量販店',   Strength: 4, Type: 'dashed', Label: '食安稽查' },
  { Source: '食藥署',       Target: '餐廳業者',     Strength: 4, Type: 'dashed', Label: '衛生檢查' },
  { Source: '地方漁會',     Target: '近海漁民',     Strength: 5, Type: 'dashed', Label: '輔導' },
  { Source: '地方漁會',     Target: '養殖戶',       Strength: 4, Type: 'dashed', Label: '技術支援' },
  { Source: '產銷履歷中心', Target: '超市量販店',   Strength: 3, Type: 'dashed', Label: '履歷認證' },
]

// ── Settings（僅保留軸標籤，座標軸從 0 起算）──
const settingsData = [
  { Key: 'XAxisLabel', Value: '供應鏈位置' },
  { Key: 'YAxisLabel', Value: '影響力' },
]

// ── 建立 Excel ──
const wb = XLSX.utils.book_new()

const wsNodes = XLSX.utils.json_to_sheet(nodes)
XLSX.utils.book_append_sheet(wb, wsNodes, 'Nodes')

const wsLinks = XLSX.utils.json_to_sheet(links)
XLSX.utils.book_append_sheet(wb, wsLinks, 'Links')

const wsSettings = XLSX.utils.json_to_sheet(settingsData)
XLSX.utils.book_append_sheet(wb, wsSettings, 'Settings')

const outPath = 'public/sample-data.xlsx'
XLSX.writeFile(wb, outPath)

console.log(`Sample Excel generated: ${outPath}`)
