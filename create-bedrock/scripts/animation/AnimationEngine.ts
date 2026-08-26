/**
 * Animation Engine
 * Handles translation of simulation state into visible animations.
 */

import { KineticNetwork } from "../kinetic/KineticNetwork";
import { KineticNode } from "../kinetic/KineticNode";
import { Entity } from "../core/BedrockAdapter";

export class AnimationEngine {

    /**
     * Updates rotation and animation variables for Bedrock entities
     * Requires the entity to have animation controllers that read these properties.
     */
    public static updateKineticAnimations(node: KineticNode, entity: Entity, deltaTime: number) {
        // Assume Bedrock entity has dynamic properties for rotation
        let currentAngle = (entity.getDynamicProperty("create:rotation_angle") as number) || 0;

        // speed could be positive or negative
        const speed = node.getTheoreticalSpeed();

        if (speed !== 0) {
            // Convert speed to angular rotation per tick
            // In Create Java, speed of 1 = 1 degree per tick = 20 degrees per second
            const angleDelta = speed * (deltaTime / 0.05); // Normalized to tick
            currentAngle = (currentAngle + angleDelta) % 360;

            entity.setDynamicProperty("create:rotation_angle", currentAngle);
            entity.setDynamicProperty("create:speed", speed);
        } else {
            entity.setDynamicProperty("create:speed", 0);
        }
    }
}
