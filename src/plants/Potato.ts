import { ChildPlantsParams, Plants } from "./Plants";

class Potato extends Plants {
  constructor(data: ChildPlantsParams) {
    super({
      name: "土豆",
      icon_name: "icon-potato",
      growth_cycle: 20,
      need_solid_grade: 1,
      basic_output: 10,
      // input
      ...data,
    });
  }

  getPlantsConfig() {
    return {
      name: "土豆",
      type: "potato",
      both_time: this.both_time,
      current_solid_grade: this.current_solid_grade,
    };
  }
}

export default Potato;
