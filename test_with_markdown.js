#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs').promises;

/**
 * 测试Markdown输出格式
 */
async function testMarkdownOutput() {
    const url = 'https://mp.weixin.qq.com/s/NnFIQ70s1F75bYzwueiDwA';

    console.log('🎯 测试Markdown格式输出...');

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42(0x18002a2c) NetType/WIFI Language/zh_CN',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Referer': 'https://mp.weixin.qq.com/'
            },
            timeout: 10000
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

        // 生成Markdown格式
        const timestamp = new Date().toISOString().split('T')[0];
        const markdown = generateMarkdown(title, content, url, timestamp);

        // 保存到文件
        const filename = `wechat_article_${timestamp.replace(/-/g, '')}.md`;
        await fs.writeFile(filename, markdown, 'utf8');

        console.log('\n✅ 转换成功！');
        console.log(`📖 标题: ${title}`);
        console.log(`📏 内容长度: ${content.length} 字符`);
        console.log(`💾 已保存: ${filename}`);

        // 显示Markdown预览
        const preview = markdown.substring(0, 800);
        console.log('\n📝 Markdown预览:');
        console.log('=' .repeat(60));
        console.log(preview);
        if (markdown.length > 800) {
            console.log('\n...(更多内容)');
        }
        console.log('=' .repeat(60));

        return {
            title,
            content,
            markdown,
            filename,
            success: true
        };

    } catch (error) {
        console.log(`❌ 获取失败: ${error.message}`);
        return {
            success: false,
            error: error.message,
            title: '获取失败',
            content: '',
            markdown: '',
            filename: ''
        };
    }
}

/**
 * 生成Markdown格式
 */
function generateMarkdown(title, content, url, timestamp) {
    // 清理内容中的HTML实体和特殊字符
    const cleanContent = content
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

    // 处理段落和换行
    const processedContent = cleanContent
        .split('\n\n')
        .map(paragraph => {
            // 移除多余空格
            const trimmed = paragraph.trim();

            // 如果是空行，保留
            if (!trimmed) return '';

            // 如果太短，可能是单行文本，保留原样
            if (trimmed.length < 50) return trimmed;

            // 如果行数较多，处理换行
            const lines = trimmed.split('\n');
            if (lines.length > 3) {
                return lines.map(line => line.trim()).join('\n');
            }

            return trimmed;
        })
        .filter(line => line.length > 0)
        .join('\n\n');

    // 提取图片（如果有）
    const imgMatches = content.match(/<img[^>]*src="([^"]*)"[^>]*>/g);
    const images = imgMatches ? imgMatches.map((match, index) => {
        const srcMatch = match.match(/src="([^"]*)"/);
        const altMatch = match.match(/alt="([^"]*)"/) || ['', '图片'];
        const alt = altMatch[1] || `图片${index + 1}`;
        return {
            alt,
            url: srcMatch[1]
        };
    }) : [];

    // 生成Markdown
    let markdown = `# ${title}

> 📅 获取时间: ${timestamp}
> 🔗 原文链接: ${url}

---

## 📖 文章内容

${processedContent}`;

    // 添加图片部分
    if (images.length > 0) {
        markdown += `

## 📷 图片资源

`;
        images.forEach((img, index) => {
            markdown += `\n\n### 图片${index + 1}: ${img.alt}\n![${img.alt}](${img.url})`;
        });
    }

    // 添加元数据
    markdown += `

---

## 📊 元数据

- **标题**: ${title}
- **URL**: ${url}
- **获取时间**: ${timestamp}
- **内容长度**: ${content.length} 字符
- **图片数量**: ${images.length}
- **格式**: Markdown

---

**🔧 由 [wechat-get](https://www.npmjs.com/package/wechat-get) 工具生成
**💡 获取公众号文章，突破验证限制，获取完整原文**`;

    return markdown;
}

// 运行测试
testMarkdownOutput();