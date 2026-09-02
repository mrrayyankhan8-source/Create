import { TrackNode } from "./TrackNode.js";

export class TrackEdge {
    public node1: TrackNode;
    public node2: TrackNode;
    public length: number;

    constructor(node1: TrackNode, node2: TrackNode, length: number) {
        this.node1 = node1;
        this.node2 = node2;
        this.length = length;
    }
}
