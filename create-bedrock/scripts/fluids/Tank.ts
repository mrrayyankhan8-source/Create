export interface FluidStack {
    fluidId: string;
    amount: number;
}

export class FluidTank {
    public id: string;
    public capacity: number;
    public fluid: FluidStack | null = null;

    constructor(id: string, capacity: number = 1000) {
        this.id = id;
        this.capacity = capacity;
    }

    public getAmount(): number {
        return this.fluid ? this.fluid.amount : 0;
    }

    public fill(fluidId: string, amount: number): number {
        if (this.fluid && this.fluid.fluidId !== fluidId && this.fluid.amount > 0) {
            return 0; // Cannot mix fluids
        }

        let space = this.capacity - this.getAmount();
        let filled = Math.min(amount, space);

        if (filled > 0) {
            if (!this.fluid) {
                this.fluid = { fluidId, amount: filled };
            } else {
                this.fluid.amount += filled;
            }
        }
        return filled;
    }

    public drain(amount: number): FluidStack | null {
        if (!this.fluid || this.fluid.amount === 0) return null;

        let drained = Math.min(amount, this.fluid.amount);
        let drainedStack = { fluidId: this.fluid.fluidId, amount: drained };

        this.fluid.amount -= drained;
        if (this.fluid.amount === 0) {
            this.fluid = null;
        }
        return drainedStack;
    }
}
