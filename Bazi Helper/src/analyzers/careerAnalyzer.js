const { TIANGAN_WUXING, DIZHI_WUXING, TIANGAN, DIZHI, WUXING_RELATIONS } = require('../utils/constants');

const WUXING_CAREERS = {
  '金': {
    careers: ['金融', '投资', '法律', '管理', '金属加工', '机械工程', '医疗', '技术研发'],
    traits: ['善于分析', '追求完美', '逻辑清晰', '决策果断'],
    description: '金旺的人适合从事需要逻辑分析和决策能力的工作'
  },
  '木': {
    careers: ['教育', '文化', '艺术', '咨询', '农林', '环境保护', '出版', '传媒'],
    traits: ['富有创意', '善于沟通', '积极向上', '有同情心'],
    description: '木旺的人适合从事文化教育和创意类工作'
  },
  '水': {
    careers: ['商业', '贸易', '物流', '营销', '公关', '旅游', 'IT', '策划'],
    traits: ['聪明灵活', '适应力强', '善于变通', '富有谋略'],
    description: '水旺的人适合从事商业和灵活多变的工作'
  },
  '火': {
    careers: ['演艺', '销售', '培训', '餐饮', '能源', '电子', '传媒', '广告'],
    traits: ['热情积极', '富有感染力', '善于表达', '行动力强'],
    description: '火旺的人适合从事需要热情和表现力的工作'
  },
  '土': {
    careers: ['建筑', '房地产', '金融', '会计', '行政', '物流', '制造业', '农业'],
    traits: ['稳重踏实', '诚实守信', '有责任心', '善于管理'],
    description: '土旺的人适合从事稳定和管理类工作'
  }
};

const SHISHEN_CAREERS = {
  '比肩': ['创业', '独立工作', '团队管理', '合作伙伴'],
  '劫财': ['销售', '业务拓展', '公关', '市场推广'],
  '食神': ['艺术', '设计', '教育', '咨询', '美食'],
  '伤官': ['创意', '策划', '艺术', '技术研发', '自媒体'],
  '偏财': ['投资', '金融', '商业', '创业', '副业'],
  '正财': ['稳定工作', '财务管理', '会计', '行政'],
  '七杀': ['管理', '领导', '军警', '创业', '高压力工作'],
  '正官': ['公务员', '管理', '法律', '专业技术'],
  '偏印': ['学术研究', '宗教', '心理', '艺术', '创意'],
  '正印': ['教育', '学术', '医疗', '公益', '文化']
};

const TALENT_INDICATORS = {
  '食神': ['创造力', '艺术天赋', '表达能力', '审美能力'],
  '伤官': ['创新能力', '思维敏捷', '口才', '个性魅力'],
  '正印': ['学习能力', '记忆力', '学识', '修养'],
  '偏印': ['领悟力', '直觉', '独特思维', '洞察力'],
  '七杀': ['领导力', '决断力', '执行力', '抗压能力'],
  '正官': ['责任感', '组织能力', '专业能力', '稳健性'],
  '正财': ['理财能力', '务实精神', '执行力', '耐心'],
  '偏财': ['商业头脑', '交际能力', '应变能力', '冒险精神'],
  '比肩': ['独立能力', '合作能力', '自信心', '毅力'],
  '劫财': ['社交能力', '行动力', '勇气', '热情']
};

function analyzeTalents(bazi, shishenAnalysis) {
  const talents = {
    primary: [],
    secondary: [],
    hidden: [],
    description: ''
  };
  
  const shishenSummary = shishenAnalysis.summary;
  const dominantShishen = Object.keys(shishenSummary).sort((a, b) => shishenSummary[b] - shishenSummary[a]);
  
  dominantShishen.forEach(shishen => {
    if (shishenSummary[shishen] > 0 && TALENT_INDICATORS[shishen]) {
      if (shishenSummary[shishen] >= 2) {
        talents.primary.push(...TALENT_INDICATORS[shishen]);
      } else {
        talents.secondary.push(...TALENT_INDICATORS[shishen]);
      }
    }
  });
  
  talents.primary = [...new Set(talents.primary)].slice(0, 6);
  talents.secondary = [...new Set(talents.secondary)].slice(0, 4);
  
  const rizhu = bazi.rizhu;
  const rizhuWuxing = TIANGAN_WUXING[TIANGAN.indexOf(rizhu)];
  
  if (talents.primary.length > 0) {
    talents.description = `${rizhu}日主，${rizhuWuxing}属性，主要天赋包括${talents.primary.join('、')}`;
  } else {
    talents.description = `${rizhu}日主，${rizhuWuxing}属性，天赋较均衡`;
  }
  
  return talents;
}

