import { AIAnalysis } from "../types";

// Static database of MBTI types
const MBTI_DATA: Record<string, AIAnalysis> = {
  "INTJ": {
    title: "建筑师 (Architect)",
    shortDescription: "富有想象力和战略性的思想家，一切皆在计划之中。你追求完美，对知识有无穷的渴望。",
    strengths: ["理性清晰", "意志坚定", "好奇心强", "不仅能看到细节，更能看到全局"],
    weaknesses: ["过于傲慢", "忽视他人情感", "对规则过于挑剔", "容易过度分析"],
    careerPaths: ["系统架构师", "战略策划", "科学家", "投资银行家"],
    relationships: "你寻找的是智力上的伴侣。在感情中你可能显得冷漠，但一旦认定，你会非常忠诚。",
    famousPeople: ["Elon Musk", "Nietzsche", "Michelle Obama"]
  },
  "INTP": {
    title: "逻辑学家 (Logician)",
    shortDescription: "具有创造力的发明家，对知识有无法抑制的渴望。你总是能从独特的角度看问题。",
    strengths: ["分析能力强", "原创性", "思想开放", "客观公正"],
    weaknesses: ["离群索居", "对迟钝的人不耐烦", "经常自我怀疑", "情感迟钝"],
    careerPaths: ["程序员", "教授", "数学家", "法医"],
    relationships: "你需要很大的个人空间。你喜欢直率的沟通，不擅长猜测对方的心思。",
    famousPeople: ["Bill Gates", "Albert Einstein", "Isaac Newton"]
  },
  "ENTJ": {
    title: "指挥官 (Commander)",
    shortDescription: "大胆、富有想象力且意志强大的领导者，总能找到或创造解决方法。",
    strengths: ["效率高", "充满活力", "自信", "意志力强"],
    weaknesses: ["固执己见", "不宽容", "傲慢", "处理情感问题笨拙"],
    careerPaths: ["CEO", "管理顾问", "律师", "创业者"],
    relationships: "你在关系中也是主导者。你需要一个能跟上你节奏，并且足够自信的伴侣。",
    famousPeople: ["Steve Jobs", "Gordon Ramsay", "Margaret Thatcher"]
  },
  "ENTP": {
    title: "辩论家 (Debater)",
    shortDescription: "聪明好奇的思想者，这种人无法抵挡智力挑战的诱惑。你喜欢打破常规。",
    strengths: ["知识丰富", "思维敏捷", "善于头脑风暴", "精力充沛"],
    weaknesses: ["好争辩", "难以集中注意力", "不喜欢实际事务", "可能忽视他人感受"],
    careerPaths: ["企业家", "政客", "创意总监", "市场营销"],
    relationships: "与你在一起永远不会无聊。你喜欢通过辩论来增进感情，但这可能会让伴侣感到疲惫。",
    famousPeople: ["Mark Twain", "Tom Hanks", "Thomas Edison"]
  },
  "INFJ": {
    title: "提倡者 (Advocate)",
    shortDescription: "安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。你是最稀有的性格类型。",
    strengths: ["富有创意", "洞察力强", "有原则", "充满激情"],
    weaknesses: ["对批评敏感", "极其完美主义", "容易燃尽", "过于私密"],
    careerPaths: ["心理咨询师", "作家", "HR", "非营利组织领导"],
    relationships: "你渴望深层的灵魂连接。你对伴侣非常体贴，但很难有人能真正走进你的内心。",
    famousPeople: ["Martin Luther King", "Nelson Mandela", "Mother Teresa"]
  },
  "INFP": {
    title: "调停者 (Mediator)",
    shortDescription: "诗意，善良的利他主义者，总是热情地为正当理由提供帮助。",
    strengths: ["同理心强", "慷慨大方", "思想开放", "富有创造力"],
    weaknesses: ["过于理想化", "过于利他", "不切实际", "难以处理数据"],
    careerPaths: ["艺术家", "心理学家", "编辑", "社会工作者"],
    relationships: "你是无可救药的浪漫主义者。你倾向于把伴侣理想化，这可能导致现实中的失望。",
    famousPeople: ["J.R.R. Tolkien", "Julia Roberts", "William Shakespeare"]
  },
  "ENFJ": {
    title: "主人公 (Protagonist)",
    shortDescription: "富有魅力，鼓舞人心的领导者，有能力让听众为之着迷。你真诚地关心他人。",
    strengths: ["宽容", "可靠", "有领袖魅力", "利他主义"],
    weaknesses: ["过于理想化", "太敏感", "缺乏自尊", "难以做艰难决定"],
    careerPaths: ["教师", "销售经理", "公关", "活动策划"],
    relationships: "你非常投入且忠诚。你有时会过度付出，甚至为了和谐而牺牲自己的需求。",
    famousPeople: ["Barack Obama", "Oprah Winfrey", "Jennifer Lawrence"]
  },
  "ENFP": {
    title: "竞选者 (Campaigner)",
    shortDescription: "热情，有创造力，爱社交的自由精神，总能找到理由微笑。",
    strengths: ["好奇心强", "观察力敏锐", "充满激情", "优秀的沟通者"],
    weaknesses: ["思维涣散", "容易情绪化", "过度思考", "容易感到压力"],
    careerPaths: ["记者", "演员", "导游", "咨询师"],
    relationships: "你热情奔放，喜欢探索。你需要一个能欣赏你疯狂想法，同时能给你安全感的伴侣。",
    famousPeople: ["Robert Downey Jr.", "Will Smith", "Robin Williams"]
  },
  "ISTJ": {
    title: "物流师 (Logistician)",
    shortDescription: "事实求是，注重实效，可靠性不容怀疑。你是社会的基石。",
    strengths: ["诚实直率", "意志坚定", "尽忠职守", "非常负责"],
    weaknesses: ["固执", "不敏感", "总是照章办事", "自责"],
    careerPaths: ["会计", "军官", "法官", "数据分析师"],
    relationships: "你表达爱的方式是行动而非言语。你非常忠诚，但也希望伴侣能遵循承诺。",
    famousPeople: ["Angela Merkel", "George Washington", "Natalie Portman"]
  },
  "ISFJ": {
    title: "守卫者 (Defender)",
    shortDescription: "非常专注而温暖的守护者，时刻准备着保护爱的人。你非常细心。",
    strengths: ["支持他人", "可靠耐心", "观察力强", "勤奋"],
    weaknesses: ["过于谦虚", "把事情太当真", "压抑情感", "抗拒改变"],
    careerPaths: ["护士", "小学老师", "行政助理", "室内设计"],
    relationships: "你把家庭放在第一位。你非常体贴，但需要伴侣能够主动察觉你的需求。",
    famousPeople: ["Queen Elizabeth II", "Beyoncé", "Vin Diesel"]
  },
  "ESTJ": {
    title: "总经理 (Executive)",
    shortDescription: "出色的管理者，在管理事情或人的方面无与伦比。你代表了传统和秩序。",
    strengths: ["专注奉献", "意志坚定", "诚实直接", "建立秩序"],
    weaknesses: ["不灵活", "不舒服 unconventional", "爱通过地位看人", "难以放松"],
    careerPaths: ["酒店经理", "警官", "财务总监", "项目经理"],
    relationships: "你喜欢稳定和传统的家庭结构。你可能不擅长表达情感，但你会努力保护伴侣。",
    famousPeople: ["John D. Rockefeller", "Judge Judy", "Frank Sinatra"]
  },
  "ESFJ": {
    title: "执政官 (Consul)",
    shortDescription: "极有同情心，爱社交，受欢迎的人，总是热心提供帮助。",
    strengths: ["实践能力强", "责任感强", "非常忠诚", "敏感温暖"],
    weaknesses: ["担心社会地位", "缺乏弹性", "不愿意创新", "容易受批评影响"],
    careerPaths: ["行政管理", "公关", "医疗护理", "幼师"],
    relationships: "你非常重视伴侣的感受和社会认可。你需要大量的肯定和赞赏。",
    famousPeople: ["Taylor Swift", "Bill Clinton", "Jennifer Lopez"]
  },
  "ISTP": {
    title: "鉴赏家 (Virtuoso)",
    shortDescription: "大胆而实际的实验家，擅长使用各种工具。你是天生的问题解决者。",
    strengths: ["乐观充满活力", "富有创造力", "随性理性", "懂得轻重缓急"],
    weaknesses: ["固执", "迟钝", "私密且孤僻", "容易厌倦"],
    careerPaths: ["机械师", "工程师", "飞行员", "急诊室医生"],
    relationships: "你需要很大的自由空间。你不是那种每天说“我爱你”的人，但你会修好家里的水管。",
    famousPeople: ["Clint Eastwood", "Tom Cruise", "Michael Jordan"]
  },
  "ISFP": {
    title: "探险家 (Adventurer)",
    shortDescription: "灵活有魅力的艺术家，时刻准备着探索和体验新鲜事物。",
    strengths: ["迷人", "对他人敏感", "想象力丰富", "充满激情"],
    weaknesses: ["极度独立", "不可预测", "容易有压力", "过度竞争"],
    careerPaths: ["时装设计师", "音乐家", "摄影师", "护林员"],
    relationships: "你神秘而感性。你不会强迫伴侣，也希望伴侣不要控制你。",
    famousPeople: ["Michael Jackson", "Britney Spears", "Frida Kahlo"]
  },
  "ESTP": {
    title: "企业家 (Entrepreneur)",
    shortDescription: "聪明，精力充沛，善于感知的人，真心享受生活在边缘。",
    strengths: ["大胆", "理性", "原创", "直接"],
    weaknesses: ["不耐烦", "冒险倾向", "缺乏大局观", "无视规则"],
    careerPaths: ["股票经纪人", "销售", "消防员", "谈判专家"],
    relationships: "你喜欢活在当下。你充满激情，但可能难以做出长期的承诺。",
    famousPeople: ["Donald Trump", "Madonna", "Ernest Hemingway"]
  },
  "ESFP": {
    title: "表演者 (Entertainer)",
    shortDescription: "自发的，精力充沛而热情的表演者，生活在他们周围永远不会无聊。",
    strengths: ["大胆", "原创", "美感极佳", "观察力强"],
    weaknesses: ["敏感", "冲突回避", "容易无聊", "缺乏长期规划"],
    careerPaths: ["活动策划", "导游", "销售代表", "演员"],
    relationships: "你是派对的灵魂。你慷慨大方，但需要伴侣帮你保持理智和规划。",
    famousPeople: ["Marilyn Monroe", "Adele", "Elton John"]
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
    shortDescription: "系统无法找到该类型的详细描述。",
    strengths: ["N/A"],
    weaknesses: ["N/A"],
    careerPaths: ["N/A"],
    relationships: "N/A",
    famousPeople: ["N/A"]
  };
};