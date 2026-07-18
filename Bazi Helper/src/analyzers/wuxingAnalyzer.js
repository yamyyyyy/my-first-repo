const { WUXING_RELATIONS, TIANGAN_WUXING, DIZHI_WUXING, DIZHI_TIANSHEN, TIANGAN, DIZHI } = require('../utils/constants');

function analyzeXiji(bazi, wuxingAnalysis) {
  const rizhu = bazi.rizhu;
  const rizhuWuxing = wuxingAnalysis.rizhuWuxing;
  const scores = wuxingAnalysis.scores;
  const sortedElements = wuxingAnalysis.sorted;
  
  const xiji = {
    xi: [],
    ji: [],
    neutral: [],
    yong: null,
    description: ''
  };
  
  const elementAnalysis = {};
  Object.keys(scores).forEach(element => {
    const score = scores[element];
    const ratio = (score / wuxingAnalysis.total) * 100;
    
    let status = '中和';
    if (ratio > 25) status = '偏旺';
    if (ratio > 35) status = '太旺';
    if (ratio < 15) status = '偏弱';
    if (ratio < 10) status = '太弱';
    
    elementAnalysis[element] = {
      score,
      ratio: ratio.toFixed(1),
      status
    };
  });
  
  const rizhuStatus = elementAnalysis[rizhuWuxing].status;
  
  if (rizhuStatus === '太旺' || rizhuStatus === '偏旺') {
    xiji.yong = WUXING_RELATIONS[rizhuWuxing].被克;
    xiji.xi.push(WUXING_RELATIONS[rizhuWuxing].被克);
    xiji.xi.push(WUXING_RELATIONS[rizhuWuxing].被生);
    xiji.ji.push(rizhuWuxing);
    xiji.ji.push(WUXING_RELATIONS[rizhuWuxing].生);
    xiji.description = `${rizhu}${rizhuWuxing}${rizhuStatus}，以${xiji.yong}为用神，喜${xiji.xi.join('、')}，忌${xiji.ji.join('、')}`;
  } else if (rizhuStatus === '太弱' || rizhuStatus === '偏弱') {
    xiji.yong = rizhuWuxing;
    xiji.xi.push(rizhuWuxing);
    xiji.xi.push(WUXING_RELATIONS[rizhuWuxing].被生);
    xiji.ji.push(WUXING_RELATIONS[rizhuWuxing].被克);
    xiji.ji.push(WUXING_RELATIONS[rizhuWuxing].生);
    xiji.description = `${rizhu}${rizhuWuxing}${rizhuStatus}，以${xiji.yong}为用神，喜${xiji.xi.join('、')}，忌${xiji.ji.join('、')}`;
  } else {
    xiji.yong = null;
    xiji.description = `${rizhu}${rizhuWuxing}中和，用神需结合格局、调候综合判断`;
    
    sortedElements.forEach(element => {
      if (elementAnalysis[element].ratio < 12) {
        xiji.xi.push(element);
      } else if (elementAnalysis[element].ratio > 28) {
        xiji.ji.push(element);
      }
    });
    
    if (xiji.xi.length === 0) xiji.neutral = ['金', '木', '水', '火', '土'];
  }
  
  const tiaohou = analyzeTiaohou(bazi);
  if (tiaohou && (!xiji.yong || elementAnalysis[tiaohou].ratio < 15)) {
    if (!xiji.xi.includes(tiaohou)) {
      xiji.xi.unshift(tiaohou);
      xiji.description += `，调候需${tiaohou}`;
    }
  }
  
  xiji.elementAnalysis = elementAnalysis;
  
  return xiji;
}

