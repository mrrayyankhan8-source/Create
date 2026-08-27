import { KineticNetwork } from "../scripts/kinetic/KineticNetwork";
import { BaseKineticNode } from "../scripts/kinetic/KineticNode";
import { Clutch } from "../scripts/redstone/Clutch";

class Motor extends BaseKineticNode {
    private generatedSpeed: number;
    private generatedCapacity: number;

    constructor(id: string, speed: number, capacity: number) {
        super(id);
        this.isSource = true;
        this.generatedSpeed = speed;
        this.generatedCapacity = capacity;
    }

    getGeneratedSpeed(): number { return this.generatedSpeed; }
    getGeneratedCapacity(): number { return this.generatedCapacity; }
}

describe("Redstone Clutch Simulation", () => {
    test("Clutch engages and disengages network properly", () => {
        const network = new KineticNetwork(1);
        const motor = new Motor("motor1", 16, 512);
        const clutch = new Clutch("clutch1");
        // We cannot instantiate abstract BaseKineticNode directly, create anonymous extended class
        class MockMachine extends BaseKineticNode {
            getStressImpact() { return 4; }
        }
        const machine = new MockMachine("machine1");

        network.addNode(motor);
        network.addNode(clutch);
        network.addNode(machine);

        // Connect motor -> clutch -> machine
        network.addConnection(motor, clutch, 1.0);
        network.addConnection(clutch, machine, 1.0);

        network.recalculate();

        // Initially engaged
        expect(clutch.isEngaged).toBe(true);
        expect(machine.getSpeed()).toBe(16);
        expect(network.getStress()).toBe(64); // clutch(0) + machine(16*4)

        // Power the clutch (disengage)
        clutch.setRedstonePower(15);

        expect(clutch.isEngaged).toBe(false);
        expect(machine.getSpeed()).toBe(0); // Network propagation halted by clutch
        expect(network.getStress()).toBe(0); // Only active nodes add stress
    });
});

import { RedstoneLink, RedstoneNetwork } from "../scripts/redstone/RedstoneLink";

describe('RedstoneNetwork Simulation', () => {
    beforeEach(() => {
        RedstoneNetwork.clear();
    });

    test('Transmitters broadcast max power to receivers on same frequency', () => {
        const tx1 = new RedstoneLink("tx1", {x:0, y:0, z:0}, "stone", "wood");
        tx1.isTransmitter = true;
        RedstoneNetwork.register(tx1);

        const tx2 = new RedstoneLink("tx2", {x:1, y:0, z:0}, "stone", "wood");
        tx2.isTransmitter = true;
        RedstoneNetwork.register(tx2);

        const rx1 = new RedstoneLink("rx1", {x:10, y:0, z:0}, "stone", "wood");
        RedstoneNetwork.register(rx1);

        const rx2_wrong_freq = new RedstoneLink("rx2", {x:20, y:0, z:0}, "stone", "gold");
        RedstoneNetwork.register(rx2_wrong_freq);

        expect(rx1.getPower()).toBe(0);

        tx1.setPower(5);
        expect(rx1.getPower()).toBe(5);

        tx2.setPower(15);
        expect(rx1.getPower()).toBe(15);

        // Decrease tx2, max should still fall back to tx1
        tx2.setPower(0);
        expect(rx1.getPower()).toBe(5);

        expect(rx2_wrong_freq.getPower()).toBe(0);
    });
});
