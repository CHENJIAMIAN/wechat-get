const axios = require('axios');
let cheerio;
try {
  cheerio = require('cheerio');
} catch (e) {
  cheerio = null;
}

const WeChatFormatter = require('./formatter.js');

class WeChatScraper {
  constructor(options = {}) {
    this.options = {
      timeout: options.timeout || 30000,
      retryCount: options.retryCount || 3,
      delay: options.delay || 2000,
      ...options
    };

    this.client = axios.create({
      timeout: this.options.timeout,
      headers: this.getHeaders(),
      maxRedirects: 5
    });
  }

  getHeaders() {
    return {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42(0x18002a2c) NetType/WIFI Language/zh_CN',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      Referer: 'https://mp.weixin.qq.com/'
    };
  }

  sleep(ms = null) {
    const waitMs = ms || this.options.delay + Math.floor(Math.random() * 1200);
    return new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  async simulateBrowser() {
    try {
      await this.client.get('https://mp.weixin.qq.com');
      await this.sleep(800);
    } catch (_) {
      // Ignore warm-up failures.
    }
  }

  isVerificationPage(html) {
    const lowerHtml = String(html || '').toLowerCase();
    const markers = [
      'verification',
      'antispam',
      'secitptpage/verify',
      "page_mid='mmbizwap:secitptpage/verify.html'",
      "seajs.use('secitptpage/template/verify.js')"
    ];
    return markers.some((m) => lowerHtml.includes(m));
  }

  extractContent(html) {
    if (!html || typeof html !== 'string') {
      return { title: 'Parse error', content: 'Empty html response', success: false };
    }

    if (cheerio) {
      try {
        const $ = cheerio.load(html);

        let title = $('meta[property="og:title"]').attr('content') || '';
        if (!title) title = $('h1.rich_media_title').first().text().trim();
        if (!title) title = $('title').first().text().trim();

        let content = $('#js_content').first().text().trim();
        if (!content) content = $('.rich_media_content').first().text().trim();

        return {
          title: title || 'Untitled',
          content: content || 'No content extracted',
          success: Boolean(title && content)
        };
      } catch (error) {
        return { title: 'Parse error', content: error.message, success: false };
      }
    }

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    return {
      title: title || 'Untitled',
      content: 'Cheerio is not available',
      success: false
    };
  }

  async getArticle(url) {
    console.log(`Fetching: ${url}`);

    try {
      await this.simulateBrowser();

      let html = (await this.client.get(url)).data;
      if (this.isVerificationPage(html)) {
        for (let i = 0; i < this.options.retryCount; i += 1) {
          await this.sleep(1500);
          html = (await this.client.get(url)).data;
          if (!this.isVerificationPage(html)) break;
        }
      }

      if (this.isVerificationPage(html)) {
        return {
          title: 'Verification page',
          content: 'Blocked by WeChat verification page',
          success: false
        };
      }

      return this.extractContent(html);
    } catch (error) {
      return {
        title: 'Fetch failed',
        content: `Error: ${error.message}`,
        success: false
      };
    }
  }

  async getMultipleArticles(urls, options = {}) {
    const delayMs = options.delay || 3000;
    const results = [];

    for (let i = 0; i < urls.length; i += 1) {
      const url = urls[i];
      const result = await this.getArticle(url);
      results.push({ url, result });
      if (i < urls.length - 1) await this.sleep(delayMs);
    }

    return results;
  }

  generateMarkdown(result, url) {
    const cleanContent = String(result.content || '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    const processedContent = WeChatFormatter.format(cleanContent);
    const timestamp = new Date().toISOString().split('T')[0];

    return `# ${result.title}

> Fetch time: ${timestamp}
> Source: ${url || ''}

---

## Content

${processedContent}
`;
  }
}

module.exports = WeChatScraper;
