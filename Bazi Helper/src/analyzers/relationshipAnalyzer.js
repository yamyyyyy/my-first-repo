const { PEACH_BLOSSOM, DIZHI, LIUCHONG, SANHE, TIANGAN_WUXING, DIZHI_WUXING, DIZHI_TIANSHEN, TIANGAN } = require('../utils/constants');

const PEACH_BLOSSOM_DIRECTION = {
  '子': '北方',
  '午': '南方',
  '卯': '东方',
  '酉': '西方'
};

const PEACH_BLOSSOM_TYPE = {
  '子': '桃花水',
  '午': '桃花火',
  '卯': '桃花木',
  '酉': '桃花金'
};

const MARRIAGE_PILLAR = {
  '年柱': '早年感情',
  '月柱': '青年感情',
  '日柱': '婚姻宫',
  '时柱': '晚年感情'
};

function analyzePeachBlossom(bazi) {
  const peachBlossom = {
    stars: [],
    count: 0,
    types: [],
    directions: [],
    description: '',
    influence: ''
  };
  
  bazi.pillars.forEach(pillar => {
    if (PEACH_BLOSSOM.includes(pillar.branch)) {
      peachBlossom.stars.push({
        pillar: pillar.name,
        branch: pillar.branch,
        type: PEACH_BLOSSOM_TYPE[pillar.branch],
        direction: PEACH_BLOSSOM_DIRECTION[pillar.branch]
      });
      peachBlossom.count++;
      peachBlossom.types.push(PEACH_BLOSSOM_TYPE[pillar.branch]);
      peachBlossom.directions.push(PEACH_BLOSSOM_DIRECTION[pillar.branch]);
    }
  });
  
  if (peachBlossom.count === 0) {
    peachBlossom.description = '命局中没有桃花星，感情生活相对平淡';
    peachBlossom.influence = '感情方面需要主动争取，恋爱机会较少';
  } else if (peachBlossom.count === 1) {
    peachBlossom.description = '命局中有1个桃花星，桃花适中';
    peachBlossom.influence = '有一定的异性缘，感情比较稳定';
  } else if (peachBlossom.count === 2) {
    peachBlossom.description = '命局中有2个桃花星，桃花较旺';
    peachBlossom.influence = '异性缘很好，但需注意感情专一';
  } else {
    peachBlossom.description = `命局中有${peachBlossom.count}个桃花星，桃花旺盛`;
    peachBlossom.influence = '异性缘非常好，但感情容易不稳定，需谨慎处理';
  }
  
  return peachBlossom;
}

function analyzeSpouse(bazi, shishenAnalysis) {
  const gender = bazi.gender;
  const rizhu = bazi.rizhu;
  
  const spouseStar = gender === '男' ? '财星' : '官星';
  
  const rizhuWuxing = TIANGAN_WUXING[TIANGAN.indexOf(rizhu)];
  
  const spouseElements = gender === '男' 
    ? ['木', '火', '土', '金', '水'].filter(e => e !== rizhuWuxing && e !== TIANGAN_WUXING[(TIANGAN.indexOf(rizhu) + 2) % 10])
    : ['木', '火', '土', '金', '水'].filter(e => e !== rizhuWuxing && e !== TIANGAN_WUXING[(TIANGAN.indexOf(rizhu) + 7) % 10]);
  
  const spouseAnalysis = {
    spouseStar,
    spouseElements: [],
    spouseStarCount: 0,
    marriagePalace: '',
    marriagePalaceAnalysis: '',
    spouseTraits: [],
    meetingTime: [],
    suggestions: []
  };
  
  const shishenSummary = shishenAnalysis.summary;
  
  if (gender === '男') {
    spouseAnalysis.spouseStarCount = (shishenSummary['正财'] || 0) + (shishenSummary['偏财'] || 0);
    if (shishenSummary['正财']) spouseAnalysis.spouseElements.push('正财');
    if (shishenSummary['偏财']) spouseAnalysis.spouseElements.push('偏财');
  } else {
    spouseAnalysis.spouseStarCount = (shishenSummary['正官'] || 0) + (shishenSummary['七杀'] || 0);
    if (shishenSummary['正官']) spouseAnalysis.spouseElements.push('正官');
    if (shishenSummary['七杀']) spouseAnalysis.spouseElements.push('七杀');
  }
  
  const dayBranch = bazi.pillars[2].branch;
  spouseAnalysis.marriagePalace = dayBranch;
  
  const marriagePalaceAnalysis = analyzeMarriagePalace(bazi, dayBranch);
  spouseAnalysis.marriagePalaceAnalysis = marriagePalaceAnalysis;
  
  spouseAnalysis.spouseTraits = getSpouseTraits(bazi, gender);
  
  spouseAnalysis.meetingTime = calculateMeetingTime(bazi, gender);
  
  spouseAnalysis.suggestions = [
    '保持良好沟通，增进夫妻感情',
    '尊重对方，包容彼此差异',
    '共同培养兴趣爱好'
  ];
  
  if (spouseAnalysis.spouseStarCount === 0) {
    spouseAnalysis.suggestions.push('建议主动扩大社交圈，增加认识异性的机会');
  }
  
  if (spouseAnalysis.spouseStarCount > 2) {
    spouseAnalysis.suggestions.push('需注意感情专一，避免多角关系');
  }
  
  return spouseAnalysis;
}

