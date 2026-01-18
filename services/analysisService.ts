import { AIAnalysis } from "../types";

// Static database of MBTI types
const MBTI_DATA: Record<string, AIAnalysis> = {
  "INTJ": {
    title: "建筑师 (Architect)",
    summary: "富有想象力和战略性的思想家，一切皆在计划之中。你追求完美，对知识有无穷的渴望。",
    keyTraits: ["理性清晰", "意志坚定", "好奇心强", "不仅能看到细节，更能看到全局"],
    recommendations: ["尝试对他人表达更多耐心", "不要过度分析情感问题", "适合职业：系统架构师、战略策划", "适合职业：科学家、投资银行家"],
    detailedAnalysis: "弱点：过于傲慢、忽视他人情感、对规则过于挑剔。在关系中：你寻找的是智力上的伴侣。在感情中你可能显得冷漠，但一旦认定，你会非常忠诚。代表人物：Elon Musk, Nietzsche, Michelle Obama"
  },
  "INTP": {
    title: "逻辑学家 (Logician)",
    summary: "具有创造力的发明家，对知识有无法抑制的渴望。你总是能从独特的角度看问题。",
    keyTraits: ["分析能力强", "原创性", "思想开放", "客观公正"],
    recommendations: ["尝试更多社交活动", "学习处理日常琐事", "适合职业：程序员、教授", "适合职业：数学家、法医"],
    detailedAnalysis: "弱点：离群索居、对迟钝的人不耐烦、经常自我怀疑。在关系中：你需要很大的个人空间。你喜欢直率的沟通，不擅长猜测对方的心思。代表人物：Bill Gates, Albert Einstein, Isaac Newton"
  },
  "ENTJ": {
    title: "指挥官 (Commander)",
    summary: "大胆、富有想象力且意志强大的领导者，总能找到或创造解决方法。",
    keyTraits: ["效率高", "充满活力", "自信", "意志力强"],
    recommendations: ["练习倾听他人的意见", "培养同理心", "适合职业：CEO、管理顾问", "适合职业：律师、创业者"],
    detailedAnalysis: "弱点：固执己见、不宽容、傲慢。在关系中：你在关系中也是主导者。你需要一个能跟上你节奏，并且足够自信的伴侣。代表人物：Steve Jobs, Gordon Ramsay, Margaret Thatcher"
  },
  "ENTP": {
    title: "辩论家 (Debater)",
    summary: "聪明好奇的思想者，这种人无法抵挡智力挑战的诱惑。你喜欢打破常规。",
    keyTraits: ["知识丰富", "思维敏捷", "善于头脑风暴", "精力充沛"],
    recommendations: ["学习专注完成一件事", "注意不要无意伤害他人", "适合职业：企业家、政客", "适合职业：创意总监、市场营销"],
    detailedAnalysis: "弱点：好争辩、难以集中注意力、不喜欢实际事务。在关系中：与你在一起永远不会无聊。你喜欢通过辩论来增进感情，但这可能会让伴侣感到疲惫。代表人物：Mark Twain, Tom Hanks, Thomas Edison"
  },
  "INFJ": {
    title: "提倡者 (Advocate)",
    summary: "安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。你是最稀有的性格类型。",
    keyTraits: ["富有创意", "洞察力强", "有原则", "充满激情"],
    recommendations: ["注意避免过度劳累", "接受世界的不完美", "适合职业：心理咨询师、作家", "适合职业：HR、非营利组织领导"],
    detailedAnalysis: "弱点：对批评敏感、极其完美主义、容易燃尽。在关系中：你渴望深层的灵魂连接。你对伴侣非常体贴，但很难有人能真正走进你的内心。代表人物：Martin Luther King, Nelson Mandela, Mother Teresa"
  },
  "INFP": {
    title: "调停者 (Mediator)",
    summary: "诗意，善良的利他主义者，总是热情地为正当理由提供帮助。",
    keyTraits: ["同理心强", "慷慨大方", "思想开放", "富有创造力"],
    recommendations: ["脚踏实地关注现实", "学会拒绝他人", "适合职业：艺术家、心理学家", "适合职业：编辑、社会工作者"],
    detailedAnalysis: "弱点：过于理想化、过于利他、不切实际。在关系中：你是无可救药的浪漫主义者。你倾向于把伴侣理想化，这可能导致现实中的失望。代表人物：J.R.R. Tolkien, Julia Roberts, William Shakespeare"
  },
  "ENFJ": {
    title: "主人公 (Protagonist)",
    summary: "富有魅力，鼓舞人心的领导者，有能力让听众为之着迷。你真诚地关心他人。",
    keyTraits: ["宽容", "可靠", "有领袖魅力", "利他主义"],
    recommendations: ["不要过度牺牲自己", "建立健康的边界", "适合职业：教师、销售经理", "适合职业：公关、活动策划"],
    detailedAnalysis: "弱点：过于理想化、太敏感、缺乏自尊。在关系中：你非常投入且忠诚。你有时会过度付出，甚至为了和谐而牺牲自己的需求。代表人物：Barack Obama, Oprah Winfrey, Jennifer Lawrence"
  },
  "ENFP": {
    title: "竞选者 (Campaigner)",
    summary: "热情，有创造力，爱社交的自由精神，总能找到理由微笑。",
    keyTraits: ["好奇心强", "观察力敏锐", "充满激情", "优秀的沟通者"],
    recommendations: ["提高专注力", "控制情绪波动", "适合职业：记者、演员", "适合职业：导游、咨询师"],
    detailedAnalysis: "弱点：思维涣散、容易情绪化、过度思考。在关系中：你热情奔放，喜欢探索。你需要一个能欣赏你疯狂想法，同时能给你安全感的伴侣。代表人物：Robert Downey Jr., Will Smith, Robin Williams"
  },
  "ISTJ": {
    title: "物流师 (Logistician)",
    summary: "事实求是，注重实效，可靠性不容怀疑。你是社会的基石。",
    keyTraits: ["诚实直率", "意志坚定", "尽忠职守", "非常负责"],
    recommendations: ["尝试接受新事物", "多表达情感", "适合职业：会计、军官", "适合职业：法官、数据分析师"],
    detailedAnalysis: "弱点：固执、不敏感、总是照章办事。在关系中：你表达爱的方式是行动而非言语。你非常忠诚，但也希望伴侣能遵循承诺。代表人物：Angela Merkel, George Washington, Natalie Portman"
  },
  "ISFJ": {
    title: "守卫者 (Defender)",
    summary: "非常专注而温暖的守护者，时刻准备着保护爱的人。你非常细心。",
    keyTraits: ["支持他人", "可靠耐心", "观察力强", "勤奋"],
    recommendations: ["学会表达自己的需求", "不要压抑情感", "适合职业：护士、小学老师", "适合职业：行政助理、室内设计"],
    detailedAnalysis: "弱点：过于谦虚、把事情太当真、压抑情感。在关系中：你把家庭放在第一位。你非常体贴，但需要伴侣能够主动察觉你的需求。代表人物：Queen Elizabeth II, Beyoncé, Vin Diesel"
  },
  "ESTJ": {
    title: "总经理 (Executive)",
    summary: "出色的管理者，在管理事情或人的方面无与伦比。你代表了传统和秩序。",
    keyTraits: ["专注奉献", "意志坚定", "诚实直接", "建立秩序"],
    recommendations: ["练习放松", "尊重非传统的观点", "适合职业：酒店经理、警官", "适合职业：财务总监、项目经理"],
    detailedAnalysis: "弱点：不灵活、不舒服 unconventional、爱通过地位看人。在关系中：你喜欢稳定和传统的家庭结构。你可能不擅长表达情感，但你会努力保护伴侣。代表人物：John D. Rockefeller, Judge Judy, Frank Sinatra"
  },
  "ESFJ": {
    title: "执政官 (Consul)",
    summary: "极有同情心，爱社交，受欢迎的人，总是热心提供帮助。",
    keyTraits: ["实践能力强", "责任感强", "非常忠诚", "敏感温暖"],
    recommendations: ["减少对外界评价的依赖", "勇于创新", "适合职业：行政管理、公关", "适合职业：医疗护理、幼师"],
    detailedAnalysis: "弱点：担心社会地位、缺乏弹性、不愿意创新。在关系中：你非常重视伴侣的感受和社会认可。你需要大量的肯定和赞赏。代表人物：Taylor Swift, Bill Clinton, Jennifer Lopez"
  },
  "ISTP": {
    title: "鉴赏家 (Virtuoso)",
    summary: "大胆而实际的实验家，擅长使用各种工具。你是天生的问题解决者。",
    keyTraits: ["乐观充满活力", "富有创造力", "随性理性", "懂得轻重缓急"],
    recommendations: ["学习长期规划", "多与人沟通", "适合职业：机械师、工程师", "适合职业：飞行员、急诊室医生"],
    detailedAnalysis: "弱点：固执、迟钝、私密且孤僻。在关系中：你需要很大的自由空间。你不是那种每天说“我爱你”的人，但你会修好家里的水管。代表人物：Clint Eastwood, Tom Cruise, Michael Jordan"
  },
  "ISFP": {
    title: "探险家 (Adventurer)",
    summary: "灵活有魅力的艺术家，时刻准备着探索和体验新鲜事物。",
    keyTraits: ["迷人", "对他人敏感", "想象力丰富", "充满激情"],
    recommendations: ["建立自信", "学习应对压力", "适合职业：时装设计师、音乐家", "适合职业：摄影师、护林员"],
    detailedAnalysis: "弱点：极度独立、不可预测、容易有压力。在关系中：你神秘而感性。你不会强迫伴侣，也希望伴侣不要控制你。代表人物：Michael Jackson, Britney Spears, Frida Kahlo"
  },
  "ESTP": {
    title: "企业家 (Entrepreneur)",
    summary: "聪明，精力充沛，善于感知的人，真心享受生活在边缘。",
    keyTraits: ["大胆", "理性", "原创", "直接"],
    recommendations: ["培养耐心", "考虑长远后果", "适合职业：股票经纪人、销售", "适合职业：消防员、谈判专家"],
    detailedAnalysis: "弱点：不耐烦、冒险倾向、缺乏大局观。在关系中：你喜欢活在当下。你充满激情，但可能难以做出长期的承诺。代表人物：Donald Trump, Madonna, Ernest Hemingway"
  },
  "ESFP": {
    title: "表演者 (Entertainer)",
    summary: "自发的，精力充沛而热情的表演者，生活在他们周围永远不会无聊。",
    keyTraits: ["大胆", "原创", "美感极佳", "观察力强"],
    recommendations: ["制定长期计划", "正视冲突", "适合职业：活动策划、导游", "适合职业：销售代表、演员"],
    detailedAnalysis: "弱点：敏感、冲突回避、容易无聊。在关系中：你是派对的灵魂。你慷慨大方，但需要伴侣帮你保持理智和规划。代表人物：Marilyn Monroe, Adele, Elton John"
  }
};

export const getLocalMBTIAnalysis = (mbtiType: string): AIAnalysis => {
  const data = MBTI_DATA[mbtiType];
  
  if (data) {
    return data;
  }

  // Fallback (should theoretically never happen if logic is correct)
  return {
    title: `${mbtiType} - 未知类型`,
    summary: "系统无法找到该类型的详细描述。",
    keyTraits: ["N/A"],
    recommendations: ["N/A"],
    detailedAnalysis: "N/A"
  };
};
