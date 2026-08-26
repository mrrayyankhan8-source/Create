import { Vector3 } from "../utilities/Math";
import { TrainPhysics } from "./TrainPhysics";

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

    /**
     * Finds shortest path using BFS for unweighted distance or Dijkstra for weighted.
     * Simple BFS implemented here.
     */
    public findPath(startId: string, endId: string): string[] | null {
        if (!this.nodes.has(startId) || !this.nodes.has(endId)) return null;

        const queue: string[] = [startId];
        const visited: Set<string> = new Set([startId]);
        const parentMap: Map<string, string> = new Map();

        while (queue.length > 0) {
            const current = queue.shift()!;

            if (current === endId) {
                // Reconstruct path
                const path: string[] = [];
                let currNode: string | undefined = endId;
                while (currNode !== undefined) {
                    path.unshift(currNode);
                    currNode = parentMap.get(currNode);
                }
                return path;
            }

            const node = this.nodes.get(current)!;
            for (const neighbor of node.connections) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    parentMap.set(neighbor, current);
                    queue.push(neighbor);
                }
            }
        }

        return null; // No path found
    }
}

export interface ScheduleEntry {
    stationId: string;
    waitDelay: number; // Time to wait in seconds
}

export class TrainSchedule {
    public entries: ScheduleEntry[] = [];
    public currentEntryIndex: number = 0;
    public waitTimer: number = 0;

    public isWaiting: boolean = false;

    public tick(deltaTime: number, train: TrainPhysics, graph: TrackGraph) {
        if (this.entries.length === 0) return;

        const currentEntry = this.entries[this.currentEntryIndex];

        if (this.isWaiting) {
            this.waitTimer -= deltaTime;
            if (this.waitTimer <= 0) {
                this.isWaiting = false;

                // Advance the current entry to the NEXT destination
                this.currentEntryIndex = (this.currentEntryIndex + 1) % this.entries.length;
                const nextEntry = this.entries[this.currentEntryIndex];

                let currentPosId = currentEntry.stationId;
                if (train.currentPath && train.currentPath.length > 0) {
                    // Last node of current path is where we are sitting now
                    currentPosId = train.currentPath[train.currentPath.length - 1];
                }

                const path = graph.findPath(
                    currentPosId,
                    nextEntry.stationId
                );

                if (path) {
                    train.assignPath(graph, path);
                    train.targetSpeed = train.maxSpeed;
                }
            }
        } else {
            // Check if train has arrived at the currently targeted station
            if (train.speed === 0 && train.currentPathIndex >= train.currentPath.length - 1) {
                this.isWaiting = true;
                // It arrived at the destination described by currentEntryIndex.
                this.waitTimer = this.entries[this.currentEntryIndex].waitDelay;
            }
        }
    }
}
