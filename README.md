# 电动汽车智能控制理论与方法 - 官网

一个具有未来科技感、强交互性的单页展示网站，用于展示《电动汽车智能控制理论与方法》教材。

## ✨ 功能特性

### 🎨 视觉特效
- **粒子系统**：Canvas实现的动态粒子背景，支持鼠标交互
- **电路线条**：SVG动画电路线条，营造科技感
- **网格背景**：动态网格动画
- **玻璃拟态**：半透明玻璃效果（Glassmorphism）
- **发光效果**：霓虹线条和光晕效果

### 🖱️ 交互特效
- **点击星星特效**：点击页面任意位置产生星星粒子爆炸效果
- **鼠标跟随光点**：鼠标移动时跟随的光点效果
- **视差效果**：鼠标移动时卡片轻微偏移
- **3D卡片悬停**：书籍卡片3D倾斜和光影扫过效果

### 📜 滚动动画
- **GSAP动画**：使用GSAP和ScrollTrigger实现流畅的滚动进入动画
- **淡入效果**：元素滚动到视口时淡入显示
- **数字计数**：预留数字滚动计数动画接口

### 🤖 AI智能助手
- **悬浮按钮**：右下角AI助手按钮，带脉冲动画
- **聊天窗口**：弹出式聊天界面，支持流式输出（打字机效果）
- **智能问答**：模拟AI回复系统（可接入真实API）

## 🛠️ 技术栈

- **HTML5**：语义化结构
- **CSS3**：动画、渐变、玻璃拟态效果
- **JavaScript**：原生JS实现交互逻辑
- **GSAP 3.12.2**：专业动画库（CDN）
- **ScrollTrigger**：GSAP滚动触发器插件
- **Three.js**：3D库（已引入，可用于未来扩展）

## 📁 文件结构

```
电动汽车智能控制理论与方法/
├── index.html          # 主HTML文件
├── styles.css          # 样式文件
├── script.js           # JavaScript逻辑
├── README.md           # 说明文档
└── 电动汽车智能控制理论与方法书籍封面.jpg  # 书籍封面图片
```

## 🚀 使用方法

1. **直接打开**：双击 `index.html` 文件即可在浏览器中打开
2. **本地服务器**（推荐）：
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 使用Node.js
   npx http-server
   ```
   然后访问 `http://localhost:8000`

## 🎯 主要模块

### 1. Hero区域
- 全屏背景，包含粒子系统和电路线条
- 大标题和副标题
- "十四五"教材标识

### 2. 书籍介绍模块
- 3D卡片展示书籍封面
- 鼠标悬停3D倾斜效果
- 书籍信息和元数据

### 3. 核心内容模块
- 6个核心知识点卡片
- 动态图标和动画进入效果
- 悬停光影扫过效果

### 4. AI智能助手模块
- 功能介绍卡片
- 右下角悬浮按钮
- 弹出式聊天窗口

### 5. 页脚
- 学科方向信息
- 科技感分割线

## 🔧 自定义配置

### 修改主题颜色
在 `styles.css` 的 `:root` 变量中修改：
```css
--primary-orange: #FF6B35;  /* 主橙色 */
--primary-cyan: #4ECDC4;    /* 主青色 */
--dark-bg: #0a0e27;         /* 深色背景 */
```

### 接入真实AI API
在 `script.js` 的 `generateAIResponse` 函数中，替换为真实API调用：
```javascript
async function generateAIResponse(userMessage) {
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });
    const data = await response.json();
    return data.reply;
}
```

### 调整动画速度
修改GSAP动画的 `duration` 参数，或CSS动画的 `animation-duration`。

## 📱 响应式设计

网站已适配：
- **桌面端**：完整特效和布局
- **平板端**：自适应布局调整
- **移动端**：简化布局，保持核心功能

## 🌐 浏览器兼容性

- Chrome/Edge（推荐）
- Firefox
- Safari
- 需要支持ES6+和Canvas API

## 📝 注意事项

1. **网络连接**：需要网络连接以加载CDN资源（GSAP、Three.js）
2. **图片路径**：确保书籍封面图片路径正确
3. **性能优化**：大量粒子可能影响低端设备性能，可在 `initParticleSystem` 中调整 `particleCount`

## 🎨 设计亮点

- **未来科技感**：橙色+青色配色，发光线条，粒子效果
- **工程美学**：网格、电路线条、HUD风格UI
- **流畅动画**：GSAP驱动的专业级动画
- **交互丰富**：点击、悬停、滚动多重交互反馈

## 📄 许可证

本项目仅供学术展示使用。

---

**制作时间**：2024年  
**技术栈**：HTML5 + CSS3 + JavaScript + GSAP  
**设计风格**：未来科技感 / 智能汽车 / 数字孪生