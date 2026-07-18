const { Solar, Lunar } = require('lunar-javascript');
const { TIANGAN, DIZHI, TIANGAN_WUXING, DIZHI_WUXING, DIZHI_TIANSHEN, SHAOXING_TABLE } = require('../utils/constants');

function calculateBazi(year, month, day, hour, gender) {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  
  const yearGanZhi = lunar.getYearInGanZhi();
  const monthGanZhi = lunar.getMonthInGanZhi();
  const dayGanZhi = lunar.getDayInGanZhi();
  
  const hourPillar = getHourPillar(dayGanZhi.charAt(0), hour);
  
  const pillars = [
    { name: '年柱', stem: yearGanZhi.charAt(0), branch: yearGanZhi.charAt(1) },
    { name: '月柱', stem: monthGanZhi.charAt(0), branch: monthGanZhi.charAt(1) },
    { name: '日柱', stem: dayGanZhi.charAt(0), branch: dayGanZhi.charAt(1) },
    { name: '时柱', stem: hourPillar.stem, branch: hourPillar.branch }
  ];
  
  const rizhu = dayGanZhi.charAt(0);
  const rizhuWuxing = TIANGAN_WUXING[TIANGAN.indexOf(rizhu)];
  
  const daliun = calculateDaLiun(pillars, lunar.getMonth(), gender);
  const liunian = calculateLiuNian(year, pillars);
  
  return {
    pillars,
    rizhu,
    rizhuWuxing,
    daliun,
    liunian,
    gender,
    birth: { year, month, day, hour },
    lunar: {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      yearGanZhi,
      monthGanZhi,
      dayGanZhi,
      zodiac: lunar.getYearShengXiao()
    }
  };
}

function getHourPillar(dayStem, hour) {
  const dayIndex = TIANGAN.indexOf(dayStem);
  let hourIndex = Math.floor(hour / 2);
  
  const hourStemIndex = (dayIndex * 2 + hourIndex) % 10;
  const hourStem = TIANGAN[hourStemIndex];
  const hourBranch = DIZHI[hourIndex];
  
  return { stem: hourStem, branch: hourBranch };
}

function calculateDaLiun(pillars, month, gender) {
  const dayStem = pillars[2].stem;
  const dayStemIndex = TIANGAN.indexOf(dayStem);
  
  const monthBranch = pillars[1].branch;
  const monthBranchIndex = DIZHI.indexOf(monthBranch);
  
  let startIndex;
  if (gender === '男') {
    if (TIANGAN.indexOf(dayStem) % 2 === 0) {
      startIndex = (monthBranchIndex + 1) % 12;
    } else {
      startIndex = (monthBranchIndex - 1 + 12) % 12;
    }
  } else {
    if (TIANGAN.indexOf(dayStem) % 2 === 0) {
      startIndex = (monthBranchIndex - 1 + 12) % 12;
    } else {
      startIndex = (monthBranchIndex + 1) % 12;
    }
  }
  
  const daliun = [];
  let currentIndex = startIndex;
  let direction = gender === '男' ? 1 : -1;
  if (dayStemIndex % 2 === 1) {
    direction = -direction;
  }
  
  for (let i = 0; i < 10; i++) {
    const branch = DIZHI[currentIndex];
    const shaoxingIndex = DIZHI.indexOf(branch);
    const stem = SHAOXING_TABLE[shaoxingIndex][dayStemIndex];
    
    daliun.push({
      index: i + 1,
      stem,
      branch,
      age: i * 10 + (i === 0 ? 1 : 0),
      years: []
    });
    
    currentIndex = (currentIndex + direction + 12) % 12;
  }
  
  return daliun;
}

function calculateLiuNian(startYear, pillars) {
  const liunian = [];
  const dayStem = pillars[2].stem;
  const dayStemIndex = TIANGAN.indexOf(dayStem);
  
  for (let year = startYear; year < startYear + 60; year++) {
    const solar = Solar.fromYmd(year, 1, 1);
    const lunar = solar.getLunar();
    const yearGanZhi = lunar.getYearInGanZhi();
    
    const shaoxingIndex = DIZHI.indexOf(yearGanZhi.charAt(1));
    const yearStem = SHAOXING_TABLE[shaoxingIndex][dayStemIndex];
    
    liunian.push({
      year,
      stem: yearStem,
      branch: yearGanZhi.charAt(1),
      originalStem: yearGanZhi.charAt(0)
    });
  }
  
  return liunian;
}

