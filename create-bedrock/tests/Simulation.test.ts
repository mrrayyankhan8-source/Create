import { KineticNetwork } from "../scripts/kinetic/KineticNetwork";
import { BaseKineticNode } from "../scripts/kinetic/KineticNode";
import { MechanicalPress, MachineState } from "../scripts/machines/MechanicalPress";
import { Belt } from "../scripts/logistics/Belt";

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

describe("Kinetic Network Simulation", () => {
    test("Network correctly calculates speed and capacity without stress", () => {
        const network = new KineticNetwork(1);
        const motor = new Motor("motor1", 16, 512); // 16 RPM, 512 capacity per RPM (Total 8192)
        const press = new MechanicalPress("press1"); // 8 stress per RPM (Total 128)

        network.addNode(motor);
        network.addNode(press);

        // Direct connection 1:1
        network.addConnection(motor, press, 1.0);

        network.recalculate();

        expect(network.getCapacity()).toBe(8192); // 16 * 512
        expect(network.getStress()).toBe(128);    // 16 * 8
        expect(network.getOverstressed()).toBe(false);

        expect(press.getSpeed()).toBe(16);
    });

    test("Network applies gear ratios correctly", () => {
        const network = new KineticNetwork(2);
        const motor = new Motor("motor2", 16, 512);
        const press = new MechanicalPress("press2");

        network.addNode(motor);
        network.addNode(press);

        // Gearing down: press spins at half speed
        network.addConnection(motor, press, 0.5);

        network.recalculate();

        expect(press.getSpeed()).toBe(8);
        expect(network.getStress()).toBe(64); // 8 RPM * 8 stress = 64
    });

    test("Network overstresses and halts", () => {
        const network = new KineticNetwork(3);
        const motor = new Motor("motor3", 16, 2); // 16 * 2 = 32 capacity
        const press = new MechanicalPress("press3"); // 16 * 8 = 128 stress

        network.addNode(motor);
        network.addNode(press);

        network.addConnection(motor, press, 1.0);

        network.recalculate();

        expect(network.getCapacity()).toBe(32);
        expect(network.getStress()).toBe(128);
        expect(network.getOverstressed()).toBe(true);

        // Speed should be halted
        expect(press.getSpeed()).toBe(0);
        expect(motor.getSpeed()).toBe(0);
    });
});

describe("Mechanical Press Simulation", () => {
    test("Press cycles and processes item", () => {
        const press = new MechanicalPress("press1");
        press.setSpeed(100); // Fast speed for testing

        const inventory = { items: ["iron_ingot"] };
        press.setInventoryBeneath(inventory);

        expect(press.state).toBe(MachineState.IDLE);

        // Start extension
        press.tick(1.0);
        expect(press.state).toBe(MachineState.EXTENDING);

        // Finish extension
        press.tick(1.0);
        expect(press.state).toBe(MachineState.PRESSING);

        // Tick processing state
        press.tick(1.0);
        expect(press.state).toBe(MachineState.RETRACTING);

        // Item should be processed now
        expect(inventory.items[0]).toBe("iron_sheet");

        // Finish retraction
        press.tick(1.0);
        expect(press.state).toBe(MachineState.IDLE);
    });
});

describe("Belt Simulation", () => {
    test("Belt transports item and handles collision", () => {
        const belt = new Belt("belt1", 2.0); // Length 2.0
        belt.setSpeed(10);

        expect(belt.insertItem("stone", 1)).toBe(true);

        // Move item halfway
        // Step = (10 * 1.0 * 0.1) / 2.0 = 0.5 progress per tick
        belt.tick(1.0);
        expect(belt.items[0].progress).toBe(0.5);

        // Insert second item
        expect(belt.insertItem("dirt", 1)).toBe(true);

        // Move another tick. Item 1 hits 1.0. Item 2 hits 0.5.
        belt.tick(1.0);
        expect(belt.items[0].progress).toBe(1.0);
        expect(belt.items[1].progress).toBe(0.5);

        // Next tick, item 1 can't move past 1.0. Item 2 hits item 1.
        // Item spacing is 0.1 / 2.0 = 0.05. Max progress for item 2 is 0.95.
        belt.tick(1.0);
        expect(belt.items[0].progress).toBe(1.0);
        expect(belt.items[1].progress).toBeCloseTo(0.95);

        // Extract item 1
        const extracted = belt.extractItem();
        expect(extracted?.itemTypeId).toBe("stone");

        // Item 2 can now advance to 1.0
        belt.tick(1.0);
        expect(belt.items[0].itemTypeId).toBe("dirt");
        expect(belt.items[0].progress).toBe(1.0);
    });
});
