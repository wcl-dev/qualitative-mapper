# Qualitative Research Mapper

網絡繪測器 — 透過上傳 Excel 檔案，自動生成符合學術出版規範的「矩陣對比兼組織分群圖」。

## 功能

- 上傳 Excel（含 Nodes / Links 工作表）自動生成圖表
- 自動分群包絡線（Convex Hull）
- 節點大小依影響力（Size）縮放
- 連線粗細依強度（Strength），實線/虛線依類型（Type）
- 標籤防碰撞
- 匯出標準 SVG 向量檔案

## 技術堆棧

- React (Vite)
- Tailwind CSS
- D3.js v7+
- SheetJS (xlsx)

## 開發

```bash
npm install
npm run dev
```

## 部署

本專案部署於 GitHub Pages：

```bash
npm run build
npm run deploy
```

## Excel 格式

### Nodes 工作表

| Name | X | Y | Size | Group |
|------|---|---|------|-------|
| 節點A | 1.2 | 3.4 | 5 | 群組1 |

### Links 工作表

| Source | Target | Strength | Type |
|--------|--------|----------|------|
| 節點A | 節點B | 3 | solid |