function analyzeTiaohou(bazi) {
  const monthBranch = bazi.pillars[1].branch;
  const monthIndex = DIZHI.indexOf(monthBranch);
  
  const tiaohouRules = {
    '寅': { cold: true, need: '火' },
    '卯': { cold: true, need: '火' },
    '辰': { wet: true, need: '火' },
    '巳': { hot: true, need: '水' },
    '午': { hot: true, need: '水' },
    '未': { hot: true, need: '水' },
    '申': { cool: true, need: '火' },
    '酉': { cool: true, need: '火' },
    '戌': { dry: true, need: '水' },
    '亥': { cold: true, need: '火' },
    '子': { cold: true, need: '火' },
    '丑': { cold: true, need: '火' }
  };
  
  const rule = tiaohouRules[monthBranch];
  if (rule) {
    return rule.need;
  }
  
  return null;
}

function analyzeGuiju(bazi, shishenAnalysis) {
  const rizhu = bazi.rizhu;
  const monthBranch = bazi.pillars[1].branch;
  const monthStem = bazi.pillars[1].stem;
  
  const shishenSummary = shishenAnalysis.summary;
  
  const guiju = {
    type: null,
    description: '',
    characteristics: []
  };
  
  const monthShishen = shishenAnalysis.detailed.month.find(s => s.type === '天干')?.shishen;
  
  const guijuTypes = {
    '正官': { name: '正官格', desc: '月柱透出正官，为人正直，责任感强' },
    '七杀': { name: '七杀格', desc: '月柱透出七杀，性格刚毅，有决断力' },
    '正财': { name: '正财格', desc: '月柱透出正财，务实稳重，重视财富' },
    '偏财': { name: '偏财格', desc: '月柱透出偏财，善于理财，财运较好' },
    '食神': { name: '食神格', desc: '月柱透食神，聪明多才，性格温和' },
    '伤官': { name: '伤官格', desc: '月柱透伤官，思维敏捷，才华横溢' },
    '正印': { name: '正印格', desc: '月柱透正印，仁慈善良，学业有成' },
    '偏印': { name: '偏印格', desc: '月柱透偏印，悟性高超，思维独特' },
    '比肩': { name: '比肩格', desc: '月柱透比肩，性格独立，朋友众多' },
    '劫财': { name: '劫财格', desc: '月柱透劫财，性格豪爽，但易破财' }
  };
  
  if (monthShishen && guijuTypes[monthShishen]) {
    guiju.type = guijuTypes[monthShishen].name;
    guiju.description = guijuTypes[monthShishen].desc;
  }
  
  if (shishenSummary['正官'] && shishenSummary['正印']) {
    guiju.characteristics.push('官印相生');
  }
  if (shishenSummary['食神'] && shishenSummary['正财']) {
    guiju.characteristics.push('食神生财');
  }
  if (shishenSummary['伤官'] && shishenSummary['七杀']) {
    guiju.characteristics.push('伤官制杀');
  }
  if (shishenSummary['正官'] && shishenSummary['七杀']) {
    guiju.characteristics.push('官杀混杂');
  }
  if (shishenSummary['正财'] && shishenSummary['偏财']) {
    guiju.characteristics.push('财星混杂');
  }
  if (shishenSummary['比肩'] && shishenSummary['劫财']) {
    guiju.characteristics.push('比劫林立');
  }
  
  return guiju;
}

function getWuxingDetails(bazi) {
  const details = [];
  
  bazi.pillars.forEach(pillar => {
    const stemWuxing = TIANGAN_WUXING[TIANGAN.indexOf(pillar.stem)];
    const branchWuxing = DIZHI_WUXING[DIZHI.indexOf(pillar.branch)];
    
    details.push({
      pillar: pillar.name,
      stem: pillar.stem,
      stemWuxing,
      branch: pillar.branch,
      branchWuxing,
      hiddenGan: DIZHI_TIANSHEN[pillar.branch].split('').map(gan => ({
        gan,
        wuxing: TIANGAN_WUXING[TIANGAN.indexOf(gan)]
      }))
    });
  });
  
  return details;
}

module.exports = {
  analyzeXiji,
  analyzeTiaohou,
  analyzeGuiju,
  getWuxingDetails
};