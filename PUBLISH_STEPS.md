# 🚀 微信文章获取工具 - 发布步骤

> [English](PUBLISH_STEPS.en.md)

## 📋 发布前检查清单

### ✅ 包状态检查
- [x] package.json 配置完整
- [x] bin/ 命令可执行
- [x] 源代码功能正常
- [x] README.md 完整
- [x] LICENSE 文件存在
- [x] .gitignore 配置正确

### ✅ 功能测试
- [x] CLI 帮助正常: `node bin/wechat-get.js --help`
- [x] 实际获取功能: 成功获取文章
- [x] 简化命令: `wg` 工具正常

## 🚀 发布流程

### 第1步: 登录 npm
```bash
npm login
# 输入用户名、密码、邮箱
```

### 第2步: 检查包名可用性
```bash
npm view wechat-get
# 如果包名被占用，修改 package.json 中的 name
# 可选名称: wechat-get-tool, get-wechat-article, wechat-article-getter
```

### 第3步: 发布到测试环境
```bash
# 打包测试
npm pack

# 检查生成的包
ls *.tgz
```

### 第4步: 正式发布
```bash
# 发布公开包
npm publish --access public

# 如果有错误，查看详细日志
npm publish --access public --verbose
```

### 第5步: 验证发布
```bash
# 查看包信息
npm view wechat-get

# 临时使用测试
npx wechat-get --help

# 如果包名冲突，使用备用名称
npx wechat-tool --help
```

## 📦 备用包名（如果主包名被占用）

1. `wechat-get-tool`
2. `get-wechat-article`
3. `wechat-article-getter`
4. `weixin-article-get`
5. `mp-wechat-get`

## 🎯 发布后测试

### 本地测试
```bash
# 临时使用
npx wechat-get "https://mp.weixin.qq.com/s/NnFIQ70s1F75bYzwueiDwA"

# 安装后使用
npm install -g wechat-get
wechat-get "URL"
```

### 跨平台测试
```bash
# 测试不同操作系统
- Windows: 使用 WSL
- macOS: 直接测试
- Linux: 直接测试
```

## 📊 成功指标

### 立即可用
- ✅ npx 命令正常工作
- ✅ 全局安装正常工作
- ✅ 获取文章功能正常

### 用户反馈
- 下载量统计
- GitHub Stars
- Issue 反馈
- 用户评价

## 🔧 问题处理

### 常见发布错误

1. **包名已存在**
   ```bash
   # 修改 package.json 中的 name
   npm view new-package-name
   ```

2. **权限不足**
   ```bash
   npm owner ls package-name
   # 确保有发布权限
   ```

3. **文件缺失**
   ```bash
   # 检查 files 字段
   npm pack -dry-run
   ```

4. **依赖问题**
   ```bash
   npm audit
   npm audit fix
   ```

## 📈 发布后推广

### 社区分享
- GitHub 官方发布
- 技术社区推荐
- 社交媒体宣传
- 技术博客介绍

### 文档更新
- GitHub README 更新
- 使用文档完善
- API 文档补充

### 用户支持
- GitHub Issues 响应
- 用户反馈收集
- 功能建议整理

---

**准备好开始发布了吗？让我们把这个工具分享给全世界！🚀**
