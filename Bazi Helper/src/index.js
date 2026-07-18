const { calculateBazi, analyzeShishen, analyzeWuxing } = require('./calculator/baziCalculator');
const { analyzeXiji, analyzeGuiju, getWuxingDetails } = require('./analyzers/wuxingAnalyzer');
const { analyzePersonality, getPersonalityReport } = require('./analyzers/personalityAnalyzer');
const { analyzePeachBlossom, analyzeSpouse, analyzeMarriageFortune, getRelationshipReport } = require('./analyzers/relationshipAnalyzer');
const { analyzeTalents, analyzeCareer, analyzeWealth, getCareerReport } = require('./analyzers/careerAnalyzer');
const { analyzeZiping, analyzeLuming, analyzeNayin, analyzeBlindSchool, analyzeTiaohou, getMultiSchoolReport } = require('./analyzers/schoolAnalyzer');

module.exports = {
  calculateBazi,
  analyzeShishen,
  analyzeWuxing,
  analyzeXiji,
  analyzeGuiju,
  getWuxingDetails,
  analyzePersonality,
  getPersonalityReport,
  analyzePeachBlossom,
  analyzeSpouse,
  analyzeMarriageFortune,
  getRelationshipReport,
  analyzeTalents,
  analyzeCareer,
  analyzeWealth,
  getCareerReport,
  analyzeZiping,
  analyzeLuming,
  analyzeNayin,
  analyzeBlindSchool,
  analyzeTiaohou,
  getMultiSchoolReport
};