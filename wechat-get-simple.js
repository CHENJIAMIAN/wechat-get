#!/usr/bin/env node

/**
 * 微信文章获取工具 - 简化版支持Markdown输出
 */

const WeChatScraper = require('./src/index.js');
const fs = require('fs').promises;
const path = require('path');

class WeChatGetSimple {
  constructor() {
    this.scraper = new WeChatScraper();
  }

  showBanner() {
    console.log('🔥 微信文章获取工具 v1.0.0 (支持Markdown)');
    console.log('突破验证限制，获取公众号完整原文，支持多种格式输出\n');
  }

  async saveResult(result, url, filename, format) {
    const savedFiles = [];
    const timestamp = new Date().toISOString().split('T')[0];

    // JSON格式
    if (format === 'json' || format === 'both') {
      const jsonFile = `${filename}.json`;
      const jsonData = {
        ...result,
        url: url,
        metadata: {
          fetchedAt: new Date().toISOString(),
          tool: 'wechat-get',
          version: '1.0.0'
        }
      };
      await fs.writeFile(jsonFile, JSON.stringify(jsonData, null, 2), 'utf8');
      savedFiles.push(jsonFile);
    }

    // Markdown格式
    if (format === 'md' || format === 'both') {
      const mdFile = `${filename}.md`;
      const mdContent = this.scraper.generateMarkdown(result, url);
      await fs.writeFile(mdFile, mdContent, 'utf8');
      savedFiles.push(mdFile);
    }

    // TXT格式
    if (format === 'txt' || format === 'both') {
      const txtFile = `${filename}.txt`;
      const txtContent = [
        `标题: ${result.title}`,
        `获取时间: ${timestamp}`,
        `原文链接: ${url}`,
        '=' .repeat(50),
        result.content
      ].join('\n\n');
      await fs.writeFile(txtFile, txtContent, 'utf8');
      savedFiles.push(txtFile);
    }

    return savedFiles;
  }

  async handleUrl(url, options = {}) {
    console.log(`🎯 正在获取: ${url}`);

    try {
      const result = await this.scraper.getArticle(url);

      if (result.success) {
        console.log('\n✅ 获取成功！');
        console.log(`📖 标题: ${result.title}`);
        console.log(`📏 内容长度: ${result.content.length} 字符`);

        // 保存文件
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = options.output || `wechat_article_${timestamp}`;
        const format = options.format || 'md';

        const savedFiles = await this.saveResult(result, url, filename, format);

        console.log('\n💾 已保存:');
        savedFiles.forEach(file => {
          console.log(`   ${file}`);
        });

        return { success: true, result, files: savedFiles, url };
      } else {
        console.log('\n❌ 获取失败:');
        console.log(`   ${result.content}`);
        return { success: false, error: result.content, url };
      }
    } catch (error) {
      console.log(`\n💥 发生错误: ${error.message}`);
      return { success: false, error: error.message, url };
    }
  }

  async run() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      this.showBanner();
      console.log('\n📋 使用方法:');
      console.log('   node wechat-get-simple.js "微信文章URL" [选项]');
      console.log('');
      console.log('📝 选项:');
      console.log('   -o, --output <文件名>    输出文件名（不含扩展名）');
      console.log('   -f, --format <格式>      输出格式 (json|txt|md|both)，默认md');
      console.log('   -q, --quiet           静默模式');
      console.log('');
      console.log('🚀 示例:');
      console.log('   node wechat-get-simple.js "https://mp.weixin.qq.com/s/..."');
      console.log('   node wechat-get-simple.js "URL" -f md -o my-article');
      console.log('   node wechat-get-simple.js "URL" -f both');
      return;
    }

    // 解析参数
    let url = '';
    const options = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith('-o=')) {
        options.output = arg.slice(3);
      } else if (arg.startsWith('--output=')) {
        options.output = arg.slice(9);
      } else if (arg === '-o' || arg === '--output') {
        options.output = args[++i];
      } else if (arg.startsWith('-f=')) {
        options.format = arg.slice(3);
      } else if (arg.startsWith('--format=')) {
        options.format = arg.slice(9);
      } else if (arg === '-f' || arg === '--format') {
        options.format = args[++i];
      } else if (arg === '-q' || arg === '--quiet') {
        options.quiet = true;
      } else if (!arg.startsWith('-')) {
        url = arg;
      }
    }

    if (!url) {
      console.log('❌ 错误: 请提供微信文章URL');
      console.log('💡 使用: node wechat-get-simple.js "微信文章URL"');
      return;
    }

    if (!options.quiet) {
      this.showBanner();
    }
    await this.handleUrl(url, options);
  }
}

// 运行CLI
if (require.main === module) {
  const cli = new WeChatGetSimple();
  cli.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = WeChatGetSimple;