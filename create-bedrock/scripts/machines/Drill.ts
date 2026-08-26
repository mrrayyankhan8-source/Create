import { KineticNode } from "../kinetic/KineticNode";
import { Location } from "../core/BedrockAdapter";

import { BaseKineticNode } from "../kinetic/KineticNode";

export class Drill extends BaseKineticNode {
    public stressImpact: number = 4;

    constructor(id: string) {
        super(id);
    }

    getStressImpact(): number { return this.stressImpact; }

    updateFromNetwork(capacity: number, stress: number, overstressed: boolean): void {
        if (overstressed) {
            this.speed = 0;
        }
    }

    public tick(deltaTime: number) {
        if (this.speed !== 0) {
            // Check block in front of drill, apply mining progress based on speed
        }
    }
}
