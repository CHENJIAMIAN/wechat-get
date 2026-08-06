# 🚀 WeChat Article Fetcher - Publishing Steps

> [中文](PUBLISH_STEPS.md)

## 📋 Pre-publishing checklist

### ✅ Package status
- [x] `package.json` is fully configured.
- [x] The `bin/` command is executable.
- [x] Source functionality works.
- [x] README.md is complete.
- [x] LICENSE file exists.
- [x] `.gitignore` is configured correctly.

### ✅ Functional testing
- [x] CLI help works: `node bin/wechat-get.js --help`.
- [x] Real fetching works: articles are fetched successfully.
- [x] Short command: the `wg` tool works.

## 🚀 Publishing process

### Step 1: Sign in to npm
```bash
npm login
# 输入用户名、密码、邮箱
```

### Step 2: Check package-name availability
```bash
npm view wechat-get
# 如果包名被占用，修改 package.json 中的 name
# 可选名称: wechat-get-tool, get-wechat-article, wechat-article-getter
```

### Step 3: Publish to a test environment
```bash
# 打包测试
npm pack

# 检查生成的包
ls *.tgz
```

### Step 4: Publish publicly
```bash
# 发布公开包
npm publish --access public

# 如果有错误，查看详细日志
npm publish --access public --verbose
```

### Step 5: Verify the release
```bash
# 查看包信息
npm view wechat-get

# 临时使用测试
npx wechat-get --help

# 如果包名冲突，使用备用名称
npx wechat-tool --help
```

## 📦 Backup package names (when the main name is unavailable)

1. `wechat-get-tool`
2. `get-wechat-article`
3. `wechat-article-getter`
4. `weixin-article-get`
5. `mp-wechat-get`

## 🎯 Post-publish tests

### Local test
```bash
# 临时使用
npx wechat-get "https://mp.weixin.qq.com/s/NnFIQ70s1F75bYzwueiDwA"

# 安装后使用
npm install -g wechat-get
wechat-get "URL"
```

### Cross-platform test
```bash
# 测试不同操作系统
- Windows: 使用 WSL
- macOS: 直接测试
- Linux: 直接测试
```

## 📊 Success metrics

### Immediately usable
- ✅ The npx command works.
- ✅ Global installation works.
- ✅ Article fetching works.

### User feedback
- Download counts
- GitHub Stars
- Issue feedback
- User reviews

## 🔧 Troubleshooting

### Common publishing errors

1. **Package name already exists**
   ```bash
   # 修改 package.json 中的 name
   npm view new-package-name
   ```

2. **Insufficient permissions**
   ```bash
   npm owner ls package-name
   # 确保有发布权限
   ```

3. **Missing files**
   ```bash
   # 检查 files 字段
   npm pack -dry-run
   ```

4. **Dependency issues**
   ```bash
   npm audit
   npm audit fix
   ```

## 📈 Promotion after publishing

### Community sharing
- Official GitHub release
- Recommendations in technical communities
- Social-media promotion
- Technical-blog introduction

### Documentation updates
- Update the GitHub README
- Improve usage documentation
- Add API documentation

### User support
- Respond to GitHub Issues
- Collect user feedback
- Organize feature suggestions

---

**Ready to publish? Let's share this tool with the world. 🚀**
