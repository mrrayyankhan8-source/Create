import { FluidTank } from "../scripts/fluids/Tank";
import { PipeNetwork } from "../scripts/fluids/PipeNetwork";
import { Pump } from "../scripts/fluids/Pump";

describe("Fluid Simulation", () => {
    test("Tank fills and drains correctly", () => {
        const tank = new FluidTank("tank1", 1000);

        expect(tank.fill("water", 500)).toBe(500);
        expect(tank.getAmount()).toBe(500);

        // Cannot mix fluids
        expect(tank.fill("lava", 500)).toBe(0);
        expect(tank.getAmount()).toBe(500);

        // Overfill protection
        expect(tank.fill("water", 600)).toBe(500);
        expect(tank.getAmount()).toBe(1000);

        // Drain
        const drained = tank.drain(200);
        expect(drained?.fluidId).toBe("water");
        expect(drained?.amount).toBe(200);
        expect(tank.getAmount()).toBe(800);
    });

    test("PipeNetwork balances fluids", () => {
        const tankA = new FluidTank("A", 1000);
        const tankB = new FluidTank("B", 1000);

        tankA.fill("water", 1000);

        const network = new PipeNetwork();
        network.addTank(tankA);
        network.addTank(tankB);

        // Tick until balanced (10 ticks at 50 flow rate = 500 transferred)
        for (let i = 0; i < 10; i++) {
            network.tick(0.05); // 1 tick
        }

        expect(tankA.getAmount()).toBe(500);
        expect(tankB.getAmount()).toBe(500);
    });

    test("Pump moves fluid based on kinetic speed", () => {
        const source = new FluidTank("src", 1000);
        const dest = new FluidTank("dest", 1000);
        source.fill("water", 1000);

        const pump = new Pump("pump1");
        pump.setConnections(source, dest);

        // Unpowered, shouldn't move
        pump.tick(0.05);
        expect(dest.getAmount()).toBe(0);

        // Powered forward (16 speed = 16 mb/tick)
        pump.setSpeed(16);
        pump.tick(0.05);
        expect(dest.getAmount()).toBe(16);
        expect(source.getAmount()).toBe(984);

        // Powered reverse (-16 speed)
        pump.setSpeed(-16);
        pump.tick(0.05);
        expect(dest.getAmount()).toBe(0);
        expect(source.getAmount()).toBe(1000);
    });
});
