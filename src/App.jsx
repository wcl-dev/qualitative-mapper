import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'

function App() {
  const [data, setData] = useState(null)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左側：上傳與數據預覽 */}
      <Sidebar data={data} onDataLoaded={setData} />

      {/* 右側：D3 畫布 */}
      <Canvas data={data} />
    </div>
  )
}

export default App
