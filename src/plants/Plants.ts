import dayjs from "dayjs";

export type PlantsParams = {
  name: string;
  iconName?: string;
  both_time: number;
  growth_cycle: number;
  price: number;
  basic_output: number;
};

export enum PlantStatus {
  NOT_GERMINATED, // 未发芽
  GERMINATING, // 发芽
  MATURE, // 成熟
  DEATH, // 死亡
}

export class Plants {
  name: string;
  iconName: string | undefined;
  both_time: number;
  growth_cycle: number;
  price: number;
  status: PlantStatus | undefined;
  output: number;

  constructor(params: PlantsParams) {
    this.name = params.name;
    this.iconName = params.iconName;
    this.both_time = params.both_time;
    this.growth_cycle = params.growth_cycle;
    this.price = params.price;
    this.output = params.basic_output;

    this.initPlantStatus();
    this.initPlantsOutput();
  }

  private initPlantStatus() {
    // 当前时间 - 出生时间 / 周期 取整
    const growthIndex = Math.floor((dayjs().unix() - this.both_time) / this.growth_cycle);
    this.status = growthIndex > PlantStatus.DEATH ? PlantStatus.DEATH : growthIndex;
  }

  private initPlantsOutput() {
    // 实际产量 = 基础产量 * 土地等级
  }

  private getRandomSeeds() {
    return Math.floor(Math.random() * 4 + 2);
  }

  // 获取当前植物的状态
  getPlantsStataus() {
    this.initPlantStatus();
    return this.status;
  }

  // 使用化肥
  useFertilizer() {}

  // 收获植物
  harvest() {
    // 当前是未发芽状态或者是发芽状态
    if (this.status === PlantStatus.NOT_GERMINATED || this.status === PlantStatus.GERMINATING) {
      console.log("植物未成熟，暂时无法收获");
      return;
    }

    // 当前是成熟状态
    if (this.status === PlantStatus.MATURE) {
      const output = this.output;
      // 随机产出2-5个种子
      const seeds = this.getRandomSeeds();
      return { output, seeds };
    }

    // 死亡状态
    if (this.status === PlantStatus.DEATH) {
      const seeds = this.getRandomSeeds();
      return { seeds };
    }
  }

  // 出售植物
  sell() {}
}
