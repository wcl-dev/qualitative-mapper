# Qualitative Mapper — 網絡繪測器

透過上傳 Excel 檔案，自動生成帶有分群、連線與座標定位的網絡關係圖，適用於學術研究與利害關係人分析。

**線上使用：** https://wcl-dev.github.io/qualitative-mapper/

## 功能

- 上傳 Excel（含 Nodes / Links / Settings 工作表）即時生成圖表
- **第一象限座標**：原點 (0,0) 在左下角，L 型座標軸可切換顯示 / 隱藏
- **分群包絡線**（Convex Hull）：同組節點自動圈住
- **多群組支援**：Group 欄位支援 JSON 陣列（如 `["政府","漁夫"]`），節點以扇形色塊併陳顏色
- **節點大小**依影響力（Size）以面積比例縮放
- **連線弧線**：同對節點間的多條連線自動以弧形分散，避免重疊
- **連線粗細**依強度（Strength），支援實線 / 虛線
- **連線文字標籤**（Label）：選填，描述關係含義，自動防碰撞
- **標籤防碰撞**：節點與連線文字統一力模擬，白色背景提升可讀性
- **畫布互動**：滾輪縮放、拖曳平移、雙擊重置
- **匯出 SVG**：自動重設縮放，以 viewBox 確保文字在任何尺寸下清晰可讀
- 內建使用說明與範例 Excel 下載

## 技術堆棧

- React 19 (Vite 7)
- Tailwind CSS v4
- D3.js v7+
- SheetJS (xlsx)
- GitHub Pages (gh-pages)

## 開發

```bash
npm install
npm run dev
```

## 部署

```bash
npm run deploy
```

## Excel 格式

### Nodes 工作表（必填）

| Name | X | Y | Size | Group |
|------|---|---|------|-------|
| 遠洋漁船船長 | 1.0 | 4.5 | 8 | 漁夫 |
| 批發商 | 3.2 | 3.2 | 8 | 盤商 |
| 地方漁會 | 2.0 | 1.5 | 5 | ["政府","漁夫"] |

- **X / Y**：節點座標位置（建議 0 ~ 10），第一象限從 0 開始
- **Size**：節點大小（建議 1 ~ 10）
- **Group**：分群名稱，決定顏色與包絡線；支援 JSON 陣列表示多群組歸屬

### Links 工作表（必填）

| Source | Target | Strength | Type | Label |
|--------|--------|----------|------|-------|
| 遠洋漁船船長 | 產地盤商 | 7 | solid | 供貨 |
| 漁業署 | 遠洋漁船船長 | 6 | dashed | 發照監管 |

- **Strength**：連線粗細（建議 1 ~ 10）
- **Type**：`solid`（實線）或 `dashed`（虛線）
- **Label**：選填，顯示在連線弧線中點的文字

### Settings 工作表（選填）

| Key | Value |
|-----|-------|
| XAxisLabel | 供應鏈位置 |
| YAxisLabel | 影響力 |

- **XAxisLabel / YAxisLabel**：座標軸標籤名稱，顯示在軸端點
