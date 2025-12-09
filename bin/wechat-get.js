#!/usr/bin/env node

const WeChatScraper = require('../src/index.js');

// 运行CLI
if (require.main === module) {
  const cli = new WeChatScraper();
  cli.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}