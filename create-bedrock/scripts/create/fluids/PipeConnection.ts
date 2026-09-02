import { FluidStack } from "./FluidStack.js";

/**
 * Port of com.simibubi.create.content.fluids.PipeConnection
 */
export class PipeConnection {
    public side: string;
    public pressureInbound: number = 0;
    public pressureOutbound: number = 0;

    public fluid: FluidStack = FluidStack.EMPTY;

    constructor(side: string) {
        this.side = side;
    }

    public wipePressure(): void {
        this.pressureInbound = 0;
        this.pressureOutbound = 0;
    }

    public addPressure(inbound: boolean, pressure: number): void {
        if (inbound) {
            this.pressureInbound += pressure;
        } else {
            this.pressureOutbound += pressure;
        }
    }

    public hasPressure(): boolean {
        return this.pressureInbound > 0 || this.pressureOutbound > 0;
    }

    public getProvidedFluid(): FluidStack {
        // Stub: Normally tracks flow progression across ticks.
        return this.fluid;
    }
}
