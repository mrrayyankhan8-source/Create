import { Vector3 } from "@minecraft/server";

export class TrackNode {
    public id: string;
    public location: Vector3;

    constructor(id: string, location: Vector3) {
        this.id = id;
        this.location = location;
    }
}
