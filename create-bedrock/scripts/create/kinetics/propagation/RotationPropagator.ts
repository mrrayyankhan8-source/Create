import { Vector3, Block } from "@minecraft/server";
import { KineticBlockEntity } from "../block/KineticBlockEntity.js";
import { RotatedPillarKineticBlockEntity } from "../block/RotatedPillarKineticBlockEntity.js";
import { CogwheelBlockEntity } from "../block/CogwheelBlockEntity.js";
import { KineticBlockManager } from "../block/KineticBlockManager.js";

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
        return 1.0;
    }

    private static isLargeToLargeGear(from: CogwheelBlockEntity, to: CogwheelBlockEntity, diff: Vector3): boolean {
        if (!from.isLarge || !to.isLarge) return false;

        if (diff.x === 0 && diff.y === 0 && diff.z === 0) return false;

        const axisFrom = from.getAxis();
        const axisTo = to.getAxis();

        if (axisFrom !== axisTo) return false;

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

        for (const axis of ['x', 'y', 'z']) {
            if (axis !== dirAxis) {
                if ((diff as any)[axis] !== 0) {
                    alignedAxes = false;
                }
            }
        }

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

        if (connectedByAxis) {
            let axisModifier = this.getAxisModifier(to, this.getOppositeDirection(direction));
            if (axisModifier !== 0) axisModifier = 1 / axisModifier;
            return this.getAxisModifier(from, direction) * axisModifier;
        }

        if (isFromLargeCog && isToLargeCog) {
            if (this.isLargeToLargeGear(from as CogwheelBlockEntity, to as CogwheelBlockEntity, diff)) {
                 const sourceAxis = (from as CogwheelBlockEntity).getAxis();
                 const targetAxis = (to as CogwheelBlockEntity).getAxis();
                 const sourceAxisDiff = (diff as any)[sourceAxis];
                 const targetAxisDiff = (diff as any)[targetAxis];

                 return ((sourceAxisDiff > 0) !== (targetAxisDiff > 0)) ? -1 : 1;
            }
        }

        if (isFromLargeCog && isToSmallCog) {
            const axisFrom = (from as CogwheelBlockEntity).getAxis();
            const axisTo = (to as CogwheelBlockEntity).getAxis();

            if (axisFrom !== axisTo) {
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

    public static getConveyedSpeed(from: KineticBlockEntity, to: KineticBlockEntity): number {
        const modifier = this.getRotationSpeedModifier(from, to);
        return modifier !== 0 ? from.getTheoreticalSpeed() * modifier : 0;
    }

    public static handleAdded(addedTE: KineticBlockEntity): void {
        this.propagateNewSource(addedTE);
    }

    public static handleRemoved(removedTE: KineticBlockEntity): void {
        const pos = removedTE.block.location;
        const dimension = removedTE.block.dimension;
        // Logic from original Java: finding dependencies, setting speed 0, then seeking new sources

        for (const neighbour of this.getConnectedNeighbours(removedTE)) {
            if (neighbour.hasSource() &&
                neighbour.source?.x === pos.x &&
                neighbour.source?.y === pos.y &&
                neighbour.source?.z === pos.z) {
                neighbour.removeSource();
                this.handleRemoved(neighbour);
            }
        }

        // After clearing dependents, attempt to reconnect them to other potential sources
        this.propagateMissingSource(removedTE);
    }

    private static propagateMissingSource(removedTE: KineticBlockEntity): void {
        const potentialNewSources: Set<KineticBlockEntity> = new Set();

        for (const neighbour of this.getConnectedNeighbours(removedTE)) {
            if (neighbour.hasSource() || neighbour.isSource()) {
                potentialNewSources.add(neighbour);
            }
        }

        for (const newSource of potentialNewSources) {
            this.propagateNewSource(newSource);
        }
    }

    private static propagateNewSource(currentTE: KineticBlockEntity): void {
        for (const neighbourTE of this.getConnectedNeighbours(currentTE)) {
            const speedOfCurrent = currentTE.getTheoreticalSpeed();
            const speedOfNeighbour = neighbourTE.getTheoreticalSpeed();
            const newSpeed = this.getConveyedSpeed(currentTE, neighbourTE);
            const oppositeSpeed = this.getConveyedSpeed(neighbourTE, currentTE);

            if (newSpeed === 0 && oppositeSpeed === 0) continue;

            const incompatible = Math.sign(newSpeed) !== Math.sign(speedOfNeighbour) && (newSpeed !== 0 && speedOfNeighbour !== 0);

            // Simplifying fast-fail limits for initial Bedrock port (e.g. over 256 rpm)
            const MAX_RPM = 256;
            const tooFast = Math.abs(newSpeed) > MAX_RPM || Math.abs(oppositeSpeed) > MAX_RPM;

            if (tooFast) {
                // In a real port, break block here
                continue;
            }

            if (incompatible) {
                // Break block here
                continue;
            }

            if (Math.abs(oppositeSpeed) > Math.abs(speedOfCurrent)) {
                // Neighbour is faster, overpower us
                currentTE.setSource(neighbourTE.block.location);
                currentTE.setSpeed(this.getConveyedSpeed(neighbourTE, currentTE));
                this.propagateNewSource(currentTE);
                return;
            }

            if (Math.abs(newSpeed) >= Math.abs(speedOfNeighbour)) {
                // We are faster, overpower neighbour
                if (speedOfNeighbour !== newSpeed || !neighbourTE.hasSource()) {
                    neighbourTE.setSource(currentTE.block.location);
                    neighbourTE.setSpeed(newSpeed);
                    this.propagateNewSource(neighbourTE);
                }
            }
        }
    }

    private static getPotentialNeighbourLocations(be: KineticBlockEntity): Vector3[] {
        const pos = be.block.location;
        const locations: Vector3[] = [];

        // Orthogonal
        locations.push({ x: pos.x + 1, y: pos.y, z: pos.z });
        locations.push({ x: pos.x - 1, y: pos.y, z: pos.z });
        locations.push({ x: pos.x, y: pos.y + 1, z: pos.z });
        locations.push({ x: pos.x, y: pos.y - 1, z: pos.z });
        locations.push({ x: pos.x, y: pos.y, z: pos.z + 1 });
        locations.push({ x: pos.x, y: pos.y, z: pos.z - 1 });

        // Diagonal checks for large cogs
        if (be instanceof CogwheelBlockEntity && be.isLarge) {
            const axis = be.getAxis();
            if (axis === 'x') {
                locations.push({ x: pos.x, y: pos.y + 1, z: pos.z + 1 });
                locations.push({ x: pos.x, y: pos.y + 1, z: pos.z - 1 });
                locations.push({ x: pos.x, y: pos.y - 1, z: pos.z + 1 });
                locations.push({ x: pos.x, y: pos.y - 1, z: pos.z - 1 });
            } else if (axis === 'y') {
                locations.push({ x: pos.x + 1, y: pos.y, z: pos.z + 1 });
                locations.push({ x: pos.x + 1, y: pos.y, z: pos.z - 1 });
                locations.push({ x: pos.x - 1, y: pos.y, z: pos.z + 1 });
                locations.push({ x: pos.x - 1, y: pos.y, z: pos.z - 1 });
            } else if (axis === 'z') {
                locations.push({ x: pos.x + 1, y: pos.y + 1, z: pos.z });
                locations.push({ x: pos.x + 1, y: pos.y - 1, z: pos.z });
                locations.push({ x: pos.x - 1, y: pos.y + 1, z: pos.z });
                locations.push({ x: pos.x - 1, y: pos.y - 1, z: pos.z });
            }
        }

        return locations;
    }

    private static getConnectedNeighbours(be: KineticBlockEntity): KineticBlockEntity[] {
        const dimension = be.block.dimension;
        const locations = this.getPotentialNeighbourLocations(be);
        const neighbours: KineticBlockEntity[] = [];

        for (const loc of locations) {
            const neighbourBE = KineticBlockManager.get(dimension, loc);
            if (neighbourBE) {
                // Determine if a connection actually exists
                if (this.getRotationSpeedModifier(be, neighbourBE) !== 0) {
                     neighbours.push(neighbourBE);
                }
            }
        }
        return neighbours;
    }
}
