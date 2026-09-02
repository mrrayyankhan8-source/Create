import { Train } from "../entity/Train.js";

/**
 * Port of com.simibubi.create.content.trains.signal.SignalEdgeGroup
 */
export class SignalEdgeGroup {
    public id: string;
    public trains: Set<Train> = new Set();
    public intersecting: Map<string, string> = new Map();
    public intersectingResolved: Set<SignalEdgeGroup> = new Set();
    public fallbackGroup: boolean = false;

    constructor(id: string) {
        this.id = id;
    }

    public isOccupiedUnless(train: Train | null): boolean {
        if (this.intersectingResolved.size === 0) {
            this.walkIntersecting(g => this.intersectingResolved.add(g));
        }

        for (const group of this.intersectingResolved) {
            if (group.isThisOccupiedUnless(train)) return true;
        }
        return false;
    }

    private isThisOccupiedUnless(train: Train | null): boolean {
        if (train && this.trains.has(train) && this.trains.size === 1) return false;
        return this.trains.size > 0;
    }

    private walkIntersecting(callback: (g: SignalEdgeGroup) => void): void {
        this.walkIntersectingRec(new Set(), callback);
    }

    private walkIntersectingRec(visited: Set<SignalEdgeGroup>, callback: (g: SignalEdgeGroup) => void): void {
        if (visited.has(this)) return;
        visited.add(this);
        callback(this);

        // Full impl would look up global registry for edge groups based on IDs in this.intersecting
    }

    public occupy(train: Train): void {
        this.trains.add(train);
    }

    public vacate(train: Train): void {
        this.trains.delete(train);
    }
}
