#!/usr/bin/env node

const axios = require('axios');

async function testGetArticle() {
    const url = 'https://mp.weixin.qq.com/s/NnFIQ70s1F75bYzwueiDwA';

    console.log('🎯 测试获取微信文章...');
    console.log(`URL: ${url}`);

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

        if (!content) {
            content = '未获取到内容';
        }

        console.log('\n✅ 获取成功！');
        console.log(`📖 标题: ${title}`);
        console.log(`📏 内容长度: ${content.length} 字符`);

        // 显示内容预览
        const preview = content.substring(0, 300);
        console.log('\n📝 内容预览:');
        console.log('=' .repeat(50));
        console.log(preview);
        if (content.length > 300) {
            console.log('...(更多内容)');
        }
        console.log('=' .repeat(50));

        // 保存到文件
        const fs = require('fs');
        const result = {
            title: title,
            content: content,
            url: url,
            fetchedAt: new Date().toISOString(),
            success: true
        };

        fs.writeFileSync('test_result.json', JSON.stringify(result, null, 2), 'utf8');
        console.log('\n💾 已保存到: test_result.json');

        return result;

    } catch (error) {
        console.log(`❌ 获取失败: ${error.message}`);
        return {
            success: false,
            error: error.message,
            title: '获取失败',
            content: ''
        };
    }
}

testGetArticle();