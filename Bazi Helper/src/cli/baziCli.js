const readline = require('readline');
const { calculateBazi, analyzeShishen, analyzeWuxing, convertLunarToSolar } = require('../calculator/baziCalculator');
const { analyzeXiji, analyzeGuiju } = require('../analyzers/wuxingAnalyzer');
const { getPersonalityReport } = require('../analyzers/personalityAnalyzer');
const { getRelationshipReport } = require('../analyzers/relationshipAnalyzer');
const { getCareerReport } = require('../analyzers/careerAnalyzer');
const { getMultiSchoolReport } = require('../analyzers/schoolAnalyzer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '八字命理助手 > '
});

let bazi = null;
let shishenAnalysis = null;
let wuxingAnalysis = null;

function printWelcome() {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║     八字命理智能分析助手              ║');
  console.log('║     Bazi Numerology Assistant        ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');
  console.log('欢迎使用八字命理智能分析助手！');
  console.log('本助手基于25部经典命理古籍，支持多流派分析。');
  console.log('');
  console.log('⚠️  重要提示：排盘时请输入【公历】出生年月日时');
  console.log('   如果您只有农历日期，请先使用【万年历】功能进行换算');
  console.log('');
}

function printMenu() {
  console.log('');
  console.log('┌─────────────────────────────────────┐');
  console.log('│            功能菜单                   │');
  console.log('├─────────────────────────────────────┤');
  console.log('│ 1. 排盘 - 输入出生日期进行八字排盘    │');
  console.log('│ 2. 万年历 - 农历/公历日期换算         │');
  console.log('│ 3. 五行 - 分析五行喜忌               │');
  console.log('│ 4. 性格 - 分析人物性格特征            │');
  console.log('│ 5. 感情 - 分析感情正缘和婚姻          │');
  console.log('│ 6. 事业 - 分析天赋和适合的行业        │');
  console.log('│ 7. 流派 - 多流派综合分析              │');
  console.log('│ 8. 完整 - 生成完整分析报告            │');
  console.log('│ 9. 帮助 - 显示帮助信息                │');
  console.log('│ 0. 退出 - 退出程序                   │');
  console.log('└─────────────────────────────────────┘');
  console.log('');
  rl.prompt();
}

function askBirthInfo() {
  console.log('');
  console.log('📅 请输入【公历】出生日期信息：');
  console.log('   如果您只有农历日期，请先使用【万年历】功能进行换算');
  console.log('');
  
  rl.question('公历年份 (如：2000)：', (year) => {
    rl.question('公历月份 (如：5)：', (month) => {
      rl.question('公历日期 (如：20)：', (day) => {
        rl.question('出生时辰 (0-23，如：14表示下午2点)：', (hour) => {
          rl.question('性别 (男/女)：', (gender) => {
            try {
              const birthYear = parseInt(year);
              const birthMonth = parseInt(month);
              const birthDay = parseInt(day);
              const birthHour = parseInt(hour);
              
              if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay) || isNaN(birthHour)) {
                console.log('❌ 错误：请输入有效的数字！');
                askBirthInfo();
                return;
              }
              
              if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31 || birthHour < 0 || birthHour > 23) {
                console.log('❌ 错误：日期或时间格式不正确！');
                askBirthInfo();
                return;
              }
              
              if (gender !== '男' && gender !== '女') {
                console.log('❌ 错误：性别只能是"男"或"女"！');
                askBirthInfo();
                return;
              }
              
              const date = new Date(birthYear, birthMonth - 1, birthDay);
              if (date.getFullYear() !== birthYear || date.getMonth() !== birthMonth - 1 || date.getDate() !== birthDay) {
                console.log('❌ 错误：日期不存在！');
                askBirthInfo();
                return;
              }
              
              bazi = calculateBazi(birthYear, birthMonth, birthDay, birthHour, gender);
              shishenAnalysis = analyzeShishen(bazi);
              wuxingAnalysis = analyzeWuxing(bazi);
              
              console.log('');
              console.log('✅ 八字排盘成功！');
              printBazi();
              printMenu();
            } catch (error) {
              console.log('❌ 排盘出错：', error.message);
              askBirthInfo();
            }
          });
        });
      });
    });
  });
}

