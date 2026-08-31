import { Block, Dimension, Vector3, Direction } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

const MAX_FLICKER_SCORE = 128;

// A simplistic block-axis definition for our initial TypeScript version
export interface IRotate {
    getRotationAxis(state: Block): Direction | undefined;
    hasShaftTowards(dim: Dimension, pos: Vector3, state: Block, direction: Direction): boolean;
}

export class RotationPropagator {

    // Abstracted speed modifier
    private static getRotationSpeedModifier(from: KineticBlockEntity, to: KineticBlockEntity): number {
        // Simplified for now: just return 1 if connected (same axis)
        return 1;
    }

    private static getConveyedSpeed(from: KineticBlockEntity, to: KineticBlockEntity): number {
        const modifier = this.getRotationSpeedModifier(from, to);
        return from.getTheoreticalSpeed() * modifier;
    }

    public static handleAdded(dimension: Dimension, pos: Vector3, addedBE: KineticBlockEntity): void {
        this.propagateNewSource(addedBE);
    }

    private static propagateNewSource(currentBE: KineticBlockEntity): void {
        const dimension = currentBE.dimension;

        for (const neighbourBE of this.getConnectedNeighbours(currentBE)) {
            const speedOfCurrent = currentBE.getTheoreticalSpeed();
            const speedOfNeighbour = neighbourBE.getTheoreticalSpeed();
            const newSpeed = this.getConveyedSpeed(currentBE, neighbourBE);
            const oppositeSpeed = this.getConveyedSpeed(neighbourBE, currentBE);

            if (newSpeed === 0 && oppositeSpeed === 0) continue;

            // Simplistic overpower logic:
            if (Math.abs(oppositeSpeed) > Math.abs(speedOfCurrent)) {
                // Neighbour overpowers us
                currentBE.setSource(neighbourBE.block.location);
                currentBE.setSpeed(this.getConveyedSpeed(neighbourBE, currentBE));
                this.propagateNewSource(currentBE);
                return;
            }

            if (Math.abs(newSpeed) >= Math.abs(speedOfNeighbour)) {
                // We overpower neighbour
                neighbourBE.setSource(currentBE.block.location);
                neighbourBE.setSpeed(this.getConveyedSpeed(currentBE, neighbourBE));
                this.propagateNewSource(neighbourBE);
                continue;
            }
        }
    }

    public static handleRemoved(dimension: Dimension, pos: Vector3, removedBE: KineticBlockEntity): void {
        if (removedBE.getTheoreticalSpeed() === 0) return;

        for (const neighbourPos of this.getPotentialNeighbourLocations(removedBE)) {
            const neighbourBlock = dimension.getBlock(neighbourPos);
            if (!neighbourBlock) continue;
            // Lookup neighbourBE from a global registry in a real implementation
            // For now this is a skeletal propagation structure
        }
    }

    private static propagateMissingSource(updateBE: KineticBlockEntity): void {
        // Find new source logic via BFS
    }

    private static getConnectedNeighbours(be: KineticBlockEntity): KineticBlockEntity[] {
        const neighbours: KineticBlockEntity[] = [];
        // Implementation will iterate adjacent blocks, find valid BEs and check connections
        return neighbours;
    }

    private static getPotentialNeighbourLocations(be: KineticBlockEntity): Vector3[] {
        const neighbours: Vector3[] = [];
        const pos = be.block.location;
        neighbours.push({ x: pos.x + 1, y: pos.y, z: pos.z });
        neighbours.push({ x: pos.x - 1, y: pos.y, z: pos.z });
        neighbours.push({ x: pos.x, y: pos.y + 1, z: pos.z });
        neighbours.push({ x: pos.x, y: pos.y - 1, z: pos.z });
        neighbours.push({ x: pos.x, y: pos.y, z: pos.z + 1 });
        neighbours.push({ x: pos.x, y: pos.y, z: pos.z - 1 });
        return neighbours;
    }
}
