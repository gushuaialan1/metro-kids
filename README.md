# 🚇 地铁小侦探 (Metro Kids)

一个专为儿童设计的中国城市地铁线路图探索网站。

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)

## ✨ 功能特点

- 🗺️ **城市探索** - 查看中国主要城市的地铁系统
- 🚇 **线路详情** - 浏览每条线路的站点信息
- 🏆 **趣味排行** - 各城市地铁数据对比排名
- 🎨 **儿童友好** - 明亮的配色、可爱的动画、简单易懂
- 📱 **响应式设计** - 支持电脑、平板、手机访问

## 🛠️ 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) + React 19
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图表**: [ECharts](https://echarts.apache.org/)
- **图标**: [Lucide React](https://lucide.dev/)

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/gushuaialan1/metro-kids.git
cd metro-kids

# 安装依赖
npm install

# 配置高德地图 API Key（可选，但推荐）
cp .env.local.example .env.local
# 编辑 .env.local，填入你的高德地图 Key

# 启动开发服务器
npm run dev

# 打开 http://localhost:3000
```

## 🔑 高德地图 API Key 配置

本项目使用高德地图 JS API 显示交互式地铁图。

### 申请步骤
1. 访问 [高德开放平台](https://console.amap.com/dev/key/app)
2. 注册/登录账号
3. 创建新应用，选择「Web 端(JS API)」
4. 复制 Key，填入 `.env.local` 文件

```bash
NEXT_PUBLIC_AMAP_KEY=你的高德地图Key
```

### 不配置 Key 会怎样？
如果不配置 Key，城市详情页将无法显示交互式地铁图，但其他功能（线路列表、站点信息等）仍可正常使用。

## 📦 构建部署

```bash
# 构建静态网站
npm run build

# 输出到 dist 目录
```

## 📁 项目结构

```
metro-kids/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── cities/            # 城市列表页
│   ├── city/[id]/         # 城市详情页
│   │   └── line/[lineId]/ # 线路详情页
│   └── rankings/          # 排行榜页
├── data/
│   └── subwayData.ts      # 地铁数据
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 📝 数据来源

- 城市地铁数据来自公开资料整理
- 部分线路数据参考了开源项目 [thecuvii/subway](https://github.com/thecuvii/subway)

## 🎯 待办事项

- [ ] 添加更多城市详细线路数据
- [ ] 地铁线路图可视化 (AntV X6)
- [ ] 站点搜索功能
- [ ] 数据更新自动化
- [ ] 多语言支持

## 📄 许可证

MIT License

---

🌈 专为小朋友设计的地铁探索网站
