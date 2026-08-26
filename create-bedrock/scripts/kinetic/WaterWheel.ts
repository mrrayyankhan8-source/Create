import { KineticNode } from "../kinetic/KineticNode";
import { Location } from "../core/BedrockAdapter";

export class WaterWheel implements KineticNode {
    id: string;
    location: Location;
    networkId?: number;

    public isSource: boolean = true;
    public isLarge: boolean;

    // Configurable based on surrounding flowing water blocks
    private generatedSpeed: number = 0;
    private generatedCapacity: number = 0;

    constructor(id: string, location: Location, isLarge: boolean = false) {
        this.id = id;
        this.location = location;
        this.isLarge = isLarge;
    }

    public updateFlowState(flowingWaterCount: number, waterDirectionMatches: boolean) {
        if (flowingWaterCount > 0) {
            this.generatedSpeed = waterDirectionMatches ? 8 : -8;
            if (this.isLarge) this.generatedSpeed *= 0.5; // Large wheels spin slower

            this.generatedCapacity = this.isLarge ? 512 : 128;
        } else {
            this.generatedSpeed = 0;
            this.generatedCapacity = 0;
        }
    }

    getGeneratedSpeed(): number {
        return this.generatedSpeed;
    }

    getTheoreticalSpeed(): number {
        return this.generatedSpeed;
    }

    calculateAddedStressCapacity(): number {
        return this.generatedCapacity;
    }

    calculateStressApplied(): number {
        return 0;
    }

    updateFromNetwork(capacity: number, stress: number, size: number): void {
        // Generators do not receive speed from the network, they dictate it.
    }
}
