import type { Quote } from '../types';
import { additionalQuotes } from './additional-quotes';
import { completeQuote, type QuoteDraft } from './editorial';
import { volumeFiveQuotes } from './volume-five';
import { applyQuotePreferences } from './user-preferences';

const SOURCE = {
  investigation: 'https://www.12371.cn/2012/08/10/ARTI1344592797863461.shtml',
  practice: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193707.htm',
  contradiction: 'https://theory.gmw.cn/2012-09/25/content_5201761_7.htm',
  strategy: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193612.htm',
  serve: 'https://www.sppc.edu.cn/zzb/2017/0805/c590a11527/page.htm',
  yugong: 'https://www.vrrw.net/wx/14691.html',
  spark: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19300105.htm',
};

const base = {
  investigation: { volume: '第一卷', work: '反对本本主义', year: '1930 年 5 月', sourceUrl: SOURCE.investigation, historicalContext: '1930 年，针对革命工作中脱离中国实际、把书本和上级指示当成固定答案的倾向，文章系统讨论调查的重要性与方法。“本本”指书本和既有条文，反对的是机械照搬，而不是读书本身。' },
  practice: { volume: '第一卷', work: '实践论', year: '1937 年 7 月', sourceUrl: SOURCE.practice, historicalContext: '1937 年在延安写成的哲学著作，重点批评轻视实践、把认识当成一次完成的教条主义。文章从直接经验谈起，说明认识如何在实践与理论之间往复发展。' },
  contradiction: { volume: '第一卷', work: '矛盾论', year: '1937 年 8 月', sourceUrl: SOURCE.contradiction, historicalContext: '1937 年在延安写成的哲学著作，针对把复杂现实套进固定公式的思想方法，分析矛盾的普遍性与特殊性、主要矛盾以及内外因关系。“矛盾”是分析事物关系的概念，不只指人际争执。' },
  strategy: { volume: '第一卷', work: '中国革命战争的战略问题', year: '1936 年 12 月', sourceUrl: SOURCE.strategy, historicalContext: '1936 年为总结第二次国内革命战争经验而作，讨论中国革命战争的特点、战略防御和学习战争规律。所选语句原本服务于军事分析，借鉴到日常时应保留其条件意识。' },
  serve: { volume: '第三卷', work: '为人民服务', year: '1944 年 9 月 8 日', sourceUrl: SOURCE.serve, historicalContext: '1944 年 9 月 8 日，中共中央警备团追悼张思德，毛泽东在追悼会上发表这篇演讲。文章由张思德的牺牲谈到为人民利益工作、面对批评、改正错误和团结互助。' },
  yugong: { volume: '第三卷', work: '愚公移山', year: '1945 年 6 月 11 日', sourceUrl: SOURCE.yugong, historicalContext: '1945 年中共七大闭幕词引用《列子·汤问》的愚公移山寓言，以“两座大山”指帝国主义和封建主义，号召依靠人民、持续奋斗。“上帝”和“挖山”都在寓言语境中使用。' },
  spark: { volume: '第一卷', work: '星星之火，可以燎原', year: '1930 年 1 月 5 日', sourceUrl: SOURCE.spark, historicalContext: '这是 1930 年写给林彪的一封信，针对当时红军中关于革命前途的悲观估计，分析农村革命根据地的发展条件。标题比喻微小力量在具备条件时可能成长，并非无条件预言。' },
} as const;