function lunarToSolar() {
  console.log('');
  console.log('📅 农历转公历功能');
  console.log('');
  
  rl.question('农历年份 (如：2000)：', (year) => {
    rl.question('农历月份 (如：5)：', (month) => {
      rl.question('农历日期 (如：20)：', (day) => {
        try {
          const lunarYear = parseInt(year);
          const lunarMonth = parseInt(month);
          const lunarDay = parseInt(day);
          
          if (isNaN(lunarYear) || isNaN(lunarMonth) || isNaN(lunarDay)) {
            console.log('❌ 错误：请输入有效的数字！');
            lunarToSolar();
            return;
          }
          
          if (lunarMonth < 1 || lunarMonth > 12 || lunarDay < 1 || lunarDay > 30) {
            console.log('❌ 错误：日期格式不正确！');
            lunarToSolar();
            return;
          }
          
          const solarDate = convertLunarToSolar(lunarYear, lunarMonth, lunarDay);
          
          console.log('');
          console.log('┌─────────────────────────────────────┐');
          console.log('│           农历转公历结果             │');
          console.log('├─────────────────────────────────────┤');
          console.log(`│ 农历：${lunarYear}年${lunarMonth}月${lunarDay}日`);
          console.log(`│ 公历：${solarDate.year}年${solarDate.month}月${solarDate.day}日`);
          console.log(`│ 星期：${solarDate.weekday}`);
          console.log(`│ 生肖：${solarDate.zodiac}`);
          console.log('└─────────────────────────────────────┘');
          console.log('');
          console.log(`💡 请使用公历 ${solarDate.year}年${solarDate.month}月${solarDate.day}日 进行排盘`);
          
          printMenu();
        } catch (error) {
          console.log('❌ 换算出错：', error.message);
          lunarToSolar();
        }
      });
    });
  });
}



function printBazi() {
  if (!bazi) {
    console.log('请先进行八字排盘！');
    return;
  }
  
  console.log('');
  console.log('┌─────────────────────────────────────┐');
  console.log('│           八字排盘结果               │');
  console.log('├─────────────────────────────────────┤');
  
  const pillars = bazi.pillars;
  console.log(`│ 年柱：${pillars[0].stem}${pillars[0].branch}`);
  console.log(`│ 月柱：${pillars[1].stem}${pillars[1].branch}`);
  console.log(`│ 日柱：${pillars[2].stem}${pillars[2].branch}  (日主：${bazi.rizhu})`);
  console.log(`│ 时柱：${pillars[3].stem}${pillars[3].branch}`);
  
  console.log('├─────────────────────────────────────┤');
  console.log(`│ 日主五行：${bazi.rizhuWuxing}`);
  console.log(`│ 性别：${bazi.gender}`);
  console.log(`│ 公历：${bazi.birth.year}年${bazi.birth.month}月${bazi.birth.day}日${bazi.birth.hour}时`);
  if (bazi.lunar) {
    console.log(`│ 农历：${bazi.lunar.year}年${bazi.lunar.month}月${bazi.lunar.day}日`);
    console.log(`│ 生肖：${bazi.lunar.zodiac}  年柱：${bazi.lunar.yearGanZhi}`);
  }
  console.log('└─────────────────────────────────────┘');
}

function printWuxingAnalysis() {
  if (!bazi || !wuxingAnalysis) {
    console.log('请先进行八字排盘！');
    return;
  }
  
  const xiji = analyzeXiji(bazi, wuxingAnalysis);
  const guiju = analyzeGuiju(bazi, shishenAnalysis);
  
  console.log('');
  console.log('┌─────────────────────────────────────┐');
  console.log('│           五行分析报告               │');
  console.log('├─────────────────────────────────────┤');
  
  console.log('│ 五行分数：');
  Object.keys(wuxingAnalysis.scores).forEach(element => {
    console.log(`│   ${element}：${wuxingAnalysis.scores[element].toFixed(1)}分 (${wuxingAnalysis.elementAnalysis[element].ratio}%) - ${wuxingAnalysis.elementAnalysis[element].status}`);
  });
  
  console.log('├─────────────────────────────────────┤');
  console.log('│ 喜忌分析：');
  console.log(`│   用神：${xiji.yong || '需综合判断'}`);
  console.log(`│   喜神：${xiji.xi.length > 0 ? xiji.xi.join('、') : '无'}`);
  console.log(`│   忌神：${xiji.ji.length > 0 ? xiji.ji.join('、') : '无'}`);
  console.log(`│   说明：${xiji.description}`);
  
  console.log('├─────────────────────────────────────┤');
  console.log('│ 格局分析：');
  console.log(`│   格局类型：${guiju.type || '未定'}`);
  console.log(`│   格局描述：${guiju.description || ''}`);
  if (guiju.characteristics.length > 0) {
    console.log(`│   格局特征：${guiju.characteristics.join('、')}`);
  }
  
  console.log('└─────────────────────────────────────┘');
}

function printPersonalityReport() {
  if (!bazi || !shishenAnalysis || !wuxingAnalysis) {
    console.log('请先进行八字排盘！');
    return;
  }
  
  const report = getPersonalityReport(bazi, shishenAnalysis, wuxingAnalysis);
  console.log('');
  console.log(report.report);
}

function printRelationshipReport() {
  if (!bazi || !shishenAnalysis) {
    console.log('请先进行八字排盘！');
    return;
  }
  
  const report = getRelationshipReport(bazi, shishenAnalysis);
  console.log('');
  console.log(report.report);
}

function printCareerReport() {
  if (!bazi || !shishenAnalysis || !wuxingAnalysis) {
    console.log('请先进行八字排盘！');
    return;
  }
  
  const report = getCareerReport(bazi, shishenAnalysis, wuxingAnalysis);
  console.log('');
  console.log(report.report);
}

