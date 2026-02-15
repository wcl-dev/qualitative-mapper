import * as XLSX from 'xlsx'

/**
 * 解析上傳的 Excel 檔案，提取 Nodes、Links 與 Settings 工作表。
 * @param {File} file - 使用者上傳的 .xlsx/.xls 檔案
 * @returns {Promise<{nodes: Array, links: Array, settings: Object}>}
 */
export async function parseExcel(file) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })

  // 取得 Nodes 工作表
  const nodesSheet = workbook.Sheets['Nodes']
  if (!nodesSheet) {
    throw new Error('找不到 "Nodes" 工作表，請確認 Excel 結構。')
  }

  // 取得 Links 工作表
  const linksSheet = workbook.Sheets['Links']
  if (!linksSheet) {
    throw new Error('找不到 "Links" 工作表，請確認 Excel 結構。')
  }

  const nodes = XLSX.utils.sheet_to_json(nodesSheet)
  const links = XLSX.utils.sheet_to_json(linksSheet)

  // 取得 Settings 工作表（選填，沒有也不報錯）
  const settings = {}
  const settingsSheet = workbook.Sheets['Settings']
  if (settingsSheet) {
    const settingsRows = XLSX.utils.sheet_to_json(settingsSheet)
    settingsRows.forEach(row => {
      if (row.Key && row.Value !== undefined) {
        settings[row.Key] = row.Value
      }
    })
  }

  // 驗證必要欄位
  const requiredNodeFields = ['Name', 'X', 'Y', 'Size', 'Group']
  const requiredLinkFields = ['Source', 'Target', 'Strength', 'Type']

  if (nodes.length > 0) {
    const nodeKeys = Object.keys(nodes[0])
    const missingNode = requiredNodeFields.filter(f => !nodeKeys.includes(f))
    if (missingNode.length > 0) {
      throw new Error(`Nodes 工作表缺少欄位：${missingNode.join(', ')}`)
    }
  }

  if (links.length > 0) {
    const linkKeys = Object.keys(links[0])
    const missingLink = requiredLinkFields.filter(f => !linkKeys.includes(f))
    if (missingLink.length > 0) {
      throw new Error(`Links 工作表缺少欄位：${missingLink.join(', ')}`)
    }
  }

  return { nodes, links, settings }
}
