import { ItemStack } from "@minecraft/server";

export class TransportedItemStack {
    public stack: ItemStack;
    public beltPosition: number = 0;
    public prevBeltPosition: number = 0;
    public sideOffset: number = 0;
    public prevSideOffset: number = 0;
    public insertedAt: number = 0;
    public insertedFrom: string = "up";
    public locked: boolean = false;

    constructor(stack: ItemStack) {
        this.stack = stack;
    }

    public copy(): TransportedItemStack {
        const copy = new TransportedItemStack(this.stack.clone());
        copy.beltPosition = this.beltPosition;
        copy.prevBeltPosition = this.prevBeltPosition;
        copy.sideOffset = this.sideOffset;
        copy.prevSideOffset = this.prevSideOffset;
        copy.insertedAt = this.insertedAt;
        copy.insertedFrom = this.insertedFrom;
        copy.locked = this.locked;
        return copy;
    }

    public getTargetSideOffset(): number {
        return 0; // We keep items aligned to center locally
    }
}