const baseQuotes: QuoteDraft[] = [
  { id: 'investigation-01', ...base.investigation, text: '没有调查，没有发言权。', hint: '先了解事实，再形成判断。', todayMeaning: '文章开篇反对不了解实际、只凭主观印象发言。今天面对争论或决策，也可以先问一句：我掌握的事实够吗？' },
  { id: 'investigation-02', ...base.investigation, text: '一切结论产生于调查情况的末尾，而不是在它的先头。', hint: '让结论走在证据后面。', todayMeaning: '这句话讨论调查与结论的先后关系。它提醒我们，不要先选定答案，再只寻找支持答案的材料。' },
  { id: 'investigation-03', ...base.investigation, text: '调查就像“十月怀胎”，解决问题就像“一朝分娩”。调查就是解决问题。', hint: '扎实的准备，本身就是解决的一部分。', todayMeaning: '原文用怀胎与分娩比喻调查和解决问题。看似缓慢的深入了解，正在让答案逐渐成形。' },
  { id: 'investigation-04', ...base.investigation, text: '你完完全全调查明白了，你对那个问题就有解决的办法了。', hint: '遇到难题时，先把问题看清楚。', todayMeaning: '当问题无法解决时，文章主张回到它的现状与历史。与其空想一个妙招，不如补齐对问题本身的认识。' },
  { id: 'investigation-05', ...base.investigation, text: '马克思主义的“本本”是要学习的，但是必须同我国的实际情况相结合。', hint: '学习方法，也检验它与现实是否相合。', todayMeaning: '原文并不反对书本，而是反对脱离实际地使用书本。理论知识需要在具体情境中被理解和运用。' },
  { id: 'investigation-06', ...base.investigation, text: '怎样纠正这种本本主义？只有向实际情况作调查。', hint: '跳出固有答案，回到真实现场。', todayMeaning: '当既有经验成为束缚时，纠正它的办法不是换一套空话，而是重新接触实际情况。' },
  { id: 'investigation-07', ...base.investigation, text: '共产党的正确而不动摇的斗争策略，决不是少数人坐在房子里能够产生的，它是要在群众的斗争过程中才能产生的，这就是说要在实际经验中才能产生。', hint: '可靠的方案，往往生长在真实经验里。', todayMeaning: '这段话强调策略的实践来源。它反对把少数人的空想当成普遍答案，主张在共同实践中形成办法。' },
  { id: 'investigation-08', ...base.investigation, text: '我们需要时时了解社会情况，时时进行实际调查。', hint: '情况会变，了解也不能停在昨天。', todayMeaning: '调查不是一次性的仪式。环境持续变化，昨天的经验需要不断用今天的事实校准。' },
  { id: 'investigation-09', ...base.investigation, text: '深切地了解一处地方或者一个问题了。往后调查别处地方、别个问题，便容易找到门路了。', hint: '先把一个问题研究透，方法会留下来。', todayMeaning: '原文谈“要深入”。一次真正深入的调查，不只解决眼前问题，也会训练以后研究问题的方法。' },
  { id: 'investigation-10', ...base.investigation, text: '调查不但要自己当主席，适当地指挥调查会的到会人，而且要自己做记录，把调查的结果记下来。假手于人是不行的。', hint: '重要的事，亲自参与，也亲自整理。', todayMeaning: '这句话来自“调查的技术”。亲自记录会让人更直接地面对材料，也让模糊的印象变成可以复盘的依据。' },

  { id: 'practice-01', ...base.practice, text: '一切真知都是从直接经验发源的。', hint: '别只在脑海里推演，让现实给你答案。', todayMeaning: '原文讨论直接经验与间接经验。阅读能获得知识，而真正理解一件事，还需要与它接触、亲自实践。' },
  { id: 'practice-02', ...base.practice, text: '你要有知识，你就得参加变革现实的实践。', hint: '想学会，就走到事情里面去。', todayMeaning: '知识并非只来自旁观。参与改变现实的过程，才能接触现象、理解本质，并检验自己的认识。' },
  { id: 'practice-03', ...base.practice, text: '你要知道梨子的滋味，你就得变革梨子，亲口吃一吃。', hint: '有些答案，只能亲自试一次。', todayMeaning: '原文用“吃梨子”解释直接经验。别人的描述再细致，也不能替代你亲口尝到味道。' },
  { id: 'practice-04', ...base.practice, text: '理论的基础是实践，又转过来为实践服务。', hint: '从行动中总结，再把总结用于行动。', todayMeaning: '这句话说明理论与实践的双向关系。理论不是终点，它需要回到现实中帮助理解和改造现实。' },
  { id: 'practice-05', ...base.practice, text: '真理的标准只能是社会的实践。', hint: '判断一个想法，看它经不经得起现实检验。', todayMeaning: '原文把社会实践放在检验认识的位置。感觉“似乎正确”并不足够，还需要看实际结果。' },
  { id: 'practice-06', ...base.practice, text: '人们经过失败之后，也就从失败取得教训，改正自己的思想使之适合于外界的规律性，人们就能变失败为胜利。', hint: '失败带来的修正，可以成为下一次的起点。', todayMeaning: '失败不会自动带来成功，关键在于是否从中取得教训，并让下一步的行动更符合实际。' },
  { id: 'practice-07', ...base.practice, text: '所谓“失败者成功之母”，“吃一堑长一智”，就是这个道理。', hint: '把一次受挫，变成一次真正的长进。', todayMeaning: '这里承接从失败中学习的论述。重点不是赞美失败，而是强调反省与改正带来的成长。' },
  { id: 'practice-08', ...base.practice, text: '实践、认识、再实践、再认识，这种形式，循环往复以至无穷。', hint: '允许自己边做边懂，不必一次就想明白全部。', todayMeaning: '认识不是一次完成的直线。行动带来认识，新的认识又指导下一次行动，理解由此逐步加深。' },
  { id: 'practice-09', ...base.practice, text: '而实践和认识之每一循环的内容，都比较地进到了高一级的程度。', hint: '重复不等于原地踏步，每次都多一点理解。', todayMeaning: '这句话接在“实践、认识、再实践、再认识”之后。循环并非简单重复，而是在反馈中不断提高。' },
  { id: 'practice-10', ...base.practice, text: '无论何人要认识什么事物，除了同那个事物接触，即生活于（实践于）那个事物的环境中，是没有法子解决的。', hint: '靠近你想理解的事情，别只站在远处猜。', todayMeaning: '要认识一个事物，就要进入它所在的环境。原文反对脱离对象的空想，强调接触和实践。' },

  { id: 'contradiction-01', ...base.contradiction, text: '不同质的矛盾，只有用不同质的方法才能解决。', hint: '别拿同一把钥匙，去开所有的锁。', todayMeaning: '问题有不同的性质，解决方法也应有所区别。先辨认眼前问题的特点，再选择适合它的做法。' },
  { id: 'contradiction-02', ...base.contradiction, text: '过程变化，旧过程和旧矛盾消灭，新过程和新矛盾发生，解决矛盾的方法也因之而不同。', hint: '阶段变了，方法也要跟着更新。', todayMeaning: '过去有效的方法未必永远适用。当过程与问题已经改变，就需要重新审视手中的办法。' },
  { id: 'contradiction-03', ...base.contradiction, text: '用不同的方法去解决不同的矛盾，这是马克思列宁主义者必须严格地遵守的一个原则。', hint: '针对问题选择方法，而不是让方法限制问题。', todayMeaning: '原文批评把固定公式到处硬套。具体地分析具体情况，才能找到与问题相称的行动。' },
  { id: 'contradiction-04', ...base.contradiction, text: '研究任何过程，如果是存在两个以上矛盾的复杂过程的话，就要用全力去找出它的主要矛盾。', hint: '事情很复杂时，先找最关键的那一处。', todayMeaning: '复杂过程往往同时存在多个问题。找出起主要作用的矛盾，能让有限精力用在真正影响全局的地方。' },
  { id: 'contradiction-05', ...base.contradiction, text: '捉住了这个主要矛盾，一切问题就迎刃而解了。', hint: '抓住关键，许多纠缠才会开始松动。', todayMeaning: '这句话强调主要矛盾的作用。它不是忽略其他问题，而是先找到能够带动整体变化的着力点。' },
  { id: 'contradiction-06', ...base.contradiction, text: '一切客观事物本来是互相联系的和具有内部规律的。', hint: '把视线放宽一点，也往深处看一层。', todayMeaning: '原文反对片面、表面的观察。事物彼此联系，也有内部规律，理解它需要避免只看孤立的一角。' },
  { id: 'contradiction-07', ...base.contradiction, text: '外因是变化的条件，内因是变化的根据，外因通过内因而起作用。', hint: '环境很重要，自身如何回应同样重要。', todayMeaning: '原文用内外因解释事物变化。外部条件会产生影响，但这种影响还要通过事物内部的因素发挥作用。' },

  { id: 'strategy-01', ...base.strategy, text: '读书是学习，使用也是学习，而且是更重要的学习。', hint: '把学到的东西用一次，理解才会继续往前走。', todayMeaning: '原文谈“重要的问题在善于学习”。阅读是一种学习，把知识用于实际、从实际中再学习，同样不可缺少。' },
  { id: 'strategy-02', ...base.strategy, text: '常常不是先学好了再干，而是干起来再学习，干就是学习。', hint: '不必等到完全准备好，先开始一小步。', todayMeaning: '这句话并非轻视准备，而是指出许多能力只能在行动中获得。开始做事，也会打开新的学习过程。' },
  { id: 'strategy-03', ...base.strategy, text: '中国是一个大国——“东方不亮西方亮，黑了南方有北方”，不愁没有回旋的余地。', hint: '一处暂时走不通，不等于所有道路都关闭了。', todayMeaning: '原文用通俗语言说明回旋余地。面对局部受挫，可以转换视角，寻找新的空间与可能。' },
  { id: 'strategy-04', ...base.strategy, text: '一切战争指导规律，依照历史的发展而发展，依照战争的发展而发展；一成不变的东西是没有的。', hint: '尊重经验，也给变化留出位置。', todayMeaning: '原文讨论战争规律的发展性。经验值得学习，但不能被当成脱离时间、地点与条件的固定公式。' },

  { id: 'serve-01', ...base.serve, text: '我们的同志在困难的时候，要看到成绩，要看到光明，要提高我们的勇气。', hint: '困难值得正视，已经走过的路也值得看见。', todayMeaning: '这段话出现在共同奋斗遭遇困难的语境中。它提醒人们不因眼前艰难抹去已有成绩，也不失去继续行动的勇气。' },
  { id: 'serve-02', ...base.serve, text: '只要你说得对，我们就改正。你说的办法对人民有好处，我们就照你的办。', hint: '让正确的意见有力量，而不是让面子挡住改变。', todayMeaning: '原文谈如何面对批评。判断意见的标准是它对不对、是否有益，而不是它由谁提出。' },
  { id: 'serve-03', ...base.serve, text: '只要我们为人民的利益坚持好的，为人民的利益改正错的，我们这个队伍就一定会兴旺起来。', hint: '坚持值得坚持的，也保留改正自己的勇气。', todayMeaning: '坚持与改正并不矛盾。共同的目标既让人守住正确的东西，也让人愿意修正错误。' },
  { id: 'serve-04', ...base.serve, text: '我们都是来自五湖四海，为了一个共同的革命目标，走到一起来了。', hint: '不同的来处，也可以通向共同的方向。', todayMeaning: '这句话强调共同目标带来的团结。差异不必被抹去，人们仍可以围绕值得共同努力的事情同行。' },
  { id: 'serve-05', ...base.serve, text: '一切革命队伍的人都要互相关心，互相爱护，互相帮助。', hint: '认真做事，也认真照顾一起做事的人。', todayMeaning: '原文把共同奋斗具体化为彼此关心、爱护和帮助。集体的力量不仅来自目标，也来自日常的支持。' },

  { id: 'yugong-01', ...base.yugong, text: '下定决心，不怕牺牲，排除万难，去争取胜利。', hint: '确定值得去的方向，然后把困难一个个处理。', todayMeaning: '这是《愚公移山》中广为人知的一句。原文以愚公移山的故事表达坚定目标、持续奋斗的精神。' },
  { id: 'yugong-02', ...base.yugong, text: '这两座山虽然很高，却是不会再增高了，挖一点就会少一点，为什么挖不平呢？', hint: '大问题不再增长时，每一点推进都有意义。', todayMeaning: '愚公用“挖一点就会少一点”回应看似不可能的任务。宏大的目标，也可以被持续的行动逐渐改变。' },
  { id: 'yugong-03', ...base.yugong, text: '我们一定要坚持下去，一定要不断地工作，我们也会感动上帝的。', hint: '长期的事情，靠不断工作把可能变成现实。', todayMeaning: '原文借寓言中的“感动上帝”，强调坚持与持续行动。它所说的并非被动等待奇迹，而是一天一天地挖山。' },
  { id: 'spark-01', ...base.spark, text: '星星之火，可以燎原。', hint: '别轻视一个足够小、却真实存在的开始。', todayMeaning: '文章在困难与悲观的语境中分析发展的可能。微小的力量并不等于永远微小，关键在于它是否具有成长条件。' },
];

export const quotes: Quote[] = [
  ...baseQuotes.map(completeQuote),
  ...additionalQuotes,
  ...volumeFiveQuotes,
].map(applyQuotePreferences);

export const quoteById = new Map(quotes.map((quote) => [quote.id, quote]));