function analyzeCareer(bazi, shishenAnalysis, wuxingAnalysis) {
  const career = {
    recommended: [],
    suitable: [],
    unsuitable: [],
    workStyle: '',
    successFactors: []
  };
  
  const shishenSummary = shishenAnalysis.summary;
  const sortedElements = wuxingAnalysis.sorted;
  
  const dominantElements = sortedElements.slice(0, 2);
  const weakElements = sortedElements.slice(-2);
  
  dominantElements.forEach(element => {
    if (WUXING_CAREERS[element]) {
      career.recommended.push(...WUXING_CAREERS[element].careers);
    }
  });
  
  career.recommended = [...new Set(career.recommended)].slice(0, 8);
  
  sortedElements.slice(2, 4).forEach(element => {
    if (WUXING_CAREERS[element]) {
      career.suitable.push(...WUXING_CAREERS[element].careers);
    }
  });
  career.suitable = [...new Set(career.suitable)].slice(0, 5);
  
  weakElements.forEach(element => {
    if (WUXING_CAREERS[element]) {
      career.unsuitable.push(...WUXING_CAREERS[element].careers);
    }
  });
  career.unsuitable = [...new Set(career.unsuitable)].slice(0, 3);
  
  const dominantShishen = Object.keys(shishenSummary).sort((a, b) => shishenSummary[b] - shishenSummary[a])[0];
  
  const workStyles = {
    '比肩': '独立自主，喜欢自己做主',
    '劫财': '热情主动，善于开拓',
    '食神': '温和细致，注重品质',
    '伤官': '创新突破，不拘一格',
    '偏财': '灵活多变，善于把握机会',
    '正财': '踏实稳重，注重实际',
    '七杀': '果断坚决，追求效率',
    '正官': '严谨规范，注重制度',
    '偏印': '深思熟虑，善于思考',
    '正印': '温和耐心，乐于助人'
  };
  
  career.workStyle = workStyles[dominantShishen] || '综合型';
  
  const successFactors = [];
  if (shishenSummary['食神'] || shishenSummary['伤官']) successFactors.push('发挥创造力');
  if (shishenSummary['正财'] || shishenSummary['偏财']) successFactors.push('把握财务机会');
  if (shishenSummary['正官'] || shishenSummary['七杀']) successFactors.push('培养领导力');
  if (shishenSummary['正印'] || shishenSummary['偏印']) successFactors.push('提升专业能力');
  
  career.successFactors = successFactors;
  
  return career;
}

function analyzeWealth(bazi, shishenAnalysis, wuxingAnalysis) {
  const wealth = {
    type: '',
    potential: '',
    timing: [],
    suggestions: []
  };
  
  const shishenSummary = shishenAnalysis.summary;
  const rizhuWuxing = wuxingAnalysis.rizhuWuxing;
  
  let hasWealth = false;
  
  if (shishenSummary['正财'] > 0) {
    wealth.type += '正财';
    hasWealth = true;
  }
  if (shishenSummary['偏财'] > 0) {
    if (wealth.type) wealth.type += '、';
    wealth.type += '偏财';
    hasWealth = true;
  }
  
  if (!hasWealth) {
    wealth.type = '无明显财星';
    wealth.potential = '财运平平，需通过努力积累';
  } else {
    const wealthCount = (shishenSummary['正财'] || 0) + (shishenSummary['偏财'] || 0);
    
    if (wealthCount >= 3) {
      wealth.potential = '财运旺盛，有较大的财富潜力';
    } else if (wealthCount >= 2) {
      wealth.potential = '财运较好，有一定的财富积累';
    } else {
      wealth.potential = '财运一般，需把握机会';
    }
  }
  
  const currentYear = new Date().getFullYear();
  bazi.liunian.forEach(yearInfo => {
    if (yearInfo.year >= currentYear && yearInfo.year <= currentYear + 10) {
      if (yearInfo.stem === '甲' || yearInfo.stem === '乙' || 
          yearInfo.stem === '戊' || yearInfo.stem === '己') {
        wealth.timing.push({
          year: yearInfo.year,
          pillar: `${yearInfo.stem}${yearInfo.branch}`,
          reason: '财星年'
        });
      }
    }
  });
  
  wealth.suggestions = [
    '合理规划财务，避免盲目投资',
    '根据五行喜忌选择适合的行业',
    '把握财星年份的机会',
    '注意比劫林立的年份，防破财'
  ];
  
  return wealth;
}

function getCareerReport(bazi, shishenAnalysis, wuxingAnalysis) {
  const talents = analyzeTalents(bazi, shishenAnalysis);
  const career = analyzeCareer(bazi, shishenAnalysis, wuxingAnalysis);
  const wealth = analyzeWealth(bazi, shishenAnalysis, wuxingAnalysis);
  
  let report = `【天赋与职业分析报告】\n\n`;
  
  report += `【天赋分析】\n`;
  report += `天赋描述：${talents.description}\n`;
  if (talents.primary.length > 0) {
    report += `主要天赋：${talents.primary.join('、')}\n`;
  }
  if (talents.secondary.length > 0) {
    report += `次要天赋：${talents.secondary.join('、')}\n`;
  }
  report += '\n';
  
  report += `【职业推荐】\n`;
  report += `最适合的行业：${career.recommended.join('、')}\n`;
  if (career.suitable.length > 0) {
    report += `较适合的行业：${career.suitable.join('、')}\n`;
  }
  if (career.unsuitable.length > 0) {
    report += `不太适合的行业：${career.unsuitable.join('、')}\n`;
  }
  report += `工作风格：${career.workStyle}\n`;
  if (career.successFactors.length > 0) {
    report += `成功要素：${career.successFactors.join('、')}\n`;
  }
  report += '\n';
  
  report += `【财运分析】\n`;
  report += `财星类型：${wealth.type}\n`;
  report += `财富潜力：${wealth.potential}\n`;
  if (wealth.timing.length > 0) {
    report += `财运时机：\n`;
    wealth.timing.forEach(time => {
      report += `  ${time.year}年(${time.pillar})：${time.reason}\n`;
    });
  }
  report += '\n';
  
  report += `【职业建议】\n`;
  wealth.suggestions.forEach((s, i) => {
    report += `${i + 1}. ${s}\n`;
  });
  
  return {
    talents,
    career,
    wealth,
    report
  };
}

module.exports = {
  analyzeTalents,
  analyzeCareer,
  analyzeWealth,
  getCareerReport
};