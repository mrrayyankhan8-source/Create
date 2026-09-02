import { Block, Dimension, Vector3, system } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";
import { RotationPropagator } from "../propagation/RotationPropagator.js";
import { TorquePropagator } from "../network/TorquePropagator.js";
import { KineticEffectHandler } from "../render/KineticEffectHandler.js";

/**
 * Global manager mapping Minecraft Bedrock blocks to their virtual KineticBlockEntity instances.
 */
export class KineticBlockManager {
    public static blockEntities: Map<string, KineticBlockEntity> = new Map();

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
            RotationPropagator.handleRemoved(entity);
            if (entity.hasNetwork()) {
                const network = TorquePropagator.getOrCreateNetworkFor(entity);
                network.remove(entity);
            }
            KineticEffectHandler.cleanup(entity);
        }
        this.blockEntities.delete(this.getPosKey(dimension, pos));
    }

    public static tickAll(): void {
        let maxPasses = 10;
        let pass = 0;
        let changed = true;

        const entities = Array.from(this.blockEntities.values());

        while(changed && pass < maxPasses) {
            changed = false;
            // Iterate over an array of entities to avoid concurrent modification issues
            for (const entity of entities) {
                // If it claims to have a source, but the source is missing entirely from the map
                if (!entity.isSource() && entity.hasSource() && this.isSourceMissing(entity)) {
                     entity.removeSource();
                     RotationPropagator.handleAdded(entity);
                     changed = true;
                     continue;
                }

                if (entity.updateSpeedRequested && entity.preventSpeedUpdate === 0) {
                     entity.updateSpeedRequested = false;
                     // We reset speed if not a source to ensure full recalculation if disconnected
                     if (!entity.isSource() && !entity.hasSource()) {
                         entity.setSpeed(0);
                     }
                     RotationPropagator.handleAdded(entity);
                     changed = true;
                }
            }
            pass++;
        }

        // Trigger visual effect ticks
        for (const entity of entities) {
            KineticEffectHandler.tickEffects(entity);
        }
    }

    private static isSourceMissing(entity: KineticBlockEntity): boolean {
        if (!entity.source) return true;
        const sourceBE = this.get(entity.block.dimension, entity.source);
        return sourceBE === undefined;
    }
}