function getShishen(rizhu, otherStem) {
  const rizhuIndex = TIANGAN.indexOf(rizhu);
  const otherIndex = TIANGAN.indexOf(otherStem);
  
  let diff = otherIndex - rizhuIndex;
  if (diff < 0) diff += 10;
  
  const shishenMap = ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'];
  return shishenMap[diff];
}

function analyzeShishen(bazi) {
  const rizhu = bazi.rizhu;
  const shishenResult = {
    year: [],
    month: [],
    day: [],
    hour: []
  };
  
  bazi.pillars.forEach((pillar, index) => {
    const pillarName = ['year', 'month', 'day', 'hour'][index];
    
    const stemShishen = getShishen(rizhu, pillar.stem);
    shishenResult[pillarName].push({
      element: pillar.stem,
      shishen: stemShishen,
      type: '天干'
    });
    
    const branchTianGan = DIZHI_TIANSHEN[pillar.branch];
    for (let i = 0; i < branchTianGan.length; i++) {
      const gan = branchTianGan[i];
      const shishen = getShishen(rizhu, gan);
      shishenResult[pillarName].push({
        element: gan,
        shishen: shishen,
        type: '地支藏干'
      });
    }
  });
  
  const shishenCount = {};
  Object.values(shishenResult).forEach(pillar => {
    pillar.forEach(item => {
      shishenCount[item.shishen] = (shishenCount[item.shishen] || 0) + 1;
    });
  });
  
  return {
    detailed: shishenResult,
    summary: shishenCount
  };
}

function analyzeWuxing(bazi) {
  const wuxingCount = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  
  bazi.pillars.forEach(pillar => {
    wuxingCount[TIANGAN_WUXING[TIANGAN.indexOf(pillar.stem)]]++;
    
    const branchWuxing = DIZHI_WUXING[DIZHI.indexOf(pillar.branch)];
    wuxingCount[branchWuxing] += 1.5;
    
    const branchTianGan = DIZHI_TIANSHEN[pillar.branch];
    for (let i = 0; i < branchTianGan.length; i++) {
      const gan = branchTianGan[i];
      wuxingCount[TIANGAN_WUXING[TIANGAN.indexOf(gan)]] += 0.5;
    }
  });
  
  const rizhuWuxing = bazi.rizhuWuxing;
  const scores = {};
  
  Object.keys(wuxingCount).forEach(element => {
    let score = wuxingCount[element];
    if (element === rizhuWuxing) score += 2;
    scores[element] = score;
  });
  
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  
  const elementAnalysis = {};
  Object.keys(scores).forEach(element => {
    const score = scores[element];
    const ratio = (score / total) * 100;
    
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
  
  const sortedElements = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const strongest = sortedElements[0];
  const weakest = sortedElements[sortedElements.length - 1];
  
  return {
    count: wuxingCount,
    scores,
    total,
    strongest,
    weakest,
    rizhuWuxing,
    sorted: sortedElements,
    elementAnalysis
  };
}

function convertLunarToSolar(lunarYear, lunarMonth, lunarDay) {
  const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay);
  const solar = lunar.getSolar();
  
  return {
    year: solar.getYear(),
    month: solar.getMonth(),
    day: solar.getDay(),
    weekday: solar.getWeekInChinese(),
    zodiac: lunar.getYearShengXiao(),
    ganzhi: lunar.getYearInGanZhi()
  };
}

function getYearPillar(year) {
  const solar = Solar.fromYmd(year, 1, 1);
  const lunar = solar.getLunar();
  const ganZhi = lunar.getYearInGanZhi();
  return { stem: ganZhi.charAt(0), branch: ganZhi.charAt(1) };
}

module.exports = {
  calculateBazi,
  analyzeShishen,
  analyzeWuxing,
  getShishen,
  getYearPillar,
  getHourPillar,
  convertLunarToSolar
};