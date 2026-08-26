import { KineticNode } from "./KineticNode";

/**
 * A directional edge representing mechanical connection between two nodes.
 * Contains a ratio representing speed multiplication (e.g., gears of different sizes).
 * Ratio is multiplier applied from fromNode to toNode.
 */
export interface KineticConnection {
    fromNode: KineticNode;
    toNode: KineticNode;
    ratio: number; // e.g. 1.0, -1.0, 0.5, etc.
}

export class KineticNetwork {
    public id: number;

    public nodes: Set<KineticNode> = new Set();
    public connections: KineticConnection[] = [];

    private currentCapacity: number = 0;
    private currentStress: number = 0;
    private isOverstressed: boolean = false;

    constructor(id: number) {
        this.id = id;
    }

    public addNode(node: KineticNode) {
        if (!this.nodes.has(node)) {
            this.nodes.add(node);
            node.setNetwork(this);
            this.recalculate();
        }
    }

    public removeNode(node: KineticNode) {
        if (this.nodes.has(node)) {
            this.nodes.delete(node);
            node.setNetwork(null);

            // Remove connections involving this node
            this.connections = this.connections.filter(c => c.fromNode !== node && c.toNode !== node);

            node.setSpeed(0);
            node.setTheoreticalSpeed(0);
            node.updateFromNetwork(0, 0, false);

            this.recalculate();
        }
    }

    public addConnection(fromNode: KineticNode, toNode: KineticNode, ratio: number = 1.0) {
        this.connections.push({ fromNode, toNode, ratio });
        this.recalculate();
    }

    public triggerTopologyUpdate() {
        this.recalculate();
    }

    public recalculate() {
        if (this.nodes.size === 0) return;

        // 1. Calculate Theoretical Speed
        this.propagateSpeed();

        // 2. Calculate Capacity and Stress based on Theoretical Speed
        let totalCapacity = 0;
        let totalStress = 0;

        for (const node of this.nodes) {
            const speedMagnitude = Math.abs(node.getTheoreticalSpeed());

            if (node.isSource) {
                // In Create, capacity is generated based on the source's generated capacity * speed
                totalCapacity += node.getGeneratedCapacity() * speedMagnitude;
            }

            // Stress is applied based on the stress impact * actual speed of the machine
            totalStress += node.getStressImpact() * speedMagnitude;
        }

        this.currentCapacity = totalCapacity;
        this.currentStress = totalStress;
        this.isOverstressed = totalStress > totalCapacity;

        // 3. Apply Actual Speed and Update Nodes
        for (const node of this.nodes) {
            if (this.isOverstressed) {
                node.setSpeed(0);
            } else {
                node.setSpeed(node.getTheoreticalSpeed());
            }
            node.updateFromNetwork(this.currentCapacity, this.currentStress, this.isOverstressed);
        }
    }

    private propagateSpeed() {
        // Find sources
        const sources = Array.from(this.nodes).filter(n => n.isSource && n.getGeneratedSpeed() !== 0);

        // Reset all theoretical speeds
        for (const node of this.nodes) {
            node.setTheoreticalSpeed(0);
        }

        // BFS propagation from sources
        // In a real scenario, multiple sources might conflict or combine.
        // For simplicity, we assume the network takes the speed of the dominant source, or sources are properly aligned.

        if (sources.length === 0) return;

        // For this virtual implementation, just take the first source.
        // Complex Create networks handle conflicting sources by breaking components, which requires block breaking logic.
        const primarySource = sources[0];
        primarySource.setTheoreticalSpeed(primarySource.getGeneratedSpeed());

        const queue: KineticNode[] = [primarySource];
        const visited: Set<KineticNode> = new Set([primarySource]);

        while (queue.length > 0) {
            const current = queue.shift()!;
            const currentSpeed = current.getTheoreticalSpeed();

            // Find all outgoing edges from this node
            const outgoing = this.connections.filter(c => c.fromNode === current);
            for (const edge of outgoing) {
                if (!visited.has(edge.toNode)) {

                    // If the node we are traversing through is a Clutch and it's disengaged,
                    // it does not propagate speed.
                    if ('isEngaged' in edge.fromNode && !(edge.fromNode as any).isEngaged) {
                        continue;
                    }
                    if ('isEngaged' in edge.toNode && !(edge.toNode as any).isEngaged) {
                        // The clutch itself still gets speed from the input side,
                        // but logic to stop output side should apply.
                        // For simplicity in this graph logic:
                        // If traversing OUT of a disengaged clutch, block it.
                        if (edge.fromNode === current && 'isEngaged' in edge.fromNode && !(edge.fromNode as any).isEngaged) {
                             continue;
                        }
                    }

                    visited.add(edge.toNode);
                    edge.toNode.setTheoreticalSpeed(currentSpeed * edge.ratio);
                    queue.push(edge.toNode);
                }
            }

            // Find all incoming edges (representing bidirectional mechanical connections)
            const incoming = this.connections.filter(c => c.toNode === current);
            for (const edge of incoming) {
                if (!visited.has(edge.fromNode)) {

                    if ('isEngaged' in edge.toNode && !(edge.toNode as any).isEngaged) {
                        continue;
                    }

                    visited.add(edge.fromNode);
                    // Reverse the ratio for reverse traversal
                    edge.fromNode.setTheoreticalSpeed(currentSpeed / edge.ratio);
                    queue.push(edge.fromNode);
                }
            }
        }
    }

    public getCapacity(): number { return this.currentCapacity; }
    public getStress(): number { return this.currentStress; }
    public getOverstressed(): boolean { return this.isOverstressed; }
}
