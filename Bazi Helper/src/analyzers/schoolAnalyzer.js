const { NA_YIN, TIANGAN_WUXING, DIZHI_WUXING, DIZHI_TIANSHEN, TIANGAN, DIZHI, WUXING_RELATIONS, LIUCHONG, SANHE, BAJI } = require('../utils/constants');

function analyzeZiping(bazi, shishenAnalysis, wuxingAnalysis) {
  const ziping = {
    school: '子平学派',
    focus: '日主强弱、格局判定、用神选取',
    analysis: '',
    conclusion: ''
  };
  
  const rizhu = bazi.rizhu;
  const rizhuWuxing = wuxingAnalysis.rizhuWuxing;
  const status = wuxingAnalysis.elementAnalysis[rizhuWuxing].status;
  
  let analysis = `${rizhu}日主，${rizhuWuxing}属性，${status}。`;
  
  const shishenSummary = shishenAnalysis.summary;
  
  const guijuOrder = ['正官', '七杀', '正财', '偏财', '食神', '伤官', '正印', '偏印', '比肩', '劫财'];
  let dominantGuiju = null;
  
  for (const shishen of guijuOrder) {
    if (shishenSummary[shishen] > 0) {
      dominantGuiju = shishen;
      break;
    }
  }
  
  if (dominantGuiju) {
    analysis += `月柱透出${dominantGuiju}，定为${getGuijuName(dominantGuiju)}。`;
  } else {
    analysis += '月柱无明显十神透出，需综合判断。';
  }
  
  if (shishenSummary['正官'] && shishenSummary['正印']) {
    analysis += '官印相生，格局纯正。';
  }
  if (shishenSummary['食神'] && shishenSummary['正财']) {
    analysis += '食神生财，富贵可期。';
  }
  if (shishenSummary['伤官'] && shishenSummary['七杀']) {
    analysis += '伤官制杀，权柄在握。';
  }
  
  ziping.analysis = analysis;
  
  if (status === '中和') {
    ziping.conclusion = '日主中和，格局清纯，为上等之命。';
  } else if (status === '偏旺' || status === '偏弱') {
    ziping.conclusion = '日主略有偏旺/偏弱，但格局清晰，为中等偏上之命。';
  } else {
    ziping.conclusion = '日主过旺或过弱，需大运流年补救。';
  }
  
  return ziping;
}

function getGuijuName(shishen) {
  const names = {
    '正官': '正官格',
    '七杀': '七杀格',
    '正财': '正财格',
    '偏财': '偏财格',
    '食神': '食神格',
    '伤官': '伤官格',
    '正印': '正印格',
    '偏印': '偏印格',
    '比肩': '比肩格',
    '劫财': '劫财格'
  };
  return names[shishen] || shishen;
}

function analyzeLuming(bazi) {
  const luming = {
    school: '禄命古法',
    focus: '禄、命、身三奇，纳音五行',
    analysis: '',
    nasinAnalysis: [],
    conclusion: ''
  };
  
  let analysis = '禄命古法分析：';
  
  const pillars = bazi.pillars;
  const nasinAnalysis = [];
  
  pillars.forEach(pillar => {
    const nasin = NA_YIN[pillar.stem + pillar.branch];
    nasinAnalysis.push({
      pillar: pillar.name,
      ganzhi: pillar.stem + pillar.branch,
      nasin
    });
  });
  
  luming.nasinAnalysis = nasinAnalysis;
  
  analysis += `年柱${nasinAnalysis[0].ganzhi}(${nasinAnalysis[0].nasin})，`;
  analysis += `月柱${nasinAnalysis[1].ganzhi}(${nasinAnalysis[1].nasin})，`;
  analysis += `日柱${nasinAnalysis[2].ganzhi}(${nasinAnalysis[2].nasin})，`;
  analysis += `时柱${nasinAnalysis[3].ganzhi}(${nasinAnalysis[3].nasin})。`;
  
  const nasinElements = nasinAnalysis.map(n => getNasinElement(n.nasin));
  const nasinElementCounts = {};
  nasinElements.forEach(e => {
    nasinElementCounts[e] = (nasinElementCounts[e] || 0) + 1;
  });
  
  const dominantNasin = Object.keys(nasinElementCounts).sort((a, b) => nasinElementCounts[b] - nasinElementCounts[a])[0];
  analysis += `纳音以${dominantNasin}为主。`;
  
  const luPositions = checkLuPositions(bazi);
  if (luPositions.length > 0) {
    analysis += `${luPositions.join('、')}有禄。`;
  }
  
  luming.analysis = analysis;
  
  if (nasinElementCounts[dominantNasin] >= 3) {
    luming.conclusion = '纳音一气，气势宏大，福禄深厚。';
  } else if (luPositions.length >= 2) {
    luming.conclusion = '双禄临门，衣食无忧。';
  } else {
    luming.conclusion = '纳音平和，需结合其他因素综合判断。';
  }
  
  return luming;
}

