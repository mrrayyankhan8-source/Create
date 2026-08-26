import { TrackGraph } from "./TrackGraph";
import { Vector3 } from "../utilities/Math";

export class TrainPhysics {

    public id: string;

    public speed: number = 0;
    public position: number = 0; // Distance along current edge

    public maxSpeed: number = 20; // units per second
    public acceleration: number = 5;
    public brakingForce: number = 10;
    public mass: number = 1000;

    public targetSpeed: number = 0;

    // Pathing
    public currentPath: string[] = []; // List of node IDs
    public currentPathIndex: number = 0;
    public trackGraph: TrackGraph | null = null;

    constructor(id: string) {
        this.id = id;
    }

    public assignPath(graph: TrackGraph, path: string[]) {
        this.trackGraph = graph;
        this.currentPath = path;
        this.currentPathIndex = 0;
        this.position = 0;
    }

    public tick(deltaTime: number) {
        if (!this.trackGraph || this.currentPath.length < 2) return;

        // Kinematics
        if (this.speed < this.targetSpeed) {
            this.speed += this.acceleration * deltaTime;
            if (this.speed > this.targetSpeed) this.speed = this.targetSpeed;
        } else if (this.speed > this.targetSpeed) {
            this.speed -= this.brakingForce * deltaTime;
            if (this.speed < this.targetSpeed) this.speed = this.targetSpeed;
        }

        // Distance covered this tick
        const distanceToMove = this.speed * deltaTime;

        if (distanceToMove > 0 && this.currentPathIndex < this.currentPath.length - 1) {
            const nodeA = this.trackGraph.nodes.get(this.currentPath[this.currentPathIndex])!;
            const nodeB = this.trackGraph.nodes.get(this.currentPath[this.currentPathIndex + 1])!;

            const edgeLength = nodeA.position.distanceTo(nodeB.position);

            this.position += distanceToMove;

            if (this.position >= edgeLength) {
                // Moving to next edge
                this.position -= edgeLength;
                this.currentPathIndex++;

                if (this.currentPathIndex >= this.currentPath.length - 1) {
                    // Reached destination
                    this.speed = 0;
                    this.targetSpeed = 0;
                    this.position = 0;
                }
            }
        }
    }
}
