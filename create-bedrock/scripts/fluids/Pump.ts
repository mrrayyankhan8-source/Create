import { BaseKineticNode } from "../kinetic/KineticNode";
import { FluidTank } from "./Tank";

export class Pump extends BaseKineticNode {

    private sourceTank: FluidTank | null = null;
    private destTank: FluidTank | null = null;

    constructor(id: string) {
        super(id);
    }

    getStressImpact(): number {
        return 4; // Pumps require 4 capacity per RPM
    }

    public setConnections(source: FluidTank, dest: FluidTank) {
        this.sourceTank = source;
        this.destTank = dest;
    }

    public tick(deltaTime: number) {
        if (this.speed === 0 || !this.sourceTank || !this.destTank) return;

        // Negative speed = reverse flow
        let flowDirection = Math.sign(this.speed);
        let speedMagnitude = Math.abs(this.speed);

        // e.g. 1 RPM = 1 mb per tick
        let flowAmount = speedMagnitude * (deltaTime / 0.05);

        let actualSource = flowDirection > 0 ? this.sourceTank : this.destTank;
        let actualDest = flowDirection > 0 ? this.destTank : this.sourceTank;

        if (actualSource.getAmount() > 0) {
            // Attempt to drain
            let available = Math.min(flowAmount, actualSource.getAmount());
            let fluidId = actualSource.fluid!.fluidId;

            // See how much destination can hold
            let filled = actualDest.fill(fluidId, available);
            if (filled > 0) {
                actualSource.drain(filled);
            }
        }
    }
}
