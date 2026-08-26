import { Belt, TransportedItem } from "./Belt";
import { Inventory } from "../machines/MechanicalPress";
import { BaseKineticNode } from "../kinetic/KineticNode";

export class Funnel {

    public targetInventory: Inventory | null = null;
    public targetBelt: Belt | null = null;
    public isExtracting: boolean = true;
    public rate: number = 1;

    constructor() {}

    public setTargets(inventory: Inventory, belt: Belt) {
        this.targetInventory = inventory;
        this.targetBelt = belt;
    }

    public tick(deltaTime: number) {
        if (!this.targetInventory || !this.targetBelt) return;

        if (this.isExtracting) {
            // Extract from inventory, put on belt
            if (this.targetInventory.items.length > 0) {
                const item = this.targetInventory.items[0];
                if (this.targetBelt.insertItem(item, 1)) {
                    this.targetInventory.items.shift();
                }
            }
        } else {
            // Take from belt, put in inventory
            // E.g. pulling from end of belt
            const index = this.targetBelt.items.findIndex(i => i.progress >= 0.99);
            if (index !== -1) {
                const item = this.targetBelt.items.splice(index, 1)[0];
                this.targetInventory.items.push(item.itemTypeId);
            }
        }
    }
}
