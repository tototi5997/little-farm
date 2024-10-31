import { ChildPlantsParams, Plants } from "./Plants";

class Wheat extends Plants {
  constructor(data: ChildPlantsParams) {
    super({
      name: "小麦",
      icon_name: "icon-wheat",
      growth_cycle: 10,
      need_solid_grade: 1,
      basic_output: 10,
      // input
      ...data,
    });
  }

  getPlantsConfig() {
    return {
      name: "小麦",
      type: "wheat",
      both_time: this.both_time,
      current_solid_grade: this.current_solid_grade,
    };
  }
}

export default Wheat;