function getNasinElement(nasin) {
  if (nasin.includes('金')) return '金';
  if (nasin.includes('木')) return '木';
  if (nasin.includes('水')) return '水';
  if (nasin.includes('火')) return '火';
  if (nasin.includes('土')) return '土';
  return '土';
}

function checkLuPositions(bazi) {
  const luMap = {
    '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
    '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
    '壬': '亥', '癸': '子'
  };
  
  const luPositions = [];
  const rizhu = bazi.rizhu;
  
  if (luMap[rizhu]) {
    bazi.pillars.forEach(pillar => {
      if (pillar.branch === luMap[rizhu]) {
        luPositions.push(pillar.name);
      }
    });
  }
  
  return luPositions;
}

function analyzeNayin(bazi) {
  const nayin = {
    school: '纳音学说',
    focus: '六十甲子纳音，音声相合',
    analysis: '',
    relationships: [],
    conclusion: ''
  };
  
  const pillars = bazi.pillars;
  const nasinList = pillars.map(p => NA_YIN[p.stem + p.branch]);
  
  let analysis = '纳音分析：';
  
  const relationships = [];
  
  for (let i = 0; i < pillars.length; i++) {
    for (let j = i + 1; j < pillars.length; j++) {
      const nasin1 = nasinList[i];
      const nasin2 = nasinList[j];
      const rel = getNasinRelationship(nasin1, nasin2);
      if (rel) {
        relationships.push({
          pillar1: pillars[i].name,
          pillar2: pillars[j].name,
          nasin1,
          nasin2,
          relationship: rel
        });
      }
    }
  }
  
  nayin.relationships = relationships;
  
  if (relationships.length > 0) {
    relationships.forEach(r => {
      analysis += `${r.pillar1}(${r.nasin1})与${r.pillar2}(${r.nasin2})${r.relationship}；`;
    });
  } else {
    analysis += '纳音之间无明显特殊关系。';
  }
  
  nayin.analysis = analysis;
  
  const harmoniousCount = relationships.filter(r => r.relationship.includes('相生') || r.relationship.includes('相合')).length;
  const conflictingCount = relationships.filter(r => r.relationship.includes('相克') || r.relationship.includes('相冲')).length;
  
  if (harmoniousCount > conflictingCount) {
    nayin.conclusion = '纳音相生相合较多，命运平顺，人际关系和谐。';
  } else if (conflictingCount > harmoniousCount) {
    nayin.conclusion = '纳音相克相冲较多，需注意调和，避免冲突。';
  } else {
    nayin.conclusion = '纳音关系平和，命运平稳发展。';
  }
  
  return nayin;
}

function getNasinRelationship(nasin1, nasin2) {
  const element1 = getNasinElement(nasin1);
  const element2 = getNasinElement(nasin2);
  
  if (WUXING_RELATIONS[element1].生 === element2) return '相生';
  if (WUXING_RELATIONS[element1].克 === element2) return '相克';
  if (element1 === element2) return '同类';
  
  return null;
}

