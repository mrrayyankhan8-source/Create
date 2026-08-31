import { Block, Vector3 } from "@minecraft/server";
import { PipeConnection } from "./PipeConnection.js";
import { FluidStack } from "./FluidStack.js";

/**
 * Bedrock equivalent for FluidTransportBehaviour
 * Attached to pipes to cache and tick flows.
 */
export class FluidTransportBehaviour {
    public block: Block;
    public interfaces: Map<string, PipeConnection> = new Map();

    constructor(block: Block) {
        this.block = block;
        this.createConnectionData();
    }

    private createConnectionData(): void {
        const directions = ["up", "down", "north", "south", "east", "west"];
        for (const dir of directions) {
            if (this.canHaveFlowToward(dir)) {
                this.interfaces.set(dir, new PipeConnection(dir));
            }
        }
    }

    public canHaveFlowToward(direction: string): boolean {
        // Evaluate block state. For basic Fluid Pipe, all 6 could be open.
        // We will default to true for testing, or read block states if implemented.
        try {
            const stateStr = `create:connection_${direction}`;
            const state = this.block.permutation.getState(stateStr as any);
            if (state !== undefined) {
                return state === true;
            }
        } catch (e) {
            // Mock environments might not support getState with arbitrary strings.
            // Fallthrough to true.
        }
        return true;
    }

    public wipePressure(): void {
        for (const conn of this.interfaces.values()) {
            conn.wipePressure();
        }
    }

    public addPressure(side: string, inbound: boolean, pressure: number): void {
        const conn = this.interfaces.get(side);
        if (conn) {
            conn.addPressure(inbound, pressure);
        }
    }

    public hasAnyPressure(): boolean {
        for (const conn of this.interfaces.values()) {
            if (conn.hasPressure()) return true;
        }
        return false;
    }

    public getConnection(side: string): PipeConnection | undefined {
        return this.interfaces.get(side);
    }
}
