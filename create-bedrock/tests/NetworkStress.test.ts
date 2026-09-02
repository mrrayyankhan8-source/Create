import { Dimension, Vector3 } from "@minecraft/server";
import { KineticBlockManager } from "../scripts/create/kinetics/block/KineticBlockManager.js";
import { CreativeMotorBlockEntity } from "../scripts/create/kinetics/block/CreativeMotorBlockEntity.js";
import { ShaftBlockEntity } from "../scripts/create/kinetics/block/ShaftBlockEntity.js";
import { TorquePropagator } from "../scripts/create/kinetics/network/TorquePropagator.js";
import { RotationPropagator } from "../scripts/create/kinetics/propagation/RotationPropagator.js";
import { BlockStressValues } from "../scripts/create/api/stress/BlockStressValues.js";

class MockBlock {
    public dimension = { id: "overworld", getEntitiesAtBlockLocation: (pos: any) => [] };
    constructor(
        public location: Vector3,
        public typeId: string
    ) {}

    get permutation() {
        return {
            getState: (name: string) => {
                if (name === "minecraft:block_face") return "y";
                return undefined;
            }
        };
    }
}

describe("Network Stress and Capacity", () => {
    beforeAll(() => {
        BlockStressValues.registerImpact("create:heavy_machine", () => 512); // Speed * 512 = stress
        BlockStressValues.registerCapacity("create:creative_motor", () => 16384); // Speed * 16384 = capacity
        BlockStressValues.registerCapacity("create:weak_motor", () => 256); // Speed * 256 = capacity
    });

    beforeEach(() => {
        (KineticBlockManager as any).blockEntities.clear();
    });

    it("should accurately distribute stress and not overstress if under capacity", () => {
        const motor = new CreativeMotorBlockEntity(new MockBlock({x: 0, y: 0, z: 0}, "create:creative_motor") as any);
        const machine1 = new ShaftBlockEntity(new MockBlock({x: 0, y: 1, z: 0}, "create:heavy_machine") as any);
        const machine2 = new ShaftBlockEntity(new MockBlock({x: 0, y: 2, z: 0}, "create:heavy_machine") as any);

        KineticBlockManager.register(motor.block.dimension as any, motor.block.location, motor);
        KineticBlockManager.register(machine1.block.dimension as any, machine1.block.location, machine1);
        KineticBlockManager.register(machine2.block.dimension as any, machine2.block.location, machine2);

        (motor as any).getAxis = () => "y";
        (machine1 as any).getAxis = () => "y";
        (machine2 as any).getAxis = () => "y";

        motor.setSpeed(16);
        motor.setSource(motor.block.location);

        RotationPropagator.handleAdded(motor);

        // Emulate the world ticking update calls
        KineticBlockManager.tickAll();

        expect(motor.isOverStressed()).toBe(false);
        expect(machine1.isOverStressed()).toBe(false);
        expect(machine2.isOverStressed()).toBe(false);

        expect(motor.getSpeed()).toBe(16);
        expect(machine2.getSpeed()).toBe(16);
    });

    it("should overstress and halt the network if impact exceeds capacity", () => {
        const motor = new CreativeMotorBlockEntity(new MockBlock({x: 0, y: 0, z: 0}, "create:weak_motor") as any);
        const machine1 = new ShaftBlockEntity(new MockBlock({x: 0, y: 1, z: 0}, "create:heavy_machine") as any);

        KineticBlockManager.register(motor.block.dimension as any, motor.block.location, motor);
        KineticBlockManager.register(machine1.block.dimension as any, machine1.block.location, machine1);

        (motor as any).getAxis = () => "y";
        (machine1 as any).getAxis = () => "y";

        motor.setSpeed(16);
        motor.setSource(motor.block.location);

        RotationPropagator.handleAdded(motor);

        // Weak motor: 256. Heavy machine: 512.

        // Emulate the world ticking update calls
        KineticBlockManager.tickAll();

        expect(motor.isOverStressed()).toBe(true);
        expect(machine1.isOverStressed()).toBe(true);

        // The speed should be 0 because it's overstressed
        expect(machine1.getSpeed()).toBe(0);
    });
});
