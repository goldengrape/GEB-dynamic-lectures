export enum ChapterId {
  INTRO = 'INTRO',
  EMERGENCE = 'EMERGENCE',
  ISOMORPHISM = 'ISOMORPHISM',
  RECURSION = 'RECURSION',
  LECTURE_2 = 'LECTURE_2',
  FORMAL_SYSTEMS = 'FORMAL_SYSTEMS',
  META_THINKING = 'META_THINKING',
}

export interface Chapter {
  id: ChapterId;
  title: string;
  subtitle: string;
  description: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: ChapterId.INTRO,
    title: "简介",
    subtitle: "哥德尔、埃舍尔、巴赫",
    description: "探索无意义的元素如何结合创造意义、自指和意识。"
  },
  {
    id: ChapterId.EMERGENCE,
    title: "涌现",
    subtitle: "自我如何从非我中产生",
    description: "无意义的物理实体（原子、神经元）如何结合形成一个能说“我”的“自我”？"
  },
  {
    id: ChapterId.ISOMORPHISM,
    title: "同构",
    subtitle: "映射意义",
    description: "在两个不同系统之间保留结构。PQ系统将无意义的符号映射为算术真理。"
  },
  {
    id: ChapterId.RECURSION,
    title: "递归",
    subtitle: "由自身定义自身",
    description: "一个根据自身定义的过程。从巴赫的赋格曲到几何分形。"
  },
  {
    id: ChapterId.LECTURE_2,
    title: "第二课：递归与分形",
    subtitle: "推入、弹出与无限",
    description: "深入递归的机制。通过“堆栈”管理无限的自相似结构（如分形树和科赫曲线）。"
  },
  {
    id: ChapterId.FORMAL_SYSTEMS,
    title: "形式系统",
    subtitle: "MU 谜题",
    description: "仅使用四条严格规则，你能从“MI”开始得到“MU”吗？关于系统和公理的一课。"
  },
  {
    id: ChapterId.META_THINKING,
    title: "元思维",
    subtitle: "跳出系统",
    description: "当一个系统陷入循环或失败时，智能需要跳出系统从外部进行观察。"
  }
];