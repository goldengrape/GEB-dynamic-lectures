export enum ChapterId {
  INTRO = 'INTRO',
  EMERGENCE = 'EMERGENCE',
  ISOMORPHISM = 'ISOMORPHISM',
  RECURSION_BASICS = 'RECURSION_BASICS',
  FORMAL_SYSTEMS = 'FORMAL_SYSTEMS',
  META_THINKING = 'META_THINKING',
  
  // Lecture 2
  STACK_TREE = 'STACK_TREE',
  KOCH = 'KOCH',
  CHAOS = 'CHAOS',
  MANDELBROT = 'MANDELBROT',

  // Lecture 3
  GEOMETRY_MODELS = 'GEOMETRY_MODELS',
  ZENO_PARADOX = 'ZENO_PARADOX',
  GODEL_NUMBERING = 'GODEL_NUMBERING',
  CONSISTENCY_COMPLETENESS = 'CONSISTENCY_COMPLETENESS'
}

export interface Chapter {
  id: ChapterId;
  title: string;
  subtitle: string;
  description: string;
  lecture: string; // Grouping identifier
}

export const CHAPTERS: Chapter[] = [
  // LECTURE 1
  {
    id: ChapterId.INTRO,
    title: "简介",
    subtitle: "哥德尔、埃舍尔、巴赫",
    description: "探索无意义的元素如何结合创造意义、自指和意识。",
    lecture: "课程一：GEB 核心概念"
  },
  {
    id: ChapterId.EMERGENCE,
    title: "涌现",
    subtitle: "自我如何从非我中产生",
    description: "无意义的物理实体（原子、神经元）如何结合形成一个能说“我”的“自我”？",
    lecture: "课程一：GEB 核心概念"
  },
  {
    id: ChapterId.ISOMORPHISM,
    title: "同构",
    subtitle: "映射意义",
    description: "在两个不同系统之间保留结构。PQ系统将无意义的符号映射为算术真理。",
    lecture: "课程一：GEB 核心概念"
  },
  {
    id: ChapterId.RECURSION_BASICS,
    title: "递归 (基础)",
    subtitle: "由自身定义自身",
    description: "一个根据自身定义的过程。从巴赫的赋格曲到几何分形。",
    lecture: "课程一：GEB 核心概念"
  },
  {
    id: ChapterId.FORMAL_SYSTEMS,
    title: "形式系统",
    subtitle: "MU 谜题",
    description: "仅使用四条严格规则，你能从“MI”开始得到“MU”吗？关于系统和公理的一课。",
    lecture: "课程一：GEB 核心概念"
  },
  {
    id: ChapterId.META_THINKING,
    title: "元思维",
    subtitle: "跳出系统",
    description: "当一个系统陷入循环或失败时，智能需要跳出系统从外部进行观察。",
    lecture: "课程一：GEB 核心概念"
  },

  // LECTURE 2
  {
    id: ChapterId.STACK_TREE,
    title: "递归树与堆栈",
    subtitle: "Push & Pop",
    description: "为了防止无限循环，递归必须“触底”。计算机使用“堆栈”来记住它在嵌套结构中的位置。",
    lecture: "课程二：递归与分形"
  },
  {
    id: ChapterId.KOCH,
    title: "科赫曲线",
    subtitle: "无限周长，有限面积",
    description: "通过在每条线段中间添加三角形，无论放大多少倍，形状都保持一致。",
    lecture: "课程二：递归与分形"
  },
  {
    id: ChapterId.CHAOS,
    title: "混沌游戏",
    subtitle: "随机性中的秩序",
    description: "谢尔宾斯基三角形不仅可以通过确定性的递归移除中心产生，也可以通过随机性产生。",
    lecture: "课程二：递归与分形"
  },
  {
    id: ChapterId.MANDELBROT,
    title: "曼德博集合",
    subtitle: "复平面上的递归",
    description: "定义在复平面上的简单迭代 z = z² + c，展现出极其复杂的边界。",
    lecture: "课程二：递归与分形"
  },

  // LECTURE 3
  {
    id: ChapterId.CONSISTENCY_COMPLETENESS,
    title: "一致性与完全性",
    subtitle: "完美的梦想",
    description: "一致性意味着没有矛盾，完全性意味着所有真理皆可证明。哥德尔证明了我们不能同时拥有两者。",
    lecture: "课程三：一致性与不完全性"
  },
  {
    id: ChapterId.GEOMETRY_MODELS,
    title: "非欧几何",
    subtitle: "解释的力量",
    description: "如果在球面上定义“直线”，三角形内角和还是180度吗？真理取决于形式系统的“解释”。",
    lecture: "课程三：一致性与不完全性"
  },
  {
    id: ChapterId.ZENO_PARADOX,
    title: "芝诺与无穷",
    subtitle: "有限时间的无限步骤",
    description: "阿基里斯如何追上乌龟？几何级数展示了无限个步骤如何在有限时间内完成。",
    lecture: "课程三：一致性与不完全性"
  },
  {
    id: ChapterId.GODEL_NUMBERING,
    title: "哥德尔配数",
    subtitle: "系统内的内省",
    description: "如何让数学谈论数学本身？通过将符号转化为数字，哥德尔构建了一个可以指代自身的悖论。",
    lecture: "课程三：一致性与不完全性"
  }
];