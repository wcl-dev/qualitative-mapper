import { useCallback } from 'react'
import { parseExcel } from '../utils/excelParser'

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
        <p className="text-xs text-gray-500 mt-1">學術質化研究繪圖工具</p>
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
              <div className="max-h-40 overflow-auto border border-gray-200 rounded text-xs">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-2 py-1 text-left">Name</th>
                      <th className="px-2 py-1 text-left">Group</th>
                      <th className="px-2 py-1 text-right">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.nodes.map((node, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-2 py-1">{node.Name}</td>
                        <td className="px-2 py-1">{node.Group}</td>
                        <td className="px-2 py-1 text-right">{node.Size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Links ({data.links.length})
              </h3>
              <div className="max-h-40 overflow-auto border border-gray-200 rounded text-xs">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-2 py-1 text-left">Source</th>
                      <th className="px-2 py-1 text-left">Target</th>
                      <th className="px-2 py-1 text-right">Strength</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.links.map((link, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-2 py-1">{link.Source}</td>
                        <td className="px-2 py-1">{link.Target}</td>
                        <td className="px-2 py-1 text-right">{link.Strength}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
