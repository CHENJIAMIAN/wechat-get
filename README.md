[English](./README.en.md)

<!-- codex-github-rules:bilingual-summary -->
> **中文简介**：绕过验证限制并获取完整原文的微信文章工具
>
> **English summary**: A tool for retrieving complete WeChat articles despite verification restrictions

---
# 🚀 wechat-get - 微信文章获取工具
<!-- DISCLAIMER-START -->
## ⚠️ 免责声明（仅供学习研究）

本仓库内容**仅供学习、研究和技术交流使用**，**不用于任何商业用途**。

仓库中涉及的源码、资源、商标及其他知识产权均归**原作者/原厂商所有**，本仓库无意侵犯任何权益。

如您认为本仓库任何内容侵犯了您的权益，请通过 GitHub Issues 或邮件联系，经核实后将**立即删除**相关内容。

<!-- DISCLAIMER-END -->

[![npm version](https://badge.fury.io/js/wechat-get.svg)](https://badge.fury.io/js/wechat-get)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 突破微信验证限制，一键获取公众号完整原文

## ✨ 特性

- 🎯 **一键安装** - npm install，无需配置
- 🛡️ **突破验证** - 多层技术突破微信反爬虫机制
- 📱 **跨平台** - 支持 Windows、macOS、Linux
- 🚀 **简单易用** - 一个命令搞定：`npx wechat-get URL`
- 📊 **批量处理** - 支持批量获取多篇文章
- 🎨 **精美的CLI** - 彩色输出、进度显示
- 📦 **多种格式** - 支持 JSON、TXT 导出

## 🚀 快速开始

### 安装

```bash
# 全局安装
npm install -g wechat-get

# 或者临时使用 (推荐)
npx wechat-get <URL>
```

### 基础用法

```bash
# 获取单个文章
npx wechat-get "https://mp.weixin.qq.com/s/文章ID"

# 简化命令
npx wg "https://mp.weixin.qq.com/s/文章ID"

# 保存为特定文件名
npx wechat-get "URL" -o my-article

# 指定输出目录
npx wechat-get "URL" -d ./articles
```

### 高级用法

```bash
# 批量获取
npx wechat-get --batch urls.txt

# 静默模式
npx wechat-get "URL" --quiet

# 详细模式
npx wechat-get "URL" --verbose
```

## 📖 使用示例

### 1. 获取单个文章

```bash
npx wechat-get "https://mp.weixin.qq.com/s/NnFIQ70s1F75bYzwueiDwA"
```

### 2. 批量处理

创建 `urls.txt` 文件：
```text
https://mp.weixin.qq.com/s/article1
https://mp.weixin.qq.com/s/article2
https://mp.weixin.qq.com/s/article3
```

运行批量获取：
```bash
npx wechat-get --batch urls.txt -d ./my_articles
```

### 3. 编程接口

```javascript
const WeChatScraper = require('wechat-get');

const scraper = new WeChatScraper();

// 获取单个文章
const result = await scraper.getArticle('https://mp.weixin.qq.com/s/xxx');

console.log(result.title);
console.log(result.content);
```

## 🛠️ API 文档

### Constructor

```javascript
new WeChatScraper(options)
```

**Options:**
- `timeout` (Number): 请求超时时间，默认 30000ms
- `retryCount` (Number): 重试次数，默认 3
- `delay` (Number): 请求间隔，默认 2000ms

### Methods

#### `getArticle(url)`

获取单个微信文章。

**Returns:**
```javascript
{
  title: '文章标题',
  content: '文章内容',
  success: true/false
}
```

## 🔧 技术原理

本项目采用**多层突破策略**：

1. **高级隐身攻击** - 完美模拟真实微信客户端
2. **智能重试机制** - 自动应对验证升级
3. **动态Cookie生成** - 自适应反爬虫机制

## 🌍 兼容性

- ✅ Node.js 14+
- ✅ npm 6+
- ✅ Windows 10+
- ✅ macOS 10.14+
- ✅ Ubuntu 18.04+

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## ⚡ 更新日志

### v1.0.0 (2024-12-09)
- 🎉 首次发布
- ✨ 支持微信文章获取
- 🛡️ 突破验证机制
- 📱 多平台支持

## 📞 支持

- 📧 Email: team@wechat-get.com
- 💬 Issues: [GitHub Issues](https://github.com/wechat-get/wechat-get/issues)

---

⭐ 如果这个项目对你有帮助，请给个 Star！

*让知识获取更加自由，让学习不再有限制* 🚊
