const MAX_FLICKER_SCORE = 128;
export class RotationPropagator {
    // Abstracted speed modifier
    static getRotationSpeedModifier(from, to) {
        // Simplified for now: just return 1 if connected (same axis)
        return 1;
    }
    static getConveyedSpeed(from, to) {
        const modifier = this.getRotationSpeedModifier(from, to);
        return from.getTheoreticalSpeed() * modifier;
    }
    static handleAdded(dimension, pos, addedBE) {
        this.propagateNewSource(addedBE);
    }
    static propagateNewSource(currentBE) {
        const dimension = currentBE.dimension;
        for (const neighbourBE of this.getConnectedNeighbours(currentBE)) {
            const speedOfCurrent = currentBE.getTheoreticalSpeed();
            const speedOfNeighbour = neighbourBE.getTheoreticalSpeed();
            const newSpeed = this.getConveyedSpeed(currentBE, neighbourBE);
            const oppositeSpeed = this.getConveyedSpeed(neighbourBE, currentBE);
            if (newSpeed === 0 && oppositeSpeed === 0)
                continue;
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
    static handleRemoved(dimension, pos, removedBE) {
        if (removedBE.getTheoreticalSpeed() === 0)
            return;
        for (const neighbourPos of this.getPotentialNeighbourLocations(removedBE)) {
            const neighbourBlock = dimension.getBlock(neighbourPos);
            if (!neighbourBlock)
                continue;
            // Lookup neighbourBE from a global registry in a real implementation
            // For now this is a skeletal propagation structure
        }
    }
    static propagateMissingSource(updateBE) {
        // Find new source logic via BFS
    }
    static getConnectedNeighbours(be) {
        const neighbours = [];
        // Implementation will iterate adjacent blocks, find valid BEs and check connections
        return neighbours;
    }
    static getPotentialNeighbourLocations(be) {
        const neighbours = [];
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
