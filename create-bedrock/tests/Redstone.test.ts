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
