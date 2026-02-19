import { useRef, useEffect, useState, useCallback } from 'react'
import { renderChart } from '../utils/renderChart'
import { exportSVG } from '../utils/exportSVG'
import Guide from './Guide'

export default function Canvas({ data }) {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [showAxes, setShowAxes] = useState(false)

  // 只在 data 變化時重新渲染圖表（不受 showAxes 影響）
  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return

    const { width, height } = containerRef.current.getBoundingClientRect()
    renderChart(svgRef.current, data, width, height)
  }, [data])

  // 切換座標軸：直接操作 DOM display，不重繪圖表
  useEffect(() => {
    if (!svgRef.current) return
    const axesLayer = svgRef.current.querySelector('.axes-layer')
    if (axesLayer) {
      axesLayer.setAttribute('display', showAxes ? 'inline' : 'none')
    }
  }, [showAxes, data])

  const handleExport = () => {
    if (!svgRef.current) return
    exportSVG(svgRef.current)
  }

  return (
    <main className="flex-1 flex flex-col bg-white">
      {/* 工具列 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">畫布預覽</span>
          {data && (
            <span className="text-xs text-gray-400">滾輪縮放 · 拖曳平移 · 雙擊重置</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Guide />
          <button
            onClick={() => setShowAxes(v => !v)}
            disabled={!data}
            className={`px-3 py-1.5 text-sm border rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              showAxes
                ? 'bg-gray-700 text-white border-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {showAxes ? '隱藏座標軸' : '顯示座標軸'}
          </button>
          <button
            onClick={handleExport}
            disabled={!data}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            匯出 SVG
          </button>
        </div>
      </div>

      {/* SVG 畫布 */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        {data ? (
          <svg ref={svgRef} className="w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
              <p className="text-sm">請先上傳 Excel 檔案以生成圖表</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
