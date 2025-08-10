# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述 (Project Overview)

你正在開發一個圖片背景添加工具 MVP，這是一個純前端的單頁應用程式，允許用戶上傳圖片並為其添加自定義背景。

This is an Image Background Tool MVP - a pure frontend single-page application that allows users to upload images and add custom backgrounds.

## 核心開發原則 (Core Development Principles)

### 1. 嚴格遵循 TDD (測試驅動開發)
你必須按照以下 TDD 流程開發每個功能：
**紅燈 → 綠燈 → 重構**

1. 先寫測試（測試失敗 - 紅燈）
2. 寫最少的代碼讓測試通過（綠燈）
3. 重構代碼保持測試通過
4. 重複循環

**TDD 實施規則：**
- 絕不在沒有失敗測試的情況下寫功能代碼
- 每個功能必須從測試開始
- 測試必須涵蓋正常情況和邊界情況
- 使用 Jest 作為測試框架

### 2. MVP 優先原則
- 只實現 MVP_SPEC.md 中定義的 MVP 功能
- 拒絕任何超出 MVP 範圍的功能請求
- 保持代碼極度簡潔
- 避免過度工程化

### 3. 專案架構
雖然最終交付是單一 HTML 文件，但開發過程使用模組化結構以支援測試

## 技術規範 (Technical Specifications)

### 必須使用 (Required Tech Stack)
- **UIKit 3.x** (via CDN) - CSS 框架
- **原生 JavaScript ES6** - 不使用 TypeScript
- **Canvas API** - 圖片處理
- **File API** - 文件上傳  
- **Jest** - 測試框架
- **jsdom** - DOM 測試環境

### 禁止使用 (Prohibited)
- ❌ jQuery 或其他 JS 框架
- ❌ TypeScript
- ❌ 複雜的框架（React、Vue、Angular）
- ❌ 後端代碼

## 開發命令 (Development Commands)

### Testing Commands
Since this project follows strict TDD, testing is crucial:

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run a specific test file
npm test -- --testPathPattern="filename.test.js"

# Run tests with coverage
npm run test:coverage
```

### Build Commands
```bash
# Build single HTML file for production
npm run build

# Serve development version locally
npm run serve

# Lint JavaScript code
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

## 專案架構 (Project Architecture)

### Development Structure
```
project/
├── src/
│   ├── js/
│   │   ├── app.js              # 主應用邏輯
│   │   ├── imageProcessor.js   # 圖片處理模組
│   │   └── utils.js           # 工具函數
│   ├── css/
│   │   └── style.css          # 自定義樣式
│   └── index.html             # 主頁面模板
├── tests/
│   ├── app.test.js            # 主應用測試
│   ├── imageProcessor.test.js  # 圖片處理測試
│   └── utils.test.js          # 工具函數測試
├── dist/
│   └── index.html             # 打包後的單一文件
└── build.js                   # 構建腳本
```

### Final Output Structure
The production build creates a single `index.html` file containing:
- All JavaScript code inlined
- All CSS styles inlined
- UIKit loaded via CDN
- No external dependencies except UIKit

## MVP 核心功能 (MVP Core Features)

Based on MVP_SPEC.md, implement only these essential features:

1. **圖片上傳** - 單張圖片上傳（僅點擊上傳）
2. **尺寸設定** - 設定輸出尺寸（寬度和高度輸入）
3. **圖片縮放** - 調整圖片縮放（25% - 200%）
4. **背景顏色** - 選擇背景顏色（純色）
5. **實時預覽** - Canvas 即時預覽
6. **下載功能** - 下載結果（PNG 格式）

### 不實現的功能 (Features NOT to implement)
- 拖放上傳
- 貼上上傳
- 漸層背景
- 預設尺寸快速選擇
- 智能顏色推薦
- 多種導出格式
- 響應式設計優化

## Canvas 處理核心邏輯

```javascript
// Canvas 繪製流程 (Canvas Drawing Flow)
1. 創建 canvas 元素，設定目標尺寸
2. 獲取 2D context
3. 繪製背景 (純色)
4. 計算圖片縮放後的尺寸
5. 計算圖片居中位置
6. 使用 drawImage 繪製圖片
7. 導出 canvas 內容
```

## 測試策略 (Testing Strategy)

### 測試文件組織
- 每個模組都有對應的測試文件
- 使用 Jest + jsdom 進行 DOM 測試
- 測試覆蓋所有核心功能和邊界情況

### 關鍵測試場景
- 圖片上傳和驗證
- Canvas 繪製邏輯
- 尺寸計算
- 用戶界面互動
- 錯誤處理

## 錯誤處理 (Error Handling)

```javascript
// 錯誤類型 (Error Types)
- 文件格式不支持
- 文件過大 (>5MB)
- 圖片載入失敗
- Canvas 大小超限
- 瀏覽器不支持

// 處理方式 (Handling)
- 使用 alert() 顯示錯誤 (MVP simplicity)
- 提供解決建議
- 保持應用穩定不崩潰
```

## 開發工作流程 (Development Workflow)

1. **TDD Cycle**: 紅燈 → 綠燈 → 重構
2. **Feature Implementation**: 按 MVP_SPEC.md 順序實現
3. **Testing**: 每個功能都需要完整的測試覆蓋
4. **Build**: 開發完成後打包成單一 HTML 文件
5. **Deployment**: 部署到靜態託管服務 (GitHub Pages, Netlify 等)

## 重要提醒 (Important Reminders)

- **TDD 是強制性的** - 使用 Jest，不是 console
- **測試先行** - 紅燈 → 綠燈 → 重構
- **保持簡單** - MVP 就是最小可行產品
- **測試覆蓋** - 必須達到 80% 以上
- **模組化開發** - 開發時分離，構建時合併

記住：你正在使用專業的 TDD 流程與 Jest 測試框架。每個功能都從測試開始，確保代碼品質和可維護性。最終交付的單一 HTML 文件是經過完整測試的高品質產品。