# 图标文件设置说明

## 需要的图标文件

为了确保 Google 搜索结果正确显示网站图标，需要准备以下文件并放置在 `public/` 目录下：

### 必需文件

1. **icon-192x192.png** (192x192 像素)
   - 格式：PNG
   - 尺寸：192x192 像素
   - 用途：Google 搜索结果图标、PWA 图标
   - 要求：正方形，背景透明或纯色

2. **icon-512x512.png** (512x512 像素)
   - 格式：PNG
   - 尺寸：512x512 像素
   - 用途：Google 搜索结果图标、PWA 主图标
   - 要求：正方形，背景透明或纯色

### 现有文件

- **favicon.ico** (已存在)
  - 浏览器标签页图标

## 如何创建图标

### 方法一：使用在线工具
1. 访问 https://realfavicongenerator.net/
2. 上传你的 logo 或图标
3. 下载生成的图标文件
4. 将 `icon-192x192.png` 和 `icon-512x512.png` 复制到 `public/` 目录

### 方法二：使用设计工具
1. 使用 Figma、Photoshop、GIMP 等工具
2. 创建 192x192 和 512x512 的正方形图标
3. 导出为 PNG 格式
4. 保存到 `public/` 目录

### 方法三：基于现有 favicon 转换
1. 使用 ImageMagick 或在线转换工具
2. 将 favicon.ico 转换为 PNG
3. 调整尺寸为 192x192 和 512x512
4. 保存到 `public/` 目录

## 图标设计建议

- **简洁明了**：图标在小尺寸下也要清晰可辨
- **品牌一致**：与网站整体设计风格保持一致
- **高对比度**：确保在各种背景下都清晰可见
- **避免文字**：小尺寸下文字难以阅读

## 验证图标

部署后，可以通过以下方式验证：

1. **浏览器检查**
   - 访问 `https://yourdomain.com/icon-192x192.png`
   - 访问 `https://yourdomain.com/icon-512x512.png`
   - 访问 `https://yourdomain.com/manifest.json`

2. **Google Rich Results Test**
   - 访问 https://search.google.com/test/rich-results
   - 输入你的网站 URL
   - 检查图标是否正确显示

3. **Google Search Console**
   - 登录 Google Search Console
   - 使用 URL 检查工具
   - 查看网站图标状态

## 注意事项

- 图标文件必须是 PNG 格式
- 尺寸必须精确（192x192 和 512x512）
- 文件必须放在 `public/` 目录下
- 部署后可能需要等待 Google 重新抓取（通常 1-2 周）
