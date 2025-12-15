/**
 * 微信文章格式化器 - 改进版
 */

class WeChatFormatter {
  /**
   * 主格式化方法
   */
  static format(content) {
    // 第一步：基本清理
    let formatted = this.basicClean(content);

    // 第二步：智能分段
    const paragraphs = this.smartParagraphSplit(formatted);

    // 第三步：格式化每个段落
    const formattedParagraphs = paragraphs.map(para => {
      return this.formatParagraph(para);
    });

    // 第四步：最终处理
    return formattedParagraphs
      .filter(p => p && p.trim().length > 0)
      .join('\n\n');
  }

  /**
   * 基本清理
   */
  static basicClean(content) {
    return content
      .replace(/\s+/g, ' ')  // 合并多个空白字符
      .replace(/\n{3,}/g, '\n\n')  // 限制换行符数量
      .trim();
  }

  /**
   * 智能分段 - 改进版
   */
  static smartParagraphSplit(text) {
    // 预处理：添加一些换行标记
    let preprocessed = text
      // 在明显的段落结束处添加标记
      .replace(/([。！？.!?])([^【\n])/g, '$1\n\n$2')
      // 在章节标题前添加标记
      .replace(/([^\n])(第[一二三四五六七八九十\d]+[章节部分]|【[^】]+】)/g, '$1\n\n$2')
      // 在列表项前添加标记
      .replace(/([^\n])([\d]+[、\.]|[·•\-*]\s)/g, '$1\n\n$2');

    // 分割段落
    let rawParagraphs = preprocessed.split(/\n{2,}/);

    // 过滤和清理
    let paragraphs = rawParagraphs.map(p => p.trim()).filter(p => p.length > 0);

    // 合并过短的段落
    let mergedParagraphs = [];
    let currentPara = '';

    for (let para of paragraphs) {
      // 如果当前段落为空，直接添加
      if (!currentPara) {
        currentPara = para;
        continue;
      }

      // 如果上一段很短，新段落也不长，合并它们
      if (currentPara.length < 30 && para.length < 100) {
        currentPara += para;
      }
      // 如果遇到标题或列表，开始新段落
      else if (this.isTitle(para) || this.isListItem(para)) {
        if (currentPara) mergedParagraphs.push(currentPara);
        currentPara = para;
      }
      // 否则开始新段落
      else {
        if (currentPara) mergedParagraphs.push(currentPara);
        currentPara = para;
      }
    }

    if (currentPara) {
      mergedParagraphs.push(currentPara);
    }

    return mergedParagraphs;
  }

  /**
   * 格式化单个段落
   */
  static formatParagraph(paragraph) {
    if (!paragraph || paragraph.trim().length === 0) {
      return '';
    }

    // 检测是否是标题
    if (this.isTitle(paragraph)) {
      return `### ${paragraph.trim()}`;
    }

    // 检测是否是引用
    if (this.isQuote(paragraph)) {
      return `> ${paragraph.trim()}`;
    }

    // 检测是否是列表项
    if (this.isListItem(paragraph)) {
      return `- ${paragraph.trim()}`;
    }

    // 检测是否是代码或数据
    if (this.isCodeOrData(paragraph)) {
      return `\`\`\`\n${paragraph.trim()}\n\`\`\``;
    }

    // 普通段落，添加适当的换行
    return this.addLineBreaks(paragraph);
  }

  /**
   * 判断是否是标题
   */
  static isTitle(text) {
    return /^第[一二三四五六七八九十\d]+[章节部分]|[一二三四五六七八九十\d]+[、\.]\s/.test(text) ||
           /^【[^】]+】/.test(text) ||
           /^\d+\./.test(text) ||
           (text.length < 30 && /[：:：]$/.test(text));
  }

  /**
   * 判断是否是引用
   */
  static isQuote(text) {
    return /[""''「」『』《》]/.test(text) && text.length < 100;
  }

  /**
   * 判断是否是列表项
   */
  static isListItem(text) {
    return /^[·•\-*]\s/.test(text) ||
           /^\d+[、\.]\s/.test(text) ||
           /^[a-zA-Z]\)[\.\s]/.test(text);
  }

  /**
   * 判断是否是代码或数据
   */
  static isCodeOrData(text) {
    return /[{}[\];,]/.test(text) &&
           /[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(text) ||
           /\d{4}-\d{2}-\d{2}/.test(text) ||
           /https?:\/\//.test(text);
  }

  /**
   * 添加换行到长段落
   */
  static addLineBreaks(text) {
    // 对于特别长的段落，在逗号、分号等位置适当换行
    if (text.length > 200) {
      return text.replace(/([，,；;]\s)/g, '$1\n');
    }
    return text;
  }
}

module.exports = WeChatFormatter;