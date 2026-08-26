import { Vector3 } from "../utilities/Math";

export interface TrackNode {
    id: string;
    position: Vector3;
    connections: string[]; // IDs of connected TrackNodes
}

export class TrackGraph {
    public nodes: Map<string, TrackNode> = new Map();

    public addNode(id: string, position: Vector3) {
        if (!this.nodes.has(id)) {
            this.nodes.set(id, { id, position, connections: [] });
        }
    }

    public connectNodes(idA: string, idB: string) {
        const nodeA = this.nodes.get(idA);
        const nodeB = this.nodes.get(idB);

        if (nodeA && nodeB) {
            if (!nodeA.connections.includes(idB)) nodeA.connections.push(idB);
            if (!nodeB.connections.includes(idA)) nodeB.connections.push(idA);
        }
    }

    public removeNode(id: string) {
        const node = this.nodes.get(id);
        if (node) {
            // Remove connections from neighbors
            for (const neighborId of node.connections) {
                const neighbor = this.nodes.get(neighborId);
                if (neighbor) {
                    neighbor.connections = neighbor.connections.filter(c => c !== id);
                }
            }
            this.nodes.delete(id);
        }
    }

    /**
     * Finds shortest path using basic BFS/Dijkstra
     */
    public findPath(startId: string, endId: string): string[] | null {
        // Implementation of A* or Dijkstra goes here
        // Returning mock path
        return [startId, endId];
    }
}
