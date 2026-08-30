import { Vector3 } from "@minecraft/server";
import { KineticBlockEntity } from "../block/KineticBlockEntity.js";
import { RotatedPillarKineticBlockEntity } from "../block/RotatedPillarKineticBlockEntity.js";
import { CogwheelBlockEntity } from "../block/CogwheelBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.RotationPropagator
 */
export class RotationPropagator {

    private static getDirection(diff: Vector3): string | null {
        if (diff.x > 0) return "east";
        if (diff.x < 0) return "west";
        if (diff.y > 0) return "up";
        if (diff.y < 0) return "down";
        if (diff.z > 0) return "south";
        if (diff.z < 0) return "north";
        return null;
    }

    private static getOppositeDirection(dir: string): string {
        switch (dir) {
            case "east": return "west";
            case "west": return "east";
            case "up": return "down";
            case "down": return "up";
            case "south": return "north";
            case "north": return "south";
            default: return "up";
        }
    }

    private static getAxisForDirection(dir: string): string {
        if (dir === "east" || dir === "west") return "x";
        if (dir === "up" || dir === "down") return "y";
        if (dir === "south" || dir === "north") return "z";
        return "y";
    }

    private static getAxisModifier(entity: KineticBlockEntity, direction: string): number {
        // Equivalent to getAxisModifier in Java, simplifying for straight shafts
        return 1.0;
    }

    private static isLargeToLargeGear(from: CogwheelBlockEntity, to: CogwheelBlockEntity, diff: Vector3): boolean {
        if (!from.isLarge || !to.isLarge) return false;

        // Ensure they aren't on the exact same block
        if (diff.x === 0 && diff.y === 0 && diff.z === 0) return false;

        // In Bedrock, we'll check if they are diagonal in the plane perpendicular to their axis
        const axisFrom = from.getAxis();
        const axisTo = to.getAxis();

        if (axisFrom !== axisTo) return false;

        // If they share an axis, the diff on that axis must be 0, and they must be diagonal
        if (axisFrom === 'x') return diff.x === 0 && Math.abs(diff.y) === 1 && Math.abs(diff.z) === 1;
        if (axisFrom === 'y') return diff.y === 0 && Math.abs(diff.x) === 1 && Math.abs(diff.z) === 1;
        if (axisFrom === 'z') return diff.z === 0 && Math.abs(diff.x) === 1 && Math.abs(diff.y) === 1;

        return false;
    }

    public static getRotationSpeedModifier(from: KineticBlockEntity, to: KineticBlockEntity): number {
        const diff = {
            x: to.block.location.x - from.block.location.x,
            y: to.block.location.y - from.block.location.y,
            z: to.block.location.z - from.block.location.z
        };

        const direction = this.getDirection(diff);
        if (!direction) return 0;

        let alignedAxes = true;
        const dirAxis = this.getAxisForDirection(direction);

        // Check alignment
        for (const axis of ['x', 'y', 'z']) {
            if (axis !== dirAxis) {
                if ((diff as any)[axis] !== 0) {
                    alignedAxes = false;
                }
            }
        }

        // Simplification: check if they are shafts or cogs and share an axis
        let connectedByAxis = false;
        if (alignedAxes) {
             if (from instanceof RotatedPillarKineticBlockEntity && to instanceof RotatedPillarKineticBlockEntity) {
                 if (from.getAxis() === dirAxis && to.getAxis() === dirAxis) {
                     connectedByAxis = true;
                 }
             }
        }

        let isFromSmallCog = false;
        let isToSmallCog = false;
        let isFromLargeCog = false;
        let isToLargeCog = false;

        if (from instanceof CogwheelBlockEntity) {
            isFromSmallCog = !from.isLarge;
            isFromLargeCog = from.isLarge;
        }

        if (to instanceof CogwheelBlockEntity) {
            isToSmallCog = !to.isLarge;
            isToLargeCog = to.isLarge;
        }

        const connectedByGears = isFromSmallCog && isToSmallCog;

        // Axis <-> Axis
        if (connectedByAxis) {
            let axisModifier = this.getAxisModifier(to, this.getOppositeDirection(direction));
            if (axisModifier !== 0) axisModifier = 1 / axisModifier;
            return this.getAxisModifier(from, direction) * axisModifier;
        }

        // Large Gear <-> Large Gear
        if (isFromLargeCog && isToLargeCog) {
            if (this.isLargeToLargeGear(from as CogwheelBlockEntity, to as CogwheelBlockEntity, diff)) {
                 const sourceAxis = (from as CogwheelBlockEntity).getAxis();
                 const targetAxis = (to as CogwheelBlockEntity).getAxis();
                 const sourceAxisDiff = (diff as any)[sourceAxis];
                 const targetAxisDiff = (diff as any)[targetAxis];

                 return ((sourceAxisDiff > 0) !== (targetAxisDiff > 0)) ? -1 : 1;
            }
        }

        // Gear <-> Large Gear
        if (isFromLargeCog && isToSmallCog) {
            const axisFrom = (from as CogwheelBlockEntity).getAxis();
            const axisTo = (to as CogwheelBlockEntity).getAxis();

            if (axisFrom !== axisTo) {
                // Must be adjacent and sharing correct faces. Simplified logic:
                if (Math.abs(diff.x) + Math.abs(diff.y) + Math.abs(diff.z) === 1) {
                     return -2.0;
                }
            }
        }

        if (isToLargeCog && isFromSmallCog) {
            const axisFrom = (from as CogwheelBlockEntity).getAxis();
            const axisTo = (to as CogwheelBlockEntity).getAxis();

            if (axisFrom !== axisTo) {
                 if (Math.abs(diff.x) + Math.abs(diff.y) + Math.abs(diff.z) === 1) {
                     return -0.5;
                }
            }
        }

        // Gear <-> Gear
        if (connectedByGears) {
            const manhattanDist = Math.abs(diff.x) + Math.abs(diff.y) + Math.abs(diff.z);
            if (manhattanDist !== 1) return 0;
            if (isToLargeCog) return 0;

            const fromAxis = (from as CogwheelBlockEntity).getAxis();
            const toAxis = (to as CogwheelBlockEntity).getAxis();

            if (dirAxis === fromAxis) return 0;
            if (fromAxis === toAxis) return -1;
        }

        return 0;
    }
}
