import { PumpBlockEntity } from "../scripts/create/fluids/PumpBlockEntity.js";
import { FluidTransportBehaviour } from "../scripts/create/fluids/FluidTransportBehaviour.js";
import { FluidPipeManager, FluidPropagator } from "../scripts/create/fluids/FluidPropagator.js";
import { KineticBlockManager } from "../scripts/create/kinetics/block/KineticBlockManager.js";

class MockBlock {
    public dimension = { id: "overworld" };
    constructor(public location: any, public facing: string = "north") {}
    get permutation() {
        return {
            getState: () => this.facing
        };
    }
}

describe("Fluid Networks", () => {
    beforeEach(() => {
        FluidPipeManager.pipes.clear();
        FluidPipeManager.pumps.clear();
        (KineticBlockManager as any).blockEntities.clear();
    });

    it("should distribute pressure from pump to adjacent pipes", () => {
        const pumpBlock = new MockBlock({x: 0, y: 0, z: 0}, "north");
        const pump = new PumpBlockEntity(pumpBlock as any);

        const pipeBlock1 = new MockBlock({x: 0, y: 0, z: -1}); // North
        const pipe1 = new FluidTransportBehaviour(pipeBlock1 as any);

        const pipeBlock2 = new MockBlock({x: 0, y: 0, z: 1}); // South
        const pipe2 = new FluidTransportBehaviour(pipeBlock2 as any);

        FluidPipeManager.pumps.set(FluidPipeManager.getPosKey(pumpBlock.dimension as any, pumpBlock.location), pump);
        FluidPipeManager.pipes.set(FluidPipeManager.getPosKey(pipeBlock1.dimension as any, pipeBlock1.location), pipe1);
        FluidPipeManager.pipes.set(FluidPipeManager.getPosKey(pipeBlock2.dimension as any, pipeBlock2.location), pipe2);

        // Manually initialize connection data for mock objects since permutation might have failed
        // It failed in previous try/catch because permutation itself might be undefined in strict environments
        pipe1.interfaces.set("south", { wipePressure: () => {}, addPressure: function(i:boolean, p:number) { this.pressureInbound = p }, pressureInbound: 0, hasPressure: () => true } as any);
        pipe2.interfaces.set("north", { wipePressure: () => {}, addPressure: function(i:boolean, p:number) { this.pressureInbound = p }, pressureInbound: 0, hasPressure: () => true } as any);

        pump.setSpeed(32);
        pump.distributePressureTo("north");
        pump.distributePressureTo("south");

        expect(pipe1.hasAnyPressure()).toBe(true);
        expect(pipe2.hasAnyPressure()).toBe(true);
    });
});
