import { Block, Dimension, Vector3 } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";
import { RotationPropagator } from "../propagation/RotationPropagator.js";
import { TorquePropagator } from "../network/TorquePropagator.js";

/**
 * Global manager mapping Minecraft Bedrock blocks to their virtual KineticBlockEntity instances.
 */
export class KineticBlockManager {
    private static blockEntities: Map<string, KineticBlockEntity> = new Map();

    private static getPosKey(dimension: Dimension, pos: Vector3): string {
        return `${dimension.id}:${pos.x},${pos.y},${pos.z}`;
    }

    public static register(dimension: Dimension, pos: Vector3, entity: KineticBlockEntity): void {
        this.blockEntities.set(this.getPosKey(dimension, pos), entity);
    }

    public static get(dimension: Dimension, pos: Vector3): KineticBlockEntity | undefined {
        return this.blockEntities.get(this.getPosKey(dimension, pos));
    }

    public static remove(dimension: Dimension, pos: Vector3): void {
        const entity = this.get(dimension, pos);
        if (entity) {
            // Unwire circular dependencies here
            RotationPropagator.handleRemoved(entity);
            if (entity.hasNetwork()) {
                const network = TorquePropagator.getOrCreateNetworkFor(entity);
                network.remove(entity);
            }
        }
        this.blockEntities.delete(this.getPosKey(dimension, pos));
    }

    public static tickAll(): void {
        for (const entity of this.blockEntities.values()) {
            // Check if speed update is requested
            if (entity.updateSpeedRequested && entity.preventSpeedUpdate === 0) {
                 entity.updateSpeedRequested = false;
                 RotationPropagator.handleAdded(entity);
            }
        }
    }
}