function analyzeMarriagePalace(bazi, dayBranch) {
  let analysis = '';
  
  if (PEACH_BLOSSOM.includes(dayBranch)) {
    analysis += '婚姻宫为桃花，配偶长相较好，夫妻感情浪漫。';
  }
  
  bazi.pillars.forEach(pillar => {
    if (pillar.name !== '日柱' && pillar.branch === LIUCHONG[dayBranch]) {
      analysis += '婚姻宫被冲，婚姻容易有变动或夫妻聚少离多。';
    }
  });
  
  for (const [key, value] of Object.entries(SANHE)) {
    if (value.includes(dayBranch)) {
      const otherBranches = bazi.pillars.map(p => p.branch);
      const matched = value.filter(b => otherBranches.includes(b));
      if (matched.length >= 2) {
        analysis += '婚姻宫与其他地支三合，夫妻感情和睦。';
      }
    }
  }
  
  if (analysis === '') {
    analysis = '婚姻宫稳定，夫妻关系平和。';
  }
  
  return analysis;
}

function getSpouseTraits(bazi, gender) {
  const traits = [];
  const dayBranch = bazi.pillars[2].branch;
  
  const branchTraits = {
    '子': ['聪明', '温柔', '顾家', '有智慧'],
    '丑': ['稳重', '踏实', '勤俭', '有耐心'],
    '寅': ['开朗', '积极', '有活力', '社交能力强'],
    '卯': ['温柔', '善良', '体贴', '审美能力强'],
    '辰': ['稳重', '可靠', '有责任心', '善于理财'],
    '巳': ['热情', '开朗', '有才华', '事业心强'],
    '午': ['热情', '大方', '有魅力', '社交活跃'],
    '未': ['温柔', '善良', '体贴', '家庭观念强'],
    '申': ['聪明', '灵活', '有才华', '善于沟通'],
    '酉': ['精致', '优雅', '审美能力强', '注重形象'],
    '戌': ['稳重', '踏实', '有责任心', '忠诚'],
    '亥': ['聪明', '温柔', '有智慧', '善解人意']
  };
  
  if (branchTraits[dayBranch]) {
    traits.push(...branchTraits[dayBranch]);
  }
  
  const shishenMap = gender === '男' ? { '正财': '正财', '偏财': '偏财' } : { '正官': '正官', '七杀': '七杀' };
  const spouseStars = Object.keys(shishenMap);
  
  if (spouseStars.some(s => bazi.pillars[1].stem === s || bazi.pillars[3].stem === s)) {
    traits.push('配偶能力强');
  }
  
  return traits;
}

function calculateMeetingTime(bazi, gender) {
  const times = [];
  const currentYear = new Date().getFullYear();
  
  const peachYears = ['子', '午', '卯', '酉'];
  const spouseYears = gender === '男' ? ['木', '火'] : ['金', '水'];
  
  bazi.liunian.forEach(yearInfo => {
    if (yearInfo.year >= currentYear && yearInfo.year <= currentYear + 10) {
      let reasons = [];
      
      if (peachYears.includes(yearInfo.branch)) {
        reasons.push('桃花年');
      }
      
      if (gender === '男') {
        if (yearInfo.stem === '甲' || yearInfo.stem === '乙') reasons.push('财星年');
      } else {
        if (yearInfo.stem === '庚' || yearInfo.stem === '辛') reasons.push('官星年');
      }
      
      if (reasons.length > 0) {
        times.push({
          year: yearInfo.year,
          pillar: `${yearInfo.stem}${yearInfo.branch}`,
          reasons
        });
      }
    }
  });
  
  return times;
}

