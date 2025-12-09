#!/usr/bin/env node

const WeChatGetSimple = require('../wechat-get-simple.js');

// 运行CLI（简化版命令）
if (require.main === module) {
  const cli = new WeChatGetSimple();
  cli.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}