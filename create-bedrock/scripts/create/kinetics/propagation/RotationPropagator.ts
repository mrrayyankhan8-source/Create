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
        if (diff.x > 0 && diff.y === 0 && diff.z === 0) return "east";
        if (diff.x < 0 && diff.y === 0 && diff.z === 0) return "west";
        if (diff.x === 0 && diff.y > 0 && diff.z === 0) return "up";
        if (diff.x === 0 && diff.y < 0 && diff.z === 0) return "down";
        if (diff.x === 0 && diff.y === 0 && diff.z > 0) return "south";
        if (diff.x === 0 && diff.y === 0 && diff.z < 0) return "north";
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
        if (entity.block && entity.block.typeId && entity.block.typeId.includes("gearbox")) {
            return direction === "up" || direction === "down" ? -1 : 1;
        }
        if (typeof (entity as any).getRotationSpeedModifier === 'function') {
            return (entity as any).getRotationSpeedModifier(direction);
        }
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

        let isFromSmallCog = false;
        let isToSmallCog = false;
        let isFromLargeCog = false;
        let isToLargeCog = false;

        if (from instanceof CogwheelBlockEntity || (from.block && from.block.typeId && from.block.typeId.includes("cogwheel"))) {
            isFromSmallCog = !(from as any).isLarge;
            isFromLargeCog = (from as any).isLarge;
        }

        if (to instanceof CogwheelBlockEntity || (to.block && to.block.typeId && to.block.typeId.includes("cogwheel"))) {
            isToSmallCog = !(to as any).isLarge;
            isToLargeCog = (to as any).isLarge;
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
             if (typeof (from as any).getAxis === 'function' && typeof (to as any).getAxis === 'function') {
                 if ((from as any).getAxis() === dirAxis && (to as any).getAxis() === dirAxis) {
                     connectedByAxis = true;
                 }
             }
        }

        const connectedByGears = isFromSmallCog && isToSmallCog;

        if (connectedByAxis) {
            let axisModifier = this.getAxisModifier(to, this.getOppositeDirection(direction));
            if (axisModifier !== 0) axisModifier = 1 / axisModifier;
            return this.getAxisModifier(from, direction) * axisModifier;
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
        if (!removedTE) return;

        const pos = removedTE.block.location;
        const dimension = removedTE.block.dimension;

        const neighbours = this.getPotentialNeighbourLocations(removedTE);
        for (const loc of neighbours) {
            const neighbourBE = KineticBlockManager.get(dimension, loc);
            if (!neighbourBE) continue;

            if (!neighbourBE.hasSource() ||
                neighbourBE.source?.x !== pos.x ||
                neighbourBE.source?.y !== pos.y ||
                neighbourBE.source?.z !== pos.z) {
                continue;
            }

            this.propagateMissingSource(neighbourBE, pos);
        }
    }

    private static propagateMissingSource(updateTE: KineticBlockEntity, removedPos?: Vector3): void {
        const dimension = updateTE.block.dimension;
        const potentialNewSources: KineticBlockEntity[] = [];
        const frontier: Vector3[] = [];
        frontier.push(updateTE.block.location);

        const missingSource = updateTE.hasSource() ? updateTE.source : null;

        const removedSet: Set<KineticBlockEntity> = new Set();

        while (frontier.length > 0) {
            const pos = frontier.shift()!;
            const currentBE = KineticBlockManager.get(dimension, pos);
            if (!currentBE || removedSet.has(currentBE)) continue;

            removedSet.add(currentBE);

            // We must traverse neighbors BEFORE we clear the source, so we can check if they point at us
            for (const neighbourBE of this.getConnectedNeighbours(currentBE)) {

                // If it's part of the same disconnected sub-tree...
                const pointsAtUs = neighbourBE.source?.x === pos.x && neighbourBE.source?.y === pos.y && neighbourBE.source?.z === pos.z;
                const pointsAtRemoved = removedPos && neighbourBE.source?.x === removedPos.x && neighbourBE.source?.y === removedPos.y && neighbourBE.source?.z === removedPos.z;
                const sharedSource = missingSource && neighbourBE.source?.x === missingSource.x && neighbourBE.source?.y === missingSource.y && neighbourBE.source?.z === missingSource.z;

                // Potential rescue
                if (!neighbourBE.hasSource()) {
                    if (neighbourBE.isSource()) {
                        potentialNewSources.push(neighbourBE);
                    }
                    continue;
                }

                if (pointsAtUs || pointsAtRemoved || sharedSource) {
                    frontier.push(neighbourBE.block.location);
                    continue;
                }

                const notPointingAtUs = neighbourBE.source?.x !== pos.x || neighbourBE.source?.y !== pos.y || neighbourBE.source?.z !== pos.z;

                if (notPointingAtUs) {
                    potentialNewSources.push(neighbourBE);
                    continue;
                }

                if (neighbourBE.isSource()) {
                    potentialNewSources.push(neighbourBE);
                }
            }

            currentBE.removeSource(); // This automatically handles network removal in our TS port
        }

        for (const newSource of potentialNewSources) {
            if (newSource.hasSource() || newSource.isSource()) {
                this.propagateNewSource(newSource);
                return;
            }
        }
    }

    private static propagateNewSource(currentTE: KineticBlockEntity): void {
        if (currentTE.isSource() && currentTE.getTheoreticalSpeed() === 0) {
             currentTE.setSpeed(currentTE.getGeneratedSpeed());
             currentTE.setSource(currentTE.block.location);
        }

        if (currentTE.isSource() && currentTE.source === null) {
            currentTE.setSource(currentTE.block.location);
        }

        const currentNetwork = currentTE.getOrCreateNetwork();
        currentNetwork.add(currentTE);

        const visited: Set<KineticBlockEntity> = new Set();
        visited.add(currentTE);

        const queue: KineticBlockEntity[] = [currentTE];

        while (queue.length > 0) {
            const node = queue.shift()!;

            for (const neighbourTE of this.getConnectedNeighbours(node)) {
                if (visited.has(neighbourTE)) continue;

                const speedOfCurrent = node.getTheoreticalSpeed();
                const speedOfNeighbour = neighbourTE.getTheoreticalSpeed();
                const newSpeed = this.getConveyedSpeed(node, neighbourTE);
                const oppositeSpeed = this.getConveyedSpeed(neighbourTE, node);

                if (newSpeed === 0 && oppositeSpeed === 0) continue;

                const incompatible = Math.sign(newSpeed) !== Math.sign(speedOfNeighbour) && (newSpeed !== 0 && speedOfNeighbour !== 0);

                const MAX_RPM = 256;
                const tooFast = Math.abs(newSpeed) > MAX_RPM || Math.abs(oppositeSpeed) > MAX_RPM;

                if (tooFast || incompatible) {
                    continue;
                }

                if (Math.abs(oppositeSpeed) > Math.abs(speedOfCurrent)) {
                    neighbourTE.getOrCreateNetwork().remove(neighbourTE);

                    node.setSource(neighbourTE.block.location);
                    node.setSpeed(this.getConveyedSpeed(neighbourTE, node));

                    const neighbourNetwork = neighbourTE.getOrCreateNetwork();
                    neighbourNetwork.add(node);
                    node.networkId = neighbourTE.networkId;

                    visited.add(neighbourTE);
                    queue.push(neighbourTE);
                } else {
                    if (Math.abs(newSpeed) >= Math.abs(speedOfNeighbour)) {
                        const differentSource = neighbourTE.source?.x !== node.block.location.x || neighbourTE.source?.y !== node.block.location.y || neighbourTE.source?.z !== node.block.location.z;
                        if (speedOfNeighbour !== newSpeed || !neighbourTE.hasSource() || differentSource) {

                            neighbourTE.getOrCreateNetwork().remove(neighbourTE);

                            neighbourTE.setSource(node.block.location);
                            neighbourTE.setSpeed(newSpeed);

                            const network = node.getOrCreateNetwork();
                            network.add(neighbourTE);
                            neighbourTE.networkId = node.networkId;

                            visited.add(neighbourTE);
                            queue.push(neighbourTE); // Propagate to next layer
                        }
                    }
                }
            }
        }
    }

    private static getPotentialNeighbourLocations(be: KineticBlockEntity): Vector3[] {
        const pos = be.block.location;
        const locations: Vector3[] = [];

        locations.push({ x: pos.x + 1, y: pos.y, z: pos.z });
        locations.push({ x: pos.x - 1, y: pos.y, z: pos.z });
        locations.push({ x: pos.x, y: pos.y + 1, z: pos.z });
        locations.push({ x: pos.x, y: pos.y - 1, z: pos.z });
        locations.push({ x: pos.x, y: pos.y, z: pos.z + 1 });
        locations.push({ x: pos.x, y: pos.y, z: pos.z - 1 });

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
                if (be.block.location.x === loc.x && be.block.location.y === loc.y && be.block.location.z === loc.z) {
                    continue;
                }
                if (this.getRotationSpeedModifier(be, neighbourBE) !== 0) {
                     neighbours.push(neighbourBE);
                }
            }
        }
        return neighbours;
    }
}
