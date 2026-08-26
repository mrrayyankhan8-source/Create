import { Location } from "../core/BedrockAdapter";
import { TransportedItem } from "./Belt";

export class Chute {
    public id: string;
    public location: Location;

    public itemQueue: TransportedItem[] = [];
    public capacity: number = 16;

    constructor(id: string, location: Location) {
        this.id = id;
        this.location = location;
    }

    public canInsert(): boolean {
        return this.itemQueue.length < this.capacity;
    }

    public insert(item: TransportedItem): boolean {
        if (this.canInsert()) {
            this.itemQueue.push(item);
            return true;
        }
        return false;
    }

    public extract(): TransportedItem | null {
        if (this.itemQueue.length > 0) {
            return this.itemQueue.shift()!;
        }
        return null;
    }

    public tick() {
        // Gravity logic: pull from inventory above, push to inventory/chute below
        // This would interact with the block directly above/below using BedrockAdapter
    }
}