function analyzeBlindSchool(bazi) {
  const blind = {
    school: '盲派命理',
    focus: '神煞、刑冲合害、象法直断',
    analysis: '',
    shensha: [],
    xingchong: [],
    conclusion: ''
  };
  
  let analysis = '盲派命理分析：';
  
  const shensha = [];
  shensha.push(...checkPeachBlossom(bazi));
  shensha.push(...checkTianyi(bazi));
  shensha.push(...checkHuagai(bazi));
  
  blind.shensha = shensha;
  
  if (shensha.length > 0) {
    analysis += '神煞：' + shensha.map(s => s.name + '(' + s.position + ')').join('、') + '；';
  }
  
  const xingchong = [];
  
  bazi.pillars.forEach((pillar, i) => {
    bazi.pillars.slice(i + 1).forEach(otherPillar => {
      if (LIUCHONG[pillar.branch] === otherPillar.branch) {
        xingchong.push({
          type: '冲',
          pillar1: pillar.name,
          pillar2: otherPillar.name,
          branch1: pillar.branch,
          branch2: otherPillar.branch
        });
      }
      if (BAJI[pillar.branch] === otherPillar.branch) {
        xingchong.push({
          type: '害',
          pillar1: pillar.name,
          pillar2: otherPillar.name,
          branch1: pillar.branch,
          branch2: otherPillar.branch
        });
      }
    });
  });
  
  blind.xingchong = xingchong;
  
  if (xingchong.length > 0) {
    xingchong.forEach(x => {
      analysis += `${x.pillar1}(${x.branch1})与${x.pillar2}(${x.branch2})${x.type}；`;
    });
  }
  
  blind.analysis = analysis;
  
  const peachCount = shensha.filter(s => s.name === '桃花').length;
  const tianyiCount = shensha.filter(s => s.name === '天乙贵人').length;
  
  if (tianyiCount >= 2) {
    blind.conclusion = '天乙贵人多，一生贵人相助，逢凶化吉。';
  } else if (peachCount >= 2) {
    blind.conclusion = '桃花旺盛，异性缘好，但需注意感情专一。';
  } else if (xingchong.length >= 3) {
    blind.conclusion = '刑冲合害较多，命运多波折，需谨慎行事。';
  } else {
    blind.conclusion = '神煞平和，刑冲合害少，命运平顺。';
  }
  
  return blind;
}

function checkPeachBlossom(bazi) {
  const peach = ['子', '午', '卯', '酉'];
  const results = [];
  
  bazi.pillars.forEach(pillar => {
    if (peach.includes(pillar.branch)) {
      results.push({ name: '桃花', position: pillar.name });
    }
  });
  
  return results;
}

function checkTianyi(bazi) {
  const tianyiMap = {
    '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'],
    '丁': ['亥', '酉'], '戊': ['丑', '未'], '己': ['子', '申'],
    '庚': ['寅', '午'], '辛': ['寅', '午'], '壬': ['卯', '巳'],
    '癸': ['卯', '巳']
  };
  
  const results = [];
  const rizhu = bazi.rizhu;
  
  if (tianyiMap[rizhu]) {
    bazi.pillars.forEach(pillar => {
      if (tianyiMap[rizhu].includes(pillar.branch)) {
        results.push({ name: '天乙贵人', position: pillar.name });
      }
    });
  }
  
  return results;
}

function checkHuagai(bazi) {
  const huagai = ['辰', '戌', '丑', '未'];
  const results = [];
  
  bazi.pillars.forEach(pillar => {
    if (huagai.includes(pillar.branch)) {
      results.push({ name: '华盖', position: pillar.name });
    }
  });
  
  return results;
}

