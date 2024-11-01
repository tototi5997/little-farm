export type SellSeed = {
  key: string; // 对应 type
  name: string;
  price: number;
  icon_name: string;
  growth_cycle: number; // 秒级
  need_solid_grade: number;
  basic_output: number;
};

export const seeds_sell: SellSeed[] = [
  {
    name: "白菜种子",
    key: "cabbage",
    price: 0,
    icon_name: "icon-cabbage",
    growth_cycle: 10,
    need_solid_grade: 1,
    basic_output: 10,
  },
  {
    name: "土豆种子",
    key: "potato",
    price: 10,
    icon_name: "icon-potato",
    growth_cycle: 10,
    need_solid_grade: 1,
    basic_output: 10,
  },
  {
    name: "小麦种子",
    key: "wheat",
    price: 12,
    icon_name: "icon-wheat",
    growth_cycle: 10,
    need_solid_grade: 1,
    basic_output: 10,
  },
  // {
  //   name: "黄瓜种子",
  //   key: "cucumber",
  //   price: 15,
  //   icon_name: "icon-cucumber",
  //   growth_cycle: 10,
  //   need_solid_grade: 2,
  //   basic_output: 10,
  // },
  // {
  //   name: "玉米种子",
  //   key: "corn",
  //   price: 20,
  //   icon_name: "icon-corn",
  //   growth_cycle: 10,
  //   need_solid_grade: 3,
  //   basic_output: 10,
  // },
  // {
  //   name: "西瓜种子",
  //   key: "watermelon",
  //   price: 20,
  //   icon_name: "icon-melon",
  //   growth_cycle: 10,
  //   need_solid_grade: 3,
  //   basic_output: 10,
  // },
  // {
  //   name: "香蕉种子",
  //   key: "banana",
  //   price: 20,
  //   icon_name: "icon-banana",
  //   growth_cycle: 10,
  //   need_solid_grade: 3,
  //   basic_output: 10,
  // },
];

// 开拓土壤花费
export const soil_develop_cost = [0, 0, 100, 200, 300, 300, 300, 300, 400, 400, 400, 400, 500, 500, 500, 500];

// 升级土地花费
export const soil_upgrade_cost = [0, 500, 500, 500, 1000, 1000, 1000, 1000, 2000, 2000, 2000, 2000, 4000, 4000, 4000];
