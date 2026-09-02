import { Dimension, Vector3, Entity } from "@minecraft/server";
import { KineticBlockEntity } from "../block/KineticBlockEntity.js";
import { KineticRenderer } from "./KineticRenderer.js";

/**
 * Port of com.simibubi.create.content.kinetics.KineticEffectHandler
 * Handles spawning particles and managing client-side effects for kinetic blocks.
 * In Bedrock, we manage the visual entities (Flywheel replacements) through this bridge layer.
 */
export class KineticEffectHandler {

    /**
     * Spawns or updates the visual rendering entity for a given block entity.
     * Maps the Java instanced rendering concept to Bedrock dummy entities.
     * @param be The kinetic block entity
     */
    public static tickEffects(be: KineticBlockEntity): void {
        const speed = be.getSpeed();

        // Spawn/Sync Visual Dummy Entity (Bedrock Flywheel Bridge)
        if (be.needsVisualEntity()) {
            const visualId = be.getVisualEntityId();
            if (visualId) {
                let entity = KineticRenderer.spawnVisual(be, visualId);
                if (entity) {
                    KineticRenderer.syncSpeed(be);
                }
            }
        }

        // Particle Effects (e.g. overstressed/friction)
        if (be.isOverStressed()) {
             // Example Bedrock particle: "create:overstressed_smoke"
             try {
                 be.block.dimension.spawnParticle("minecraft:smoke_particle", {
                     x: be.block.location.x + 0.5 + (Math.random() - 0.5) * 0.5,
                     y: be.block.location.y + 0.5 + (Math.random() - 0.5) * 0.5,
                     z: be.block.location.z + 0.5 + (Math.random() - 0.5) * 0.5
                 });
             } catch (e) {
                 // Particle might not exist in vanilla/addon context, ignore safely
             }
        }
    }

    public static cleanup(be: KineticBlockEntity): void {
        KineticRenderer.removeVisual(be.block.dimension, be.block.location);
    }
}
