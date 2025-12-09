const axios = require('axios');
let cheerio;
try {
  cheerio = require('cheerio');
} catch (e) {
  cheerio = null;
}

/**
 * 微信文章获取器 - 核心引擎
 */
class WeChatScraper {
  constructor(options = {}) {
    this.options = {
      timeout: options.timeout || 30000,
      retryCount: options.retryCount || 3,
      delay: options.delay || 2000,
      ...options
    };

    // 创建axios实例
    this.client = axios.create({
      timeout: this.options.timeout,
      headers: this.getHeaders(),
      maxRedirects: 5
    });
  }

  getHeaders() {
    return {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42(0x18002a2c) NetType/WIFI Language/zh_CN',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Origin': 'https://mp.weixin.qq.com',
      'Referer': 'https://mp.weixin.qq.com/'
    };
  }

  delay(ms = null) {
    const delayTime = ms || this.options.delay + Math.random() * 2000;
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }

  async simulateBrowser() {
    try {
      // 访问主页
      await this.client.get('https://mp.weixin.qq.com');
      await this.delay(1000 + Math.random() * 2000);
    } catch (error) {
      // 忽略主页访问错误
    }
  }

  extractContent(html) {
    try {
      const $ = cheerio.load(html);

      // 提取标题
      let title = '';
      const titleMeta = $('meta[property="og:title"]').first();
      if (titleMeta.length) {
        title = titleMeta.attr('content');
      }

      if (!title) {
        const titleElement = $('h1.rich_media_title').first();
        if (titleElement.length) {
          title = titleElement.text().trim();
        }
      }

      // 提取内容
      let content = '';
      const contentElement = $('#js_content, .rich_media_content').first();

      if (contentElement.length) {
        // 清理HTML并保留文本
        content = contentElement.text() || contentElement.html();
        content = content
          .replace(/<[^>]+>/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
      }

      return {
        title: title || '未获取到标题',
        content: content || '未获取到内容',
        success: !!(title && content)
      };

    } catch (error) {
      return {
        title: '解析错误',
        content: `内容解析失败: ${error.message}`,
        success: false
      };
    }
  }

  isVerificationPage(html) {
    const verificationKeywords = ['验证页面', 'verification', '环境异常', 'antispam'];
    const lowerHtml = html.toLowerCase();
    return verificationKeywords.some(keyword =>
      lowerHtml.includes(keyword.toLowerCase())
    );
  }

  async getArticle(url) {
    console.log(`🎯 正在获取: ${url}`);

    try {
      // 模拟浏览器行为
      await this.simulateBrowser();

      // 获取文章页面
      const response = await this.client.get(url);
      const html = response.data;

      // 检查是否是验证页面
      if (this.isVerificationPage(html)) {
        console.log('🔒 检测到验证页面，尝试突破...');

        // 尝试多次突破
        for (let i = 0; i < 3; i++) {
          await this.delay(2000);
          const retryResponse = await this.client.get(url);
          const retryHtml = retryResponse.data;

          if (!this.isVerificationPage(retryHtml)) {
            console.log('✅ 突破成功！');
            return this.extractContent(retryHtml);
          }
        }

        console.log('❌ 突破失败');
        return {
          title: '验证页面',
          content: '无法突破微信验证页面',
          success: false
        };
      }

      // 提取内容
      return this.extractContent(html);

    } catch (error) {
      console.log(`❌ 获取失败: ${error.message}`);
      return {
        title: '获取失败',
        content: `错误: ${error.message}`,
        success: false
      };
    }
  }

  async getMultipleArticles(urls, options = {}) {
    const results = [];
    const { delay = 3000 } = options;

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`📊 进度: ${i + 1}/${urls.length}`);

      const result = await this.getArticle(url);
      results.push({ url, result });

      if (i < urls.length - 1) {
        await this.delay(delay);
      }
    }

    return results;
  }

  /**
   * 生成Markdown格式
   */
  generateMarkdown(result, url) {
    // 清理内容中的HTML实体和特殊字符
    const cleanContent = result.content
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
        const trimmed = paragraph.trim();
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

    const timestamp = new Date().toISOString().split('T')[0];

    let markdown = `# ${result.title}

> 📅 获取时间: ${timestamp}
> 🔗 原文链接: [点击查看原文](${url || ''})

---

## 📖 文章内容

${processedContent}

---

## 📊 元数据

- **标题**: ${result.title}
- **获取时间**: ${timestamp}
- **内容长度**: ${result.content.length} 字符
- **格式**: Markdown

---

**🔧 由 [wechat-get](https://www.npmjs.com/package/wechat-get) 工具生成**
**💡 获取公众号文章，突破验证限制，获取完整原文**`;

    return markdown;
  }
}

module.exports = WeChatScraper;