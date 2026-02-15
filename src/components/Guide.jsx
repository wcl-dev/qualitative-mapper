import { useState } from 'react'

export default function Guide() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 觸發按鈕 */}
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
      >
        使用說明
      </button>

      {/* Modal 背景 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 標題列 */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-800">Excel 輸入格式說明</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* 內容 */}
            <div className="p-5 space-y-6 text-sm text-gray-700">

              {/* 概覽 */}
              <p className="text-gray-500">
                請上傳包含 <strong>Nodes</strong> 與 <strong>Links</strong> 兩個工作表（Sheet）的 Excel 檔案（.xlsx）。
                可選擇性加入 <strong>Settings</strong> 工作表來定義軸標籤。
                以下說明每個欄位如何對應到圖表中的視覺變項。
              </p>

              {/* ── Nodes 工作表 ── */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                  Nodes 工作表（節點）
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 w-24">欄位</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 w-20">類型</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600">說明</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600">圖表對應</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-blue-700">Name</td>
                        <td className="px-4 py-2.5 text-gray-500">文字</td>
                        <td className="px-4 py-2.5">節點名稱（唯一識別碼）</td>
                        <td className="px-4 py-2.5 text-gray-600">顯示為節點旁的<strong>文字標籤</strong></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-blue-700">X</td>
                        <td className="px-4 py-2.5 text-gray-500">數值</td>
                        <td className="px-4 py-2.5">
                          節點的水平座標值
                          <span className="block text-xs text-amber-600 mt-0.5">建議範圍：0 ~ 10</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">決定節點在畫布上的<strong>水平位置</strong>（左 ↔ 右）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-blue-700">Y</td>
                        <td className="px-4 py-2.5 text-gray-500">數值</td>
                        <td className="px-4 py-2.5">
                          節點的垂直座標值
                          <span className="block text-xs text-amber-600 mt-0.5">建議範圍：0 ~ 10</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">決定節點在畫布上的<strong>垂直位置</strong>（下 ↔ 上）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-blue-700">Size</td>
                        <td className="px-4 py-2.5 text-gray-500">數值</td>
                        <td className="px-4 py-2.5">
                          節點的影響力或權重
                          <span className="block text-xs text-amber-600 mt-0.5">建議範圍：1 ~ 10</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">決定節點圓圈的<strong>面積大小</strong>（數值越大，圓越大）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-blue-700">Group</td>
                        <td className="px-4 py-2.5 text-gray-500">文字</td>
                        <td className="px-4 py-2.5">節點所屬分群名稱</td>
                        <td className="px-4 py-2.5 text-gray-600">
                          決定節點的<strong>顏色</strong>，同組節點會被半透明的<strong>包絡線（泡泡）</strong>圈起來
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Links 工作表 ── */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
                  Links 工作表（連線）
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 w-24">欄位</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 w-20">類型</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600">說明</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600">圖表對應</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-orange-700">Source</td>
                        <td className="px-4 py-2.5 text-gray-500">文字</td>
                        <td className="px-4 py-2.5">連線起點的節點名稱</td>
                        <td className="px-4 py-2.5 text-gray-600">必須與 Nodes 的 <code className="bg-gray-100 px-1 rounded">Name</code> 對應</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-orange-700">Target</td>
                        <td className="px-4 py-2.5 text-gray-500">文字</td>
                        <td className="px-4 py-2.5">連線終點的節點名稱</td>
                        <td className="px-4 py-2.5 text-gray-600">必須與 Nodes 的 <code className="bg-gray-100 px-1 rounded">Name</code> 對應</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-orange-700">Strength</td>
                        <td className="px-4 py-2.5 text-gray-500">數值</td>
                        <td className="px-4 py-2.5">
                          兩節點之間的關係強度
                          <span className="block text-xs text-amber-600 mt-0.5">建議範圍：1 ~ 10</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">決定連線的<strong>粗細</strong>（數值越大，線越粗）</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-orange-700">Type</td>
                        <td className="px-4 py-2.5 text-gray-500">文字</td>
                        <td className="px-4 py-2.5">關係類型</td>
                        <td className="px-4 py-2.5 text-gray-600">
                          <code className="bg-gray-100 px-1 rounded">solid</code> = 實線，
                          <code className="bg-gray-100 px-1 rounded">dashed</code> = 虛線
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-orange-700">Label</td>
                        <td className="px-4 py-2.5 text-gray-500">
                          文字
                          <span className="block text-xs text-green-600">選填</span>
                        </td>
                        <td className="px-4 py-2.5">連線的關係描述</td>
                        <td className="px-4 py-2.5 text-gray-600">顯示在連線中點的<strong>文字標籤</strong>（如「供貨」「監管」）；未填則不顯示</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Settings 工作表 ── */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
                  Settings 工作表（選填）
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  用來定義軸標籤名稱與象限交叉點位置。此工作表為選填，沒有也不會報錯。
                </p>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 w-32">Key</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600 w-32">Value（範例）</th>
                        <th className="px-4 py-2.5 font-semibold text-gray-600">說明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-teal-700">XAxisLabel</td>
                        <td className="px-4 py-2.5 text-gray-500">供應鏈位置</td>
                        <td className="px-4 py-2.5">顯示在水平軸線右端的<strong>軸標籤</strong></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-teal-700">YAxisLabel</td>
                        <td className="px-4 py-2.5 text-gray-500">影響力</td>
                        <td className="px-4 py-2.5">顯示在垂直軸線上端的<strong>軸標籤</strong></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-teal-700">XAxisCenter</td>
                        <td className="px-4 py-2.5 text-gray-500">3</td>
                        <td className="px-4 py-2.5">
                          象限 X 軸交叉點的數值座標
                          <span className="block text-xs text-green-600 mt-0.5">選填，預設為 0</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-mono text-teal-700">YAxisCenter</td>
                        <td className="px-4 py-2.5 text-gray-500">2.5</td>
                        <td className="px-4 py-2.5">
                          象限 Y 軸交叉點的數值座標
                          <span className="block text-xs text-green-600 mt-0.5">選填，預設為 0</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── 數值建議範圍 ── */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-800 mb-2">數值建議範圍</h3>
                <p className="text-xs text-amber-700 mb-2">
                  為了讓圖表清晰易讀，請盡量讓數值落在以下範圍內。系統會自動縮放座標，但若數值範圍差異太大（如 1~1000），節點會擠在一起難以辨識。
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white rounded px-3 py-2 border border-amber-100">
                    <span className="font-mono text-amber-800 font-semibold">X / Y</span>
                    <span className="block text-amber-600 mt-0.5">0 ~ 10</span>
                  </div>
                  <div className="bg-white rounded px-3 py-2 border border-amber-100">
                    <span className="font-mono text-amber-800 font-semibold">Size</span>
                    <span className="block text-amber-600 mt-0.5">1 ~ 10</span>
                  </div>
                  <div className="bg-white rounded px-3 py-2 border border-amber-100">
                    <span className="font-mono text-amber-800 font-semibold">Strength</span>
                    <span className="block text-amber-600 mt-0.5">1 ~ 10</span>
                  </div>
                </div>
              </div>

              {/* ── 視覺對應摘要 ── */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                  視覺對應摘要
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { field: 'X / Y', visual: '節點位置', desc: '座標會自動縮放至畫布範圍，軸線交會於所有節點的平均值（中心點）' },
                    { field: 'Size', visual: '節點大小', desc: '使用面積比例映射（√），避免大數值過度放大' },
                    { field: 'Group', visual: '顏色 + 包絡線', desc: '同組節點同色，且被半透明泡泡（Convex Hull）圈住' },
                    { field: 'Strength', visual: '連線粗細', desc: '線性映射，強度越高線越粗' },
                    { field: 'Type', visual: '線條樣式', desc: 'solid = 實線，dashed = 虛線' },
                    { field: 'Label', visual: '連線文字', desc: '選填，顯示在連線中點，描述關係含義' },
                    { field: 'Name', visual: '文字標籤', desc: '自動防碰撞排列，避免密集處重疊' },
                    { field: 'XAxisLabel', visual: 'X 軸名稱', desc: 'Settings 工作表定義，顯示在水平軸右端' },
                    { field: 'YAxisLabel', visual: 'Y 軸名稱', desc: 'Settings 工作表定義，顯示在垂直軸上端' },
                  ].map(({ field, visual, desc }) => (
                    <div key={field} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{field}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-gray-800">{visual}</span>
                      </div>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 範例 ── */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                  Excel 範例
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Nodes 工作表</p>
                    <div className="border border-gray-200 rounded overflow-hidden text-xs">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-1.5 text-left">Name</th>
                            <th className="px-3 py-1.5 text-left">X</th>
                            <th className="px-3 py-1.5 text-left">Y</th>
                            <th className="px-3 py-1.5 text-left">Size</th>
                            <th className="px-3 py-1.5 text-left">Group</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr><td className="px-3 py-1">遠洋漁船船長</td><td className="px-3 py-1">1.0</td><td className="px-3 py-1">4.5</td><td className="px-3 py-1">8</td><td className="px-3 py-1">漁夫</td></tr>
                          <tr><td className="px-3 py-1">批發商</td><td className="px-3 py-1">3.2</td><td className="px-3 py-1">3.2</td><td className="px-3 py-1">8</td><td className="px-3 py-1">盤商</td></tr>
                          <tr><td className="px-3 py-1">一般消費者</td><td className="px-3 py-1">6.0</td><td className="px-3 py-1">3.5</td><td className="px-3 py-1">9</td><td className="px-3 py-1">顧客</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Links 工作表</p>
                    <div className="border border-gray-200 rounded overflow-hidden text-xs">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-1.5 text-left">Source</th>
                            <th className="px-3 py-1.5 text-left">Target</th>
                            <th className="px-3 py-1.5 text-left">Strength</th>
                            <th className="px-3 py-1.5 text-left">Type</th>
                            <th className="px-3 py-1.5 text-left">Label</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr><td className="px-3 py-1">遠洋漁船船長</td><td className="px-3 py-1">產地盤商</td><td className="px-3 py-1">7</td><td className="px-3 py-1">solid</td><td className="px-3 py-1">供貨</td></tr>
                          <tr><td className="px-3 py-1">漁業署</td><td className="px-3 py-1">遠洋漁船船長</td><td className="px-3 py-1">6</td><td className="px-3 py-1">dashed</td><td className="px-3 py-1">發照監管</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Settings 工作表（選填）</p>
                    <div className="border border-gray-200 rounded overflow-hidden text-xs">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-1.5 text-left">Key</th>
                            <th className="px-3 py-1.5 text-left">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr><td className="px-3 py-1">XAxisLabel</td><td className="px-3 py-1">供應鏈位置</td></tr>
                          <tr><td className="px-3 py-1">YAxisLabel</td><td className="px-3 py-1">影響力</td></tr>
                          <tr><td className="px-3 py-1">XAxisCenter</td><td className="px-3 py-1">3</td></tr>
                          <tr><td className="px-3 py-1">YAxisCenter</td><td className="px-3 py-1">2.5</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
