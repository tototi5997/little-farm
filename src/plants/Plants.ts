import dayjs from "dayjs";
import Cabbage from "./Cabbage";

export type PlantsParams = {
  name: string;
  icon_name?: string;
  both_time: number;
  growth_cycle: number;
  need_solid_grade: number;
  current_solid_grade: number;
  basic_output: number;
};

export type ChildPlantsParams = {
  both_time: number;
  current_solid_grade: number;
};

export type PlantsConfig = {
  name: string;
  type: string;
  both_time: number;
  current_solid_grade: number;
};

export enum PlantStatus {
  NOT_GERMINATED, // 未发芽
  GERMINATING, // 发芽
  MATURE, // 成熟
  DEATH, // 枯萎
}

export abstract class Plants {
  name: string;
  icon_name: string | undefined;
  both_time: number;
  growth_cycle: number;
  status: PlantStatus;
  need_solid_grade: number;
  current_solid_grade: number;
  basic_output: number;

  constructor(params: PlantsParams) {
    this.name = params.name;
    this.icon_name = params.icon_name;
    this.both_time = params.both_time;
    this.growth_cycle = params.growth_cycle;
    this.need_solid_grade = params.need_solid_grade;
    this.current_solid_grade = params.current_solid_grade;
    this.basic_output = params.basic_output;
    this.status = PlantStatus.NOT_GERMINATED;

    this.initPlantStatus();
  }

  abstract getPlantsConfig(): PlantsConfig;

  private initPlantStatus() {
    // 当前时间 - 出生时间 / 周期 取整
    const growthIndex = Math.floor((dayjs().unix() - this.both_time) / this.growth_cycle);
    // console.log(this.both_time, dayjs().unix(), dayjs().unix() - this.both_time);
    this.status = growthIndex > PlantStatus.DEATH ? PlantStatus.DEATH : growthIndex;
  }

  private getRandomSeeds() {
    // 随机产出0-2个种子
    const range = 1000;
    const rand = Math.floor(Math.random() * range);
    if (rand < 800) return 0;
    else if (rand < 950) return 1;
    return 2;
  }

  private getOutput(): number {
    const output = Math.floor(this.basic_output + this.basic_output * (this.current_solid_grade - this.need_solid_grade) * 0.5);
    return output;
  }

  // 获取当前植物的状态
  getPlantsStataus() {
    this.initPlantStatus();
    return this.status;
  }

  // 使用化肥
  useFertilizer() {}

  // 收获植物
  harvest(): { output: number; seeds: number } | undefined {
    // 当前是未发芽状态或者是发芽状态
    if (this.status === PlantStatus.NOT_GERMINATED || this.status === PlantStatus.GERMINATING) {
      console.log("植物未成熟，暂时无法收获");
      return;
    }

    // 当前是成熟状态
    if (this.status === PlantStatus.MATURE) {
      const output = this.getOutput();
      const seeds = this.getRandomSeeds();
      return { output, seeds };
    }

    // 死亡状态
    if (this.status === PlantStatus.DEATH) {
      const seeds = this.getRandomSeeds();
      return { output: 0, seeds };
    }
  }
}

export const getPlantsInstance = async (params: { data: ChildPlantsParams; type: "cabbage" }) => {
  const module = await import(`./${params.type}.ts`);
  const PlantClass = module.default;
  const instance = new PlantClass(params.data);
  return instance as Cabbage;
};
