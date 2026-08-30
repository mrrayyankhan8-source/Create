import { Dimension, Vector3, Entity, system, world } from "@minecraft/server";
import { KineticBlockEntity } from "../block/KineticBlockEntity.js";

/**
 * Bedrock equivalent for Flywheel / Instanced Rendering.
 * Binds virtual KineticBlockEntities to visual Bedrock entities to display moving parts.
 */
export class KineticRenderer {
    // Map of position keys to spawned visual entities
    public static visualEntities: Map<string, Entity> = new Map();

    private static getPosKey(dimension: Dimension, pos: Vector3): string {
        return `${dimension.id}:${pos.x},${pos.y},${pos.z}`;
    }

    /**
     * Called when a block needs a visual component spawned.
     * @param be The kinetic block entity requesting rendering
     * @param entityTypeId The entity identifier to spawn (e.g. "create:cogwheel_visual")
     */
    public static spawnVisual(be: KineticBlockEntity, entityTypeId: string): Entity | undefined {
        const key = this.getPosKey(be.block.dimension, be.block.location);

        // Ensure we don't spawn duplicate visuals
        if (this.visualEntities.has(key)) {
            return this.visualEntities.get(key);
        }

        try {
            // Spawn at block center
            const spawnLoc = {
                x: be.block.location.x + 0.5,
                y: be.block.location.y,
                z: be.block.location.z + 0.5
            };
            const entity = be.block.dimension.spawnEntity(entityTypeId, spawnLoc);

            // Add a tag so we can clean them up later if the script reloads
            entity.addTag("create:visual");

            this.visualEntities.set(key, entity);
            return entity;
        } catch (e) {
            console.warn(`Failed to spawn visual entity ${entityTypeId} at ${key}:`, e);
            return undefined;
        }
    }

    /**
     * Synchronizes the backend kinetic speed to the visual entity property for Molang animation.
     */
    public static syncSpeed(be: KineticBlockEntity): void {
        const key = this.getPosKey(be.block.dimension, be.block.location);
        const entity = this.visualEntities.get(key);

        if (entity && entity.isValid()) {
            const speed = be.getSpeed();
            // Store speed in dynamic property for animation controller access
            try {
                entity.setDynamicProperty("create:speed", speed);
            } catch (e) {
                // Property might not be registered yet, fallback to a tag/name for now
            }
        }
    }

    /**
     * Removes the visual entity associated with the block position.
     */
    public static removeVisual(dimension: Dimension, pos: Vector3): void {
        const key = this.getPosKey(dimension, pos);
        const entity = this.visualEntities.get(key);

        if (entity && entity.isValid()) {
            entity.remove();
        }
        this.visualEntities.delete(key);
    }

    /**
     * Cleanup all visuals. Should be called on world unload or script shutdown.
     */
    public static cleanupAll(): void {
        for (const entity of this.visualEntities.values()) {
            if (entity.isValid()) {
                entity.remove();
            }
        }
        this.visualEntities.clear();
    }
}
