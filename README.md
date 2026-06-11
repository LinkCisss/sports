# 🏆 YM Sports

一款专为体育爱好者打造的奢华、高保真度赛事直播数据及博彩赔率对比移动端应用，基于 **React Native** 与 **Expo SDK 54** 构建。UI 设计深度借鉴了前沿的 **“iOS 26 Liquid Glass”** 风格，通过提取球队国旗色彩流体、高磨砂毛玻璃折射和流畅的 Native 线程动画，呈现极佳的奢华质感。

---

## 📸 核心功能

### 1. 左右 PK 风格赔率首页 (Odds Feed)
- **对称横向 PK 布局**：摒弃传统上下折叠排列，主页赛事卡片均采用左中右横向 PK 结构：
  - **左侧（主场）**：国旗 + 主队名称向左对齐，并附有雅致的微型主场房子标志。
  - **中间**：斜体加粗的 `VS` 中轴线分割。
  - **右侧（客场）**：客队名称 + 国旗向右对齐，与左侧保持完美镜像。
- **液态国旗取色背景**：根据对阵双方国旗的标志性色调，在卡片背景左上角与右下角生成流体发光球。
- **高磨砂玻璃折射**：卡片采用强度为 `85` 的磨砂毛玻璃（`BlurView`）包裹，使底层色彩混合折射为左右交融的精美渐变光晕，既富有动感又不喧宾夺主。
- **简洁赔率行**：展示首要博彩机构的主胜/平局/客胜的十进制小数赔率，右侧清晰标注其他可选赔率平台数量（如 `+2 更多平台`）。
- **国旗对齐兜底**：内置全面的国际赛事国旗数据库，并支持未匹配成功时的圆角占位框，保证列表高度对称。

### 2. 动感液态 clashing 详情页 (Match Details)
- **流体对决背景**：在页面背景层中，双方国旗主色调化为两颗流体气泡，在手机屏幕上不断交融对撞。动画逻辑均在 UI 线程直接执行，确保 60fps 丝滑帧率。
- **紧凑型毛玻璃导航栏**：状态栏下方采用纤薄的独立毛玻璃标题栏，提供返回功能。下方悬浮对阵信息胶囊，留出 10px 间隙以展现流动光晕。
- **全维度赔率看板**：集成各大国际顶尖博彩平台（如 BetMGM、FanDuel、Marathon Bet 等）在不同玩法（独赢盘 Moneyline、让分盘 Spreads、大小球 Totals）下的多维度赔率对比。
- **智能智能滑出按钮**：底部胶囊投注按钮可在向下滚动浏览赔率列表时自动向下滑动隐藏，向上滑动或滑到顶部时自动滑出显示，最大化内容显示空间。

### 3. 个人中心及本地收藏 (Profile & Favorites)
- **设置面板**：美观的用户设置中心，展示头像、账户数据和应用首选项。
- **赛事书签保存**：支持在卡片或详情页快速点击心形图标，使用本地 `AsyncStorage` 进行数据持久化，在收藏页实时同步赛事开赛提醒。

### 4. 严格本地化配置
- **强制 CST 时区 (UTC+8)**：强制将赛事接口返回的零时区或当地时间换算为中国大陆时间进行显示，保障国内用户观看需求。
- **多语言适配 (i18n)**：中英双语的国际化框架，包括球队中文译名对照、赛事类型和各赔率专有名词的翻译转换。

### 5. 跨域安全代理服务 (CORS Proxies)
- **本地 Web 调试直连**：针对 Web 端本地调试可能遇到的 API 跨域限制，网络层采用自动代理转发，保证数据顺利加载。

---

## 🛠 技术栈与核心依赖

- **核心框架**：[React Native](https://reactnative.dev/) & [Expo SDK 54](https://expo.dev/)
- **路由方案**：[Expo Router v4](https://docs.expo.dev/router/introduction/) (文件式路由)
- **动画引擎**：[React Native Reanimated v3](https://docs.swmansion.com/react-native-reanimated/)
- **磨砂特效**：[Expo Blur](https://docs.expo.dev/versions/latest/sdk/blur-view/) (`BlurView`)
- **数据持久化**：[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- **时间处理**：`dayjs`

---

## 📁 目录结构

```text
├── app/                  # Expo Router 页面及布局目录
│   ├── (tabs)/           # 底部导航页 (赔率首页、收藏页、个人中心)
│   ├── match/            # 赛事详情页面 (包含 PK 流体气泡与智能滑出按钮)
│   └── _layout.tsx       # 全局入口及路由注入
├── components/           # 可复用组件目录
│   ├── MatchCard.tsx     # 左右 PK 玻璃卡片组件 (包含国旗霓虹光晕)
│   ├── LiquidBackground.ts # Reanimated 动感流体背景
│   └── useColorScheme.ts # 主题配色侦听器
├── constants/            # 全局常量 (配色方案 Colors.ts、字体 Typography.ts)
├── lib/                  # 第三方库配置及服务接口
│   ├── oddsApi.ts        # The Odds API 数据接口及跨域代理逻辑
│   └── favorites.ts      # 收藏赛事数据控制器
├── locales/              # 国际化语言包 (zh/en 翻译词条)
├── utils/                # 通用工具函数
│   ├── flags.ts          # 国旗 ISO 映射字典
│   └── teamColors.ts     # 球队国旗配色表
└── update/               # 版本迭代日志目录
```

---

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置 API Key
打开 `lib/oddsApi.ts` 配置文件，在其中配置您从 `the-odds-api.com` 和 `football-data.org` 注册得到的 API key：
```typescript
const ODDS_API_KEY = "您的APIKEY";
```

### 3. 启动项目
```bash
npm start
```
- 按 `w` 键在浏览器中启动 Web 版。
- 按 `i` 键在 iOS 模拟器中运行。
- 按 `a` 键在 Android 模拟器中运行。
- 使用手机端 Expo Go 应用扫描终端内的二维码以在真机调试。

---

## 📄 许可声明
本项目为私有专有软件，保留所有权利。
