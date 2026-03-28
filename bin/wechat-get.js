#!/usr/bin/env node

const WeChatScraper = require('../src/index.js');

function printUsage() {
  console.log('Usage: wechat-get <url>');
}

async function main() {
  const args = process.argv.slice(2);
  const url = args[0];

  if (!url || url.startsWith('-')) {
    printUsage();
    process.exit(1);
  }

  const scraper = new WeChatScraper();
  const result = await scraper.getArticle(url);

  if (!result.success) {
    console.error(result.content);
    process.exit(1);
  }

  const markdown = scraper.generateMarkdown(result, url);
  console.log(markdown);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
