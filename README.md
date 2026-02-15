# Qualitative Mapper — 網絡繪測器

透過上傳 Excel 檔案，自動生成帶有分群、連線與象限定位的網絡關係圖，適用於學術研究與利害關係人分析。

**線上使用：** https://wcl-dev.github.io/qualitative-mapper/

## 功能

- 上傳 Excel（含 Nodes / Links / Settings 工作表）即時生成圖表
- **分群包絡線**（Convex Hull）：同組節點自動圈住
- **節點大小**依影響力（Size）以面積比例縮放
- **連線粗細**依強度（Strength），支援實線 / 虛線
- **連線文字標籤**（Label）：選填，描述關係含義
- **象限座標軸**：可切換顯示 / 隱藏，支援自訂交叉點與軸標籤
- **標籤防碰撞**：節點文字自動排開避免重疊
- **畫布互動**：滾輪縮放、拖曳平移、雙擊重置
- **匯出 SVG** 向量檔案，可直接用於 PPT / Illustrator 二次編輯
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

- **X / Y**：節點座標位置（建議 0 ~ 10）
- **Size**：節點大小（建議 1 ~ 10）
- **Group**：分群名稱，決定顏色與包絡線

### Links 工作表（必填）

| Source | Target | Strength | Type | Label |
|--------|--------|----------|------|-------|
| 遠洋漁船船長 | 產地盤商 | 7 | solid | 供貨 |
| 漁業署 | 遠洋漁船船長 | 6 | dashed | 發照監管 |

- **Strength**：連線粗細（建議 1 ~ 10）
- **Type**：`solid`（實線）或 `dashed`（虛線）
- **Label**：選填，顯示在連線中點的文字

### Settings 工作表（選填）

| Key | Value |
|-----|-------|
| XAxisLabel | 供應鏈位置 |
| YAxisLabel | 影響力 |
| XAxisCenter | 3 |
| YAxisCenter | 2.5 |

- **XAxisLabel / YAxisLabel**：象限軸標籤名稱
- **XAxisCenter / YAxisCenter**：軸線交叉點座標（預設為 0）
