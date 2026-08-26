import { FluidTank, FluidStack } from "./Tank";

export class PipeNetwork {
    public tanks: FluidTank[] = [];
    public flowRate: number = 50; // mb/t

    public addTank(tank: FluidTank) {
        this.tanks.push(tank);
    }

    public tick(deltaTime: number) {
        // Balance fluids between connected tanks (simplified version of true fluid dynamics)
        if (this.tanks.length < 2) return;

        // Group by fluid type
        let totalAmount = 0;
        let activeFluidId: string | null = null;
        let totalCapacity = 0;

        for (const tank of this.tanks) {
            totalCapacity += tank.capacity;
            if (tank.fluid && tank.fluid.amount > 0) {
                if (!activeFluidId) {
                    activeFluidId = tank.fluid.fluidId;
                } else if (activeFluidId !== tank.fluid.fluidId) {
                    // Conflicting fluids in network - normally they'd block each other
                    continue;
                }
                totalAmount += tank.fluid.amount;
            }
        }

        if (activeFluidId && totalAmount > 0) {
            // Distribute evenly
            let targetFillRatio = totalAmount / totalCapacity;

            for (const tank of this.tanks) {
                let targetAmount = tank.capacity * targetFillRatio;
                let currentAmount = tank.getAmount();

                let diff = targetAmount - currentAmount;
                // Move fluid towards target, capped by flowRate
                let moveAmount = Math.sign(diff) * Math.min(Math.abs(diff), this.flowRate * (deltaTime / 0.05));

                if (moveAmount > 0) {
                    tank.fill(activeFluidId, moveAmount);
                } else if (moveAmount < 0) {
                    tank.drain(-moveAmount);
                }
            }
        }
    }
}
