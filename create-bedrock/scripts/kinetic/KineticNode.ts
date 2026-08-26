import { Location } from "../core/BedrockAdapter";

export interface KineticNode {
    id: string;
    location: Location;
    networkId?: number;

    // Properties
    isSource: boolean;
    getGeneratedSpeed(): number;
    getTheoreticalSpeed(): number;

    calculateAddedStressCapacity(): number;
    calculateStressApplied(): number;

    // State updates
    updateFromNetwork(capacity: number, stress: number, size: number): void;
}
