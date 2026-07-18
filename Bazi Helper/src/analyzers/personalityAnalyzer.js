const { TIANGAN_WUXING, DIZHI_WUXING, TIANGAN, DIZHI } = require('../utils/constants');

const SHISHEN_PERSONALITY = {
  '比肩': {
    positive: ['独立自主', '自信心强', '意志坚定', '善于合作'],
    negative: ['固执己见', '争强好胜', '自我中心', '缺乏变通'],
    description: '比肩旺的人性格独立，有主见，善于与人合作，但也容易固执己见'
  },
  '劫财': {
    positive: ['热情豪爽', '乐于助人', '行动力强', '社交活跃'],
    negative: ['冲动鲁莽', '挥霍无度', '人际关系复杂', '易受朋友拖累'],
    description: '劫财旺的人性格豪爽，喜欢帮助别人，但也容易冲动行事'
  },
  '食神': {
    positive: ['聪明智慧', '才华横溢', '性格温和', '乐观豁达'],
    negative: ['不思进取', '贪图享乐', '缺乏毅力', '任性放纵'],
    description: '食神旺的人聪明多才，性格温和，但也容易贪图享乐'
  },
  '伤官': {
    positive: ['思维敏捷', '创新能力强', '口才出众', '艺术天赋'],
    negative: ['桀骜不驯', '叛逆心强', '说话伤人', '难以管教'],
    description: '伤官旺的人思维敏捷，才华出众，但也容易叛逆不服管教'
  },
  '偏财': {
    positive: ['理财能力强', '商业头脑', '交际能力', '乐观开朗'],
    negative: ['投机心态', '贪图享乐', '缺乏节制', '感情不专'],
    description: '偏财旺的人善于理财，有商业头脑，但也容易投机取巧'
  },
  '正财': {
    positive: ['务实稳重', '勤劳节俭', '责任感强', '诚实守信'],
    negative: ['过于保守', '吝啬小气', '缺乏浪漫', '压力过大'],
    description: '正财旺的人务实稳重，注重实际，但也容易过于保守'
  },
  '七杀': {
    positive: ['刚毅果断', '事业心强', '领导力', '决断力'],
    negative: ['脾气暴躁', '缺乏耐心', '过于强势', '容易树敌'],
    description: '七杀旺的人性格刚毅，有决断力，但也容易脾气暴躁'
  },
  '正官': {
    positive: ['正直善良', '责任感强', '遵纪守法', '稳重可靠'],
    negative: ['过于拘谨', '缺乏魄力', '优柔寡断', '压力过大'],
    description: '正官旺的人正直善良，有责任感，但也容易过于拘谨'
  },
  '偏印': {
    positive: ['悟性高超', '思维独特', '洞察力强', '直觉灵敏'],
    negative: ['性格孤僻', '疑心重', '难以捉摸', '缺乏安全感'],
    description: '偏印旺的人悟性高，思维独特，但也容易性格孤僻'
  },
  '正印': {
    positive: ['仁慈善良', '学识渊博', '修养好', '气质高雅'],
    negative: ['依赖性强', '缺乏主见', '过于理想化', '容易受骗'],
    description: '正印旺的人仁慈善良，学识渊博，但也容易过于依赖他人'
  }
};

const WUXING_PERSONALITY = {
  '金': {
    traits: ['刚毅果断', '处事严谨', '条理清晰', '追求完美'],
    weakTraits: ['固执倔强', '缺乏变通', '过于理性', '冷漠'],
    description: '金旺的人性格刚毅，处事严谨，但也容易过于固执'
  },
  '木': {
    traits: ['善良正直', '积极向上', '乐观开朗', '富有同情心'],
    weakTraits: ['犹豫不决', '缺乏决断', '过于心软', '易受影响'],
    description: '木旺的人性格善良，积极向上，但也容易犹豫不决'
  },
  '水': {
    traits: ['聪明智慧', '思维敏捷', '适应力强', '富有谋略'],
    weakTraits: ['缺乏恒心', '善变多疑', '过于圆滑', '缺乏原则'],
    description: '水旺的人聪明灵活，适应力强，但也容易缺乏恒心'
  },
  '火': {
    traits: ['热情奔放', '充满活力', '积极进取', '富有感染力'],
    weakTraits: ['急躁冲动', '缺乏耐心', '过于张扬', '情绪波动'],
    description: '火旺的人热情奔放，充满活力，但也容易急躁冲动'
  },
  '土': {
    traits: ['稳重踏实', '诚实守信', '包容宽厚', '有责任心'],
    weakTraits: ['过于保守', '缺乏变通', '反应迟钝', '固执己见'],
    description: '土旺的人稳重踏实，诚实守信，但也容易过于保守'
  }
};

