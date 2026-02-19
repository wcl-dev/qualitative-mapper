import { useCallback } from 'react'
import { parseExcel } from '../utils/excelParser'

function CellValue({ value }) {
  if (value == null) return null
  const str = String(value).trim()
  if (str.startsWith('[')) {
    try {
      const arr = JSON.parse(str)
      if (Array.isArray(arr)) {
        return (
          <span className="flex flex-wrap gap-0.5">
            {arr.map((item, i) => (
              <span
                key={i}
                className="inline-block bg-indigo-50 text-indigo-700 rounded px-1 text-[10px] leading-tight"
              >
                {item}
              </span>
            ))}
          </span>
        )
      }
    } catch (_) { /* not JSON */ }
  }
  return <>{str}</>
}

function DataTable({ rows }) {
  if (!rows || rows.length === 0) return null
  const columns = Object.keys(rows[0])

  return (
    <div className="max-h-40 overflow-auto border border-gray-200 rounded text-xs">
      <table className="min-w-full whitespace-nowrap">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            {columns.map(col => (
              <th key={col} className="px-2 py-1 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-gray-100">
              {columns.map(col => (
                <td key={col} className="px-2 py-1">
                  <CellValue value={row[col]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Sidebar({ data, onDataLoaded }) {
  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const parsed = await parseExcel(file)
      onDataLoaded(parsed)
    } catch (err) {
      alert('Excel 解析失敗：' + err.message)
    }
  }, [onDataLoaded])

  return (
    <aside className="w-80 border-r border-gray-200 bg-white flex flex-col shadow-sm">
      {/* 標題 */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">Qualitative Mapper</h1>
        <p className="text-xs text-gray-500 mt-1">網絡繪測器</p>
      </div>

      {/* 上傳區域 */}
      <div className="p-4 border-b border-gray-200">
        <label
          htmlFor="excel-upload"
          className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm text-gray-500">點擊上傳 Excel 檔案</span>
          <span className="text-xs text-gray-400 mt-1">.xlsx / .xls</span>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        <a
          href={import.meta.env.BASE_URL + 'sample-data.xlsx'}
          download="sample-data.xlsx"
          className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 text-xs text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          下載範例 Excel
        </a>
      </div>

      {/* 數據預覽 */}
      <div className="flex-1 overflow-auto p-4">
        {data ? (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              數據預覽
            </h2>
            <div className="mb-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Nodes ({data.nodes.length})
              </h3>
              <DataTable rows={data.nodes} />
            </div>
            <div className="mb-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Links ({data.links.length})
              </h3>
              <DataTable rows={data.links} />
            </div>
            {data.settings && Object.keys(data.settings).length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Settings ({Object.keys(data.settings).length})
                </h3>
                <DataTable
                  rows={Object.entries(data.settings).map(([key, value]) => ({ Key: key, Value: value }))}
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center mt-8">
            尚未載入數據
          </p>
        )}
      </div>
    </aside>
  )
}
