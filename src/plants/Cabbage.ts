import { ChildPlantsParams, Plants } from "./Plants";

class Cabbage extends Plants {
  constructor(data: ChildPlantsParams) {
    super({
      name: "白菜",
      icon_name: "icon-cabbage",
      growth_cycle: 10,
      need_solid_grade: 1,
      basic_output: 10,
      // input
      ...data,
    });
  }

  getPlantsConfig() {
    return {
      name: "白菜",
      type: "cabbage",
      both_time: this.both_time,
      current_solid_grade: this.current_solid_grade,
    };
  }
}

export default Cabbage;