const TIANGAN_PERSONALITY = {
  '甲': { traits: ['正直勇敢', '积极进取', '有领导力', '性格开朗'], desc: '甲木日主，如参天大树，正直勇敢' },
  '乙': { traits: ['温柔善良', '灵活变通', '善于沟通', '富有韧性'], desc: '乙木日主，如藤蔓植物，温柔坚韧' },
  '丙': { traits: ['热情洋溢', '光明磊落', '积极向上', '富有感染力'], desc: '丙火日主，如太阳之火，热情光明' },
  '丁': { traits: ['聪明智慧', '细腻温柔', '富有艺术气质', '善于思考'], desc: '丁火日主，如灯烛之火，温柔明亮' },
  '戊': { traits: ['稳重踏实', '诚实守信', '有包容心', '责任感强'], desc: '戊土日主，如大地之土，稳重厚实' },
  '己': { traits: ['细腻温和', '善于协调', '有耐心', '重视细节'], desc: '己土日主，如田园之土，细腻温和' },
  '庚': { traits: ['刚毅果断', '处事公正', '有原则', '追求完美'], desc: '庚金日主，如刀剑之金，刚毅锐利' },
  '辛': { traits: ['聪明伶俐', '追求精致', '善于分析', '审美能力强'], desc: '辛金日主，如珠宝之金，精致美丽' },
  '壬': { traits: ['聪明智慧', '胸怀宽广', '适应力强', '富有谋略'], desc: '壬水日主，如江河之水，宽广深远' },
  '癸': { traits: ['温柔善良', '心思细腻', '直觉灵敏', '善于忍耐'], desc: '癸水日主，如雨露之水，温柔滋润' }
};

function analyzePersonality(bazi, shishenAnalysis, wuxingAnalysis) {
  const personality = {
    overall: '',
    shishenTraits: [],
    wuxingTraits: [],
    rizhuTraits: [],
    strengths: [],
    weaknesses: []
  };
  
  const shishenSummary = shishenAnalysis.summary;
  const dominantShishen = Object.keys(shishenSummary).sort((a, b) => shishenSummary[b] - shishenSummary[a]);
  
  dominantShishen.forEach(shishen => {
    if (shishenSummary[shishen] > 0 && SHISHEN_PERSONALITY[shishen]) {
      const p = SHISHEN_PERSONALITY[shishen];
      personality.shishenTraits.push({
        shishen,
        count: shishenSummary[shishen],
        ...p
      });
      personality.strengths.push(...p.positive);
      personality.weaknesses.push(...p.negative);
    }
  });
  
  const sortedElements = wuxingAnalysis.sorted;
  sortedElements.forEach(element => {
    if (wuxingAnalysis.scores[element] > 0 && WUXING_PERSONALITY[element]) {
      const p = WUXING_PERSONALITY[element];
      personality.wuxingTraits.push({
        element,
        score: wuxingAnalysis.scores[element].toFixed(1),
        ratio: wuxingAnalysis.elementAnalysis[element].ratio,
        ...p
      });
    }
  });
  
  const rizhu = bazi.rizhu;
  if (TIANGAN_PERSONALITY[rizhu]) {
    personality.rizhuTraits = TIANGAN_PERSONALITY[rizhu].traits;
  }
  
  personality.strengths = [...new Set(personality.strengths)].slice(0, 8);
  personality.weaknesses = [...new Set(personality.weaknesses)].slice(0, 8);
  
  if (personality.shishenTraits.length > 0) {
    const mainShishen = personality.shishenTraits[0];
    personality.overall = `${rizhu}日主，${mainShishen.description}`;
    
    if (personality.shishenTraits.length > 1) {
      const secondary = personality.shishenTraits.slice(1, 3).map(s => s.shishen).join('、');
      personality.overall += `，兼带${secondary}特性`;
    }
  }
  
  return personality;
}

function getPersonalityReport(bazi, shishenAnalysis, wuxingAnalysis) {
  const personality = analyzePersonality(bazi, shishenAnalysis, wuxingAnalysis);
  
  let report = `【性格分析报告】\n\n`;
  report += `日主：${bazi.rizhu}\n`;
  report += `整体性格：${personality.overall}\n\n`;
  
  report += `【十神性格特征】\n`;
  personality.shishenTraits.forEach(trait => {
    report += `${trait.shishen}(${trait.count}个)：${trait.description}\n`;
    report += `  优点：${trait.positive.join('、')}\n`;
    report += `  缺点：${trait.negative.join('、')}\n\n`;
  });
  
  report += `【五行性格特征】\n`;
  personality.wuxingTraits.forEach(trait => {
    report += `${trait.element}(${trait.score}分，占比${trait.ratio}%)：${trait.description}\n`;
    report += `  正面特质：${trait.traits.join('、')}\n`;
    report += `  负面特质：${trait.weakTraits.join('、')}\n\n`;
  });
  
  report += `【性格优点】\n`;
  report += `  ${personality.strengths.join('、')}\n\n`;
  
  report += `【性格缺点】\n`;
  report += `  ${personality.weaknesses.join('、')}\n\n`;
  
  report += `【性格建议】\n`;
  report += `  根据命局分析，建议您：\n`;
  report += `  1. 发挥${personality.strengths.slice(0, 3).join('、')}等优点\n`;
  report += `  2. 注意调整${personality.weaknesses.slice(0, 3).join('、')}等不足\n`;
  report += `  3. 通过${wuxingAnalysis.sorted[wuxingAnalysis.sorted.length - 1]}属性的活动来平衡性格\n`;
  
  return {
    personality,
    report
  };
}

module.exports = {
  analyzePersonality,
  getPersonalityReport
};