function analyzeTiaohou(bazi, wuxingAnalysis) {
  const tiaohou = {
    school: '调候学派',
    focus: '四季气候，调候用神',
    analysis: '',
    need: [],
    have: [],
    lack: [],
    conclusion: ''
  };
  
  const monthBranch = bazi.pillars[1].branch;
  
  const tiaohouRules = {
    '寅': { season: '春', climate: '寒', need: '火', description: '春寒需火暖身' },
    '卯': { season: '春', climate: '寒', need: '火', description: '春寒需火暖身' },
    '辰': { season: '春末', climate: '湿', need: '火', description: '辰月湿土需火暖' },
    '巳': { season: '夏', climate: '热', need: '水', description: '夏热需水降温' },
    '午': { season: '夏', climate: '热', need: '水', description: '夏热需水降温' },
    '未': { season: '夏末', climate: '热', need: '水', description: '未月热土需水滋润' },
    '申': { season: '秋', climate: '凉', need: '火', description: '秋凉需火暖' },
    '酉': { season: '秋', climate: '凉', need: '火', description: '秋凉需火暖' },
    '戌': { season: '秋末', climate: '燥', need: '水', description: '戌月燥土需水滋润' },
    '亥': { season: '冬', climate: '寒', need: '火', description: '冬寒需火暖身' },
    '子': { season: '冬', climate: '寒', need: '火', description: '冬寒需火暖身' },
    '丑': { season: '冬末', climate: '寒', need: '火', description: '丑月寒湿需火暖' }
  };
  
  const rule = tiaohouRules[monthBranch];
  if (!rule) {
    tiaohou.analysis = '无法确定调候需求';
    tiaohou.conclusion = '需参考其他流派';
    return tiaohou;
  }
  
  tiaohou.need = [rule.need];
  tiaohou.analysis = `${rule.season}${rule.climate}，${rule.description}。`;
  
  const hasElement = wuxingAnalysis.scores[rule.need] > 0;
  
  if (hasElement) {
    tiaohou.have = [rule.need];
    tiaohou.analysis += `命局中有${rule.need}，调候得宜。`;
    tiaohou.conclusion = '调候用神得地，格局层次高。';
  } else {
    tiaohou.lack = [rule.need];
    tiaohou.analysis += `命局中缺${rule.need}，需大运流年补救。`;
    tiaohou.conclusion = '调候用神不足，需待时机。';
  }
  
  return tiaohou;
}

function getMultiSchoolReport(bazi, shishenAnalysis, wuxingAnalysis) {
  const ziping = analyzeZiping(bazi, shishenAnalysis, wuxingAnalysis);
  const luming = analyzeLuming(bazi);
  const nayin = analyzeNayin(bazi);
  const blind = analyzeBlindSchool(bazi);
  const tiaohou = analyzeTiaohou(bazi, wuxingAnalysis);
  
  let report = `【多流派综合分析报告】\n\n`;
  
  report += `【${ziping.school}】\n`;
  report += `核心关注点：${ziping.focus}\n`;
  report += `分析：${ziping.analysis}\n`;
  report += `结论：${ziping.conclusion}\n\n`;
  
  report += `【${luming.school}】\n`;
  report += `核心关注点：${luming.focus}\n`;
  report += `分析：${luming.analysis}\n`;
  report += `纳音详情：\n`;
  luming.nasinAnalysis.forEach(n => {
    report += `  ${n.pillar}：${n.ganzhi}(${n.nasin})\n`;
  });
  report += `结论：${luming.conclusion}\n\n`;
  
  report += `【${nayin.school}】\n`;
  report += `核心关注点：${nayin.focus}\n`;
  report += `分析：${nayin.analysis}\n`;
  report += `结论：${nayin.conclusion}\n\n`;
  
  report += `【${blind.school}】\n`;
  report += `核心关注点：${blind.focus}\n`;
  report += `分析：${blind.analysis}\n`;
  report += `结论：${blind.conclusion}\n\n`;
  
  report += `【${tiaohou.school}】\n`;
  report += `核心关注点：${tiaohou.focus}\n`;
  report += `分析：${tiaohou.analysis}\n`;
  report += `结论：${tiaohou.conclusion}\n\n`;
  
  report += `【综合结论】\n`;
  report += `综合五大流派分析：\n`;
  report += `1. ${ziping.conclusion}\n`;
  report += `2. ${luming.conclusion}\n`;
  report += `3. ${nayin.conclusion}\n`;
  report += `4. ${blind.conclusion}\n`;
  report += `5. ${tiaohou.conclusion}\n`;
  
  return {
    ziping,
    luming,
    nayin,
    blind,
    tiaohou,
    report
  };
}

module.exports = {
  analyzeZiping,
  analyzeLuming,
  analyzeNayin,
  analyzeBlindSchool,
  analyzeTiaohou,
  getMultiSchoolReport
};