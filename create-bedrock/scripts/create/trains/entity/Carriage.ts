import { TrackNode } from "../graph/TrackNode.js";
import { TrackGraph } from "../graph/TrackGraph.js";
import { TrackEdge } from "../graph/TrackEdge.js";

/**
 * Port of com.simibubi.create.content.trains.entity.Carriage
 * Represents a single cart or section of a Train.
 */
export class Carriage {
    public leadingNode: TrackNode | null = null;
    public trailingNode: TrackNode | null = null;
    public travelDistance: number = 0;

    constructor() {}

    // Tracks the carriage along the Graph edges
    public travel(distance: number, graph: TrackGraph): void {
        this.travelDistance += distance;

        if (!this.leadingNode) return;

        // Implementation of graph edge traversal logic.
        // We find the edges connected to our current node, and travel across them
        // based on the distance budget.
        let remainingDistance = Math.abs(distance);
        let currentNode = this.leadingNode;

        // Anti-infinite loop lock
        let maxSegments = 100;

        while (remainingDistance > 0 && maxSegments > 0) {
            maxSegments--;

            const edges = graph.edges.get(currentNode.id);
            if (!edges || edges.length === 0) {
                // Derail or stop at end of track
                break;
            }

            // Simplification for the TS port:
            // Take the first valid edge. In full Java, this evaluates turn steering and switch logic
            // via the track graph intersection lookups.
            const edge = edges[0];

            if (remainingDistance >= edge.length) {
                // We traversed the entire edge, move to the next node
                remainingDistance -= edge.length;
                currentNode = edge.node2;
                this.leadingNode = currentNode;
            } else {
                // We stop somewhere along this edge
                remainingDistance = 0;
            }
        }
    }
}
