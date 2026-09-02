import { TrackNode } from "./TrackNode.js";
import { TrackEdge } from "./TrackEdge.js";

/**
 * Port of com.simibubi.create.content.trains.graph.TrackGraph
 */
export class TrackGraph {
    public id: string;
    public nodes: Map<string, TrackNode> = new Map();
    public edges: Map<string, TrackEdge[]> = new Map(); // Key is Node ID

    constructor(id: string) {
        this.id = id;
    }

    public addNode(node: TrackNode): void {
        this.nodes.set(node.id, node);
        if (!this.edges.has(node.id)) {
            this.edges.set(node.id, []);
        }
    }

    public connectNodes(node1: TrackNode, node2: TrackNode, length: number): void {
        const edge = new TrackEdge(node1, node2, length);
        this.edges.get(node1.id)?.push(edge);

        // Undirected graph equivalent
        const edgeRev = new TrackEdge(node2, node1, length);
        this.edges.get(node2.id)?.push(edgeRev);
    }
}
