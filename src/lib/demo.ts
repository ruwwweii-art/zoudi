export const DEMO_MODE = process.env.DEMO_MODE !== "false";

export const demoStats = [
  { label: "演示路线", value: "12" },
  { label: "覆盖场景", value: "约会 / 遛娃 / Citywalk" },
  { label: "AI 模型", value: "qwen3-max-2026-01-23" },
];

export const demoRoutes = [
  {
    id: "demo-west-lake-date",
    scene: "约会",
    title: "西湖日落慢约会",
    subtitle: "咖啡、散步、晚霞和一顿不赶时间的晚饭",
    duration: "半日",
    budget: "人均 120-180",
    tags: ["轻松", "好拍", "低决策成本"],
    highlights: [
      "从湖滨步行到长桥，路线简单不绕路",
      "雨天可替换为美术馆 + 商场晚餐",
      "适合第一次约会，不会太用力",
    ],
  },
  {
    id: "demo-kids-museum",
    scene: "遛娃",
    title: "自然博物馆半日躲雨线",
    subtitle: "室内为主，休息点明确，适合周末带娃放电",
    duration: "半日",
    budget: "家庭 80-150",
    tags: ["室内", "下雨可用", "推车友好"],
    highlights: [
      "中间安排固定休息点，家长不容易崩",
      "补了餐食和厕所提醒，方便现场执行",
      "适合 4-8 岁孩子，对低龄也有备注",
    ],
  },
  {
    id: "demo-citywalk-old-street",
    scene: "Citywalk",
    title: "老街早午餐散步线",
    subtitle: "从早餐铺到旧书店，适合一个人或朋友周末闲逛",
    duration: "短途",
    budget: "人均 60-100",
    tags: ["松弛", "步行", "周末友好"],
    highlights: [
      "每一站停留时间都比较克制",
      "适合临时起意，不需要提前太多准备",
      "可以直接延伸成拍照或探店路线",
    ],
  },
];
