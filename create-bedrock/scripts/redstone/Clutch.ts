import { BaseKineticNode } from "../kinetic/KineticNode";
import { KineticNetwork } from "../kinetic/KineticNetwork";

export class Clutch extends BaseKineticNode {
    public isEngaged: boolean = true;
    public stressImpact: number = 0;

    constructor(id: string) {
        super(id);
    }

    getStressImpact(): number { return this.stressImpact; }

    public setRedstonePower(power: number) {
        const wasEngaged = this.isEngaged;
        this.isEngaged = power === 0; // Engaged when unpowered, disengaged when powered

        if (wasEngaged !== this.isEngaged && this.network) {
            // Re-evaluating the network is necessary because breaking/forming connections
            // changes the graph topology.

            // To simulate the clutch breaking the network, we tell the network to recalculate.
            // A real implementation would split the network into two if this was the only connection.
            this.network.triggerTopologyUpdate();
        }
    }
}
