/**
 * Bedrock Adapter Layer
 * Isolates Minecraft Bedrock script API specific calls.
 */

// Uses mock implementation to fulfill typescript without @minecraft/server present in test environment
// In real project this will be replaced by: import { world, Dimension, Location, Block, Entity } from "@minecraft/server";

export interface Location {
    x: number;
    y: number;
    z: number;
}

export interface Block {
    typeId: string;
    location: Location;
    permutation: any;
    isValid(): boolean;
}

export interface Entity {
    id: string;
    typeId: string;
    location: Location;
    getDynamicProperty(identifier: string): string | number | boolean | undefined;
    setDynamicProperty(identifier: string, value: string | number | boolean): void;
}

export interface Dimension {
    id: string;
    spawnEntity(identifier: string, location: Location): Entity;
    getBlock(location: Location): Block | undefined;
}

export class BedrockAdapter {
    /**
     * Get a dimension by ID (e.g. 'minecraft:overworld')
     */
    public static getDimension(dimensionId: string): Dimension {
        // Fallback for isolated environment (non-Bedrock execution)
        return {
            id: dimensionId,
            spawnEntity: (id: string, loc: Location) => ({ id: 'mock-entity', typeId: id, location: loc } as Entity),
            getBlock: (loc: Location) => undefined
        };
    }

    /**
     * Spawn an entity at a given location in a given dimension.
     */
    public static spawnEntity(dimension: Dimension, identifier: string, location: Location): Entity {
        return dimension.spawnEntity(identifier, location);
    }

    /**
     * Get a block at a given location in a given dimension.
     */
    public static getBlock(dimension: Dimension, location: Location): Block | undefined {
        return dimension.getBlock(location);
    }

    /**
     * Send an event or message to the world/players.
     */
    public static sendEvent(message: string): void {
        console.warn(`[Bedrock Event] ${message}`);
    }
}
