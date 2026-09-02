export class FluidStack {
    public fluidId: string;
    public amount: number;

    constructor(fluidId: string, amount: number) {
        this.fluidId = fluidId;
        this.amount = amount;
    }

    public static get EMPTY(): FluidStack {
        return new FluidStack("minecraft:empty", 0);
    }

    public isEmpty(): boolean {
        return this.amount <= 0 || this.fluidId === "minecraft:empty";
    }

    public static isSameFluid(a: FluidStack, b: FluidStack): boolean {
        return a.fluidId === b.fluidId;
    }
}
