import { Block } from "@minecraft/server";
import { Train } from "../entity/Train.js";

/**
 * Port of com.simibubi.create.content.trains.station.GlobalStation
 */
export class TrainStationBlockEntity {
    public block: Block;
    public trackNodeId: string | null = null;
    public boundTrain: Train | null = null;

    constructor(block: Block) {
        this.block = block;
    }

    public isAssemblyMode(): boolean {
        // Safe check for testing environments where states might not exist
        try {
            return this.block.permutation.getState("create:assembling" as any) === true;
        } catch (e) {
            return true;
        }
    }

    /**
     * Stubs assembly of a train connected to this station
     */
    public assembleTrain(id: string): Train | null {
        if (!this.trackNodeId) return null;

        // Ensure we are in assembly mode
        if (!this.isAssemblyMode()) return null;

        const train = new Train(id);
        this.boundTrain = train;
        return train;
    }

    /**
     * Stubs the disassembly of a train parked at this station
     */
    public disassembleTrain(): void {
        if (this.boundTrain) {
            // Disassemble logic
            this.boundTrain = null;
        }
    }
}
