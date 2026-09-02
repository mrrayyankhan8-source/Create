import { Carriage } from "./Carriage.js";
import { TrackGraph } from "../graph/TrackGraph.js";

/**
 * Port of com.simibubi.create.content.trains.entity.Train
 */
export class Train {
    public id: string;
    public carriages: Carriage[] = [];
    public graph: TrackGraph | null = null;
    public speed: number = 0;
    public throttle: number = 0;

    constructor(id: string) {
        this.id = id;
    }

    public addCarriage(carriage: Carriage): void {
        this.carriages.push(carriage);
    }

    public tick(): void {
        if (!this.graph) return;

        // Apply throttle to speed
        this.speed += this.throttle;

        // Move carriages along the graph
        for (const carriage of this.carriages) {
            carriage.travel(this.speed, this.graph);
        }
    }
}