function analyzeMarriageFortune(bazi) {
  const fortune = {
    early: '',
    middle: '',
    late: '',
    suggestions: []
  };
  
  const dayBranch = bazi.pillars[2].branch;
  const monthBranch = bazi.pillars[1].branch;
  const yearBranch = bazi.pillars[0].branch;
  const hourBranch = bazi.pillars[3].branch;
  
  if (PEACH_BLOSSOM.includes(monthBranch)) {
    fortune.early = '年轻时感情丰富，恋爱机会多';
  } else {
    fortune.early = '年轻时感情较平淡，需主动追求';
  }
  
  if (dayBranch === monthBranch || dayBranch === yearBranch) {
    fortune.middle = '中年婚姻稳定，夫妻关系和睦';
  } else if (LIUCHONG[dayBranch] === monthBranch || LIUCHONG[dayBranch] === yearBranch) {
    fortune.middle = '中年婚姻需注意沟通，避免冲突';
  } else {
    fortune.middle = '中年婚姻平稳发展';
  }
  
  if (PEACH_BLOSSOM.includes(hourBranch)) {
    fortune.late = '晚年感情生活丰富，夫妻恩爱';
  } else {
    fortune.late = '晚年婚姻稳定，平淡幸福';
  }
  
  fortune.suggestions = [
    '保持良好沟通，增进夫妻感情',
    '尊重对方，包容彼此差异',
    '共同培养兴趣爱好',
    '注意婚姻宫被冲的年份'
  ];
  
  return fortune;
}

function getRelationshipReport(bazi, shishenAnalysis) {
  const peachBlossom = analyzePeachBlossom(bazi);
  const spouse = analyzeSpouse(bazi, shishenAnalysis);
  const marriageFortune = analyzeMarriageFortune(bazi);
  
  let report = `【感情与婚姻分析报告】\n\n`;
  
  report += `【桃花分析】\n`;
  report += `桃花数量：${peachBlossom.count}个\n`;
  if (peachBlossom.stars.length > 0) {
    report += `桃花位置：${peachBlossom.stars.map(s => s.pillar).join('、')}\n`;
    report += `桃花类型：${peachBlossom.types.join('、')}\n`;
    report += `有利方向：${peachBlossom.directions.join('、')}\n`;
  }
  report += `桃花描述：${peachBlossom.description}\n`;
  report += `影响分析：${peachBlossom.influence}\n\n`;
  
  report += `【配偶星分析】\n`;
  report += `配偶星：${spouse.spouseStar}\n`;
  report += `配偶星数量：${spouse.spouseStarCount}个\n`;
  if (spouse.spouseElements.length > 0) {
    report += `配偶星类型：${spouse.spouseElements.join('、')}\n`;
  }
  report += `婚姻宫：${spouse.marriagePalace}\n`;
  report += `婚姻宫分析：${spouse.marriagePalaceAnalysis}\n`;
  report += `配偶特征：${spouse.spouseTraits.join('、')}\n\n`;
  
  report += `【正缘时机】\n`;
  if (spouse.meetingTime.length > 0) {
    spouse.meetingTime.forEach(time => {
      report += `${time.year}年(${time.pillar})：${time.reasons.join('、')}\n`;
    });
  } else {
    report += '未来10年没有明显的正缘年份，建议主动社交\n';
  }
  report += '\n';
  
  report += `【婚姻运势】\n`;
  report += `早年感情：${marriageFortune.early}\n`;
  report += `中年婚姻：${marriageFortune.middle}\n`;
  report += `晚年感情：${marriageFortune.late}\n\n`;
  
  report += `【感情建议】\n`;
  spouse.suggestions.forEach((s, i) => {
    report += `${i + 1}. ${s}\n`;
  });
  
  return {
    peachBlossom,
    spouse,
    marriageFortune,
    report
  };
}

module.exports = {
  analyzePeachBlossom,
  analyzeSpouse,
  analyzeMarriageFortune,
  getRelationshipReport
};