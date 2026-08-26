import { BaseKineticNode } from "../kinetic/KineticNode";
import { Belt } from "../logistics/Belt";

export class Saw extends BaseKineticNode {

    private targetBelt: Belt | null = null;

    constructor(id: string) {
        super(id);
    }

    getStressImpact(): number {
        return 4;
    }

    public setTargetBelt(belt: Belt) {
        this.targetBelt = belt;
    }

    public tick(deltaTime: number) {
        if (this.speed === 0 || !this.targetBelt) return;

        // Items passing through the saw on a belt get processed if a recipe exists
        // E.g. Log -> Stripped Log -> Planks

        for (const item of this.targetBelt.items) {
            // Processing point is usually middle of the belt, say progress ~ 0.5
            if (item.progress >= 0.45 && item.progress <= 0.55) {
                if (item.itemTypeId === "oak_log") {
                    item.itemTypeId = "stripped_oak_log";
                }
            }
        }
    }
}
