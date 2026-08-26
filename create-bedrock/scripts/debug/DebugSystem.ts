/**
 * Debug System
 * Tools for exposing state and identifying issues in simulation.
 */

import { KineticNetwork } from "../kinetic/KineticNetwork";

export class DebugSystem {
    public static enabled: boolean = false;

    public static enable() {
        this.enabled = true;
        console.warn("[DebugSystem] Debug mode enabled.");
    }

    public static disable() {
        this.enabled = false;
        console.warn("[DebugSystem] Debug mode disabled.");
    }

    public static log(message: string): void {
        if (!this.enabled) return;
        console.log(`[DEBUG] ${message}`);
    }

    public static dumpNetwork(network: KineticNetwork): void {
        if (!this.enabled) return;

        console.log(`=== KINETIC NETWORK ${network.id} DUMP ===`);
        console.log(`Capacity: ${network.calculateCapacity()} | Stress: ${network.calculateStress()}`);
        console.log(`Sources: ${network.sources.size}`);
        console.log(`Members: ${network.members.size}`);
        console.log(`===================================`);
    }

    public static reportError(context: string, error: Error): void {
        console.error(`[ERROR - ${context}] ${error.message}`);
        if (this.enabled && error.stack) {
            console.error(error.stack);
        }
    }
}
