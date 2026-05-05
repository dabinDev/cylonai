# 赛隆AI创作平台 (Cylon AI Creation Platform)

AI驱动的一站式内容创作服务平台，涵盖AI短视频、AI短剧、AI语音制作、AI图片生成等核心业务。

## 技术栈

- **框架**: Next.js 16 (App Router + Turbopack)
- **样式**: Tailwind CSS v4
- **3D渲染**: Three.js + React Three Fiber + Postprocessing (Bloom)
- **数据库**: Prisma v7 + SQLite
- **认证**: JWT (jsonwebtoken + bcryptjs)
- **Markdown**: next-mdx-remote
- **字体**: Inter + Noto Sans SC

## 核心功能

### 前台
- **3D粒子Hero**: 三层深度粒子场（星云层/流动光点层/水晶层），Bloom辉光滤镜，鼠标引力交互，滚动触发粒子汇聚
- **3D悬浮卡片**: 核心业务展示，棱镜折射边缘效果，非等速浮动动画，鼠标跟随聚光灯
- **动态神经网络**: 数据流星信号，扫描线Glitch效果，矩阵代码雨
- **自定义光标**: 延迟跟随光圈，交互元素放大反馈
- **博客系统**: SSR渲染，动态SEO meta，分页

### 后台管理
- JWT登录认证
- Markdown编辑器（支持图片粘贴/拖拽上传）
- 文章CRUD（创建、编辑、删除、发布）
- 图片上传管理

## 开发

```bash
# 安装依赖
npm install

# 初始化数据库
npx prisma migrate dev
npx prisma db seed

# 启动开发服务器
npm run dev
```

## 项目结构

```
app/
  page.tsx              # 首页（SSR数据获取）
  blog/                 # 博客页面
  admin/                # 后台管理
  api/                  # API路由
components/
  HeroCanvas.tsx        # Three.js 3D粒子Hero
  ServicesSection3D.tsx # 3D悬浮卡片
  ServiceCard3D.tsx     # 单个3D卡片（棱镜折射）
  NeuralTraining.tsx    # 神经网络+流星+Glitch
  CustomCursor.tsx      # 自定义光标
  HomeContent.tsx       # 首页滚动布局
  Header.tsx            # 导航栏
  Footer.tsx            # 页脚
  BlogPreview.tsx       # 博客预览
  MdEditor.tsx          # Markdown编辑器
lib/
  prisma.ts             # Prisma客户端
  auth.ts               # JWT认证工具
prisma/
  schema.prisma         # 数据模型
  seed.ts               # 种子数据
```
