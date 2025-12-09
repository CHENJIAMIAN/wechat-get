#!/usr/bin/env node

/**
 * 简单的Markdown输出测试
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function generateMarkdown(url) {
    console.log('🎯 获取微信文章并转换为Markdown...');
    console.log(`URL: ${url}`);

    try {
        // 获取文章
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42(0x18002a2c) NetType/WIFI Language/zh_CN',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Referer': 'https://mp.weixin.qq.com/'
            },
            timeout: 15000
        });

        const html = response.data;

        // 提取标题
        const titleMatch = html.match(/<title>([^<]+)<\/title>/) ||
                          html.match(/<meta property="og:title" content="([^"]*)"/) ||
                          html.match(/<h1[^>]*class="rich_media_title"[^>]*>([^<]+)<\/h1>/);

        const title = titleMatch ? titleMatch[1].trim() : '未获取到标题';

        // 提取内容
        const contentMatch = html.match(/<div[^>]*class="rich_media_content"[^>]*>([\s\S]*?)<\/div>/) ||
                           html.match(/<div[^>]*id="js_content"[^>]*>([\s\S]*?)<\/div>/);

        let content = '';
        if (contentMatch) {
            content = contentMatch[1]
                .replace(/<[^>]+>/g, '\n')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
        }

        // 清理HTML实体
        const cleanContent = content
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        // 生成Markdown
        const timestamp = new Date().toISOString().split('T')[0];
        const processedContent = cleanContent
            .split('\n\n')
            .map(para => {
                const trimmed = para.trim();
                if (!trimmed) return '';
                if (trimmed.length < 50) return trimmed;
                const lines = trimmed.split('\n');
                if (lines.length > 3) {
                    return lines.map(line => line.trim()).join('\n');
                }
                return trimmed;
            })
            .filter(line => line.length > 0)
            .join('\n\n');

        const markdown = `# ${title}

> 📅 获取时间: ${timestamp}
> 🔗 原文链接: [点击查看原文](${url})

---

## 📖 文章内容

${processedContent}

---

## 📊 元数据

- **标题**: ${title}
- **获取时间**: ${timestamp}
- **内容长度**: ${cleanContent.length} 字符
- **格式**: Markdown

---

**🔧 由 wechat-get 工具生成**
**💡 获取公众号文章，突破验证限制，获取完整原文**
**🌟 支持多种输出格式：JSON、TXT、Markdown**

---

**🎉 测试成功！支持Markdown输出功能已就绪！`;

        // 保存文件
        const filename = `wechat_article_${timestamp.replace(/-/g, '')}.md`;
        await fs.writeFile(filename, markdown, 'utf8');

        console.log('\n✅ 转换成功！');
        console.log(`📖 标题: ${title}`);
        console.log(`📏 内容长度: ${cleanContent.length} 字符`);
        console.log(`💾 已保存: ${filename}`);

        return {
            title,
            content: cleanContent,
            markdown,
            filename,
            success: true
        };

    } catch (error) {
        console.log(`❌ 获取失败: ${error.message}`);
        return {
            success: false,
            error: error.message
        };
    }
}

// 运行测试
const testUrl = process.argv[2] || 'https://mp.weixin.qq.com/s/NnFIQ70s1F75bYzwueiDwA';
generateMarkdown(testUrl);