function printMultiSchoolReport() {
  if (!bazi || !shishenAnalysis || !wuxingAnalysis) {
    console.log('请先进行八字排盘！');
    return;
  }
  
  const report = getMultiSchoolReport(bazi, shishenAnalysis, wuxingAnalysis);
  console.log('');
  console.log(report.report);
}

function printFullReport() {
  if (!bazi || !shishenAnalysis || !wuxingAnalysis) {
    console.log('请先进行八字排盘！');
    return;
  }
  
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║          八字命理完整分析报告          ║');
  console.log('╚══════════════════════════════════════╝');
  
  printBazi();
  
  const xiji = analyzeXiji(bazi, wuxingAnalysis);
  console.log('');
  console.log('【五行喜忌】');
  console.log(`用神：${xiji.yong || '需综合判断'}`);
  console.log(`喜神：${xiji.xi.join('、')}`);
  console.log(`忌神：${xiji.ji.join('、')}`);
  console.log(`说明：${xiji.description}`);
  
  const personality = getPersonalityReport(bazi, shishenAnalysis, wuxingAnalysis);
  console.log('');
  console.log('【性格分析】');
  console.log(`整体性格：${personality.personality.overall}`);
  console.log(`优点：${personality.personality.strengths.join('、')}`);
  console.log(`缺点：${personality.personality.weaknesses.join('、')}`);
  
  const relationship = getRelationshipReport(bazi, shishenAnalysis);
  console.log('');
  console.log('【感情分析】');
  console.log(`桃花数量：${relationship.peachBlossom.count}个`);
  console.log(`配偶特征：${relationship.spouse.spouseTraits.join('、')}`);
  if (relationship.spouse.meetingTime.length > 0) {
    console.log(`正缘时机：${relationship.spouse.meetingTime.map(t => t.year).join('、')}年`);
  }
  
  const career = getCareerReport(bazi, shishenAnalysis, wuxingAnalysis);
  console.log('');
  console.log('【事业分析】');
  console.log(`推荐行业：${career.career.recommended.slice(0, 5).join('、')}`);
  console.log(`主要天赋：${career.talents.primary.join('、')}`);
  console.log(`财富潜力：${career.wealth.potential}`);
  
  const school = getMultiSchoolReport(bazi, shishenAnalysis, wuxingAnalysis);
  console.log('');
  console.log('【综合结论】');
  console.log(school.report.split('【综合结论】')[1]);
  
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║            分析报告结束               ║');
  console.log('╚══════════════════════════════════════╝');
}

function printHelp() {
  console.log('');
  console.log('┌─────────────────────────────────────┐');
  console.log('│            帮助信息                   │');
  console.log('├─────────────────────────────────────┤');
  console.log('│ 使用方法：                           │');
  console.log('│   1. 排盘时请输入【公历】出生日期      │');
  console.log('│   2. 只有农历日期请先使用万年历换算    │');
  console.log('│   3. 然后选择需要的分析功能            │');
  console.log('│                                     │');
  console.log('│ 功能说明：                           │');
  console.log('│   排盘：输入公历年月日时和性别，生成八字│');
  console.log('│   万年历：农历日期转换为公历日期        │');
  console.log('│   五行：分析五行强弱、喜忌用神          │');
  console.log('│   性格：基于十神和五行分析性格特征      │');
  console.log('│   感情：分析桃花、配偶星、正缘时机      │');
  console.log('│   事业：分析天赋、适合行业、财运        │');
  console.log('│   流派：子平、禄命、纳音、盲派等分析    │');
  console.log('│   完整：生成完整的命理分析报告          │');
  console.log('│                                     │');
  console.log('│ 注意事项：                           │');
  console.log('│   - 排盘必须使用【公历】日期            │');
  console.log('│   - 时间使用24小时制                   │');
  console.log('│   - 结果仅供参考，请勿过分迷信          │');
  console.log('└─────────────────────────────────────┘');
}

rl.on('line', (input) => {
  const cmd = input.trim();
  
  switch (cmd) {
    case '1':
    case '排盘':
      askBirthInfo();
      break;
    case '2':
    case '万年历':
      lunarToSolar();
      break;
    case '3':
    case '五行':
      printWuxingAnalysis();
      printMenu();
      break;
    case '4':
    case '性格':
      printPersonalityReport();
      printMenu();
      break;
    case '5':
    case '感情':
      printRelationshipReport();
      printMenu();
      break;
    case '6':
    case '事业':
      printCareerReport();
      printMenu();
      break;
    case '7':
    case '流派':
      printMultiSchoolReport();
      printMenu();
      break;
    case '8':
    case '完整':
      printFullReport();
      printMenu();
      break;
    case '9':
    case '帮助':
      printHelp();
      printMenu();
      break;
    case '0':
    case '退出':
      console.log('');
      console.log('感谢使用八字命理智能分析助手！');
      console.log('祝您生活愉快，万事如意！');
      rl.close();
      break;
    default:
      console.log('');
      console.log(`未知命令：${cmd}`);
      console.log('请输入数字0-9或命令名称（如：排盘、万年历、五行等）');
      printMenu();
  }
});

rl.on('close', () => {
  process.exit(0);
});

printWelcome();
printMenu();