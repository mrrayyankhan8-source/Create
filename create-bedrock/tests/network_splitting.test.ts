import { KineticNetwork } from "../scripts/create/kinetics/network/KineticNetwork.js";
import { TorquePropagator } from "../scripts/create/kinetics/network/TorquePropagator.js";
import { RotationPropagator } from "../scripts/create/kinetics/propagation/RotationPropagator.js";
import { CreativeMotorBlockEntity } from "../scripts/create/kinetics/block/CreativeMotorBlockEntity.js";
import { ShaftBlockEntity } from "../scripts/create/kinetics/block/ShaftBlockEntity.js";
import { KineticBlockManager } from "../scripts/create/kinetics/block/KineticBlockManager.js";
import { initializeStressDefaults } from "../scripts/create/api/stress/BlockStressDefaults.js";
import { BlockStressValues } from "../scripts/create/api/stress/BlockStressValues.js";

class MockBlock {
    public dimension = { id: "overworld", getEntitiesAtBlockLocation: (pos: any) => [] };
    public typeId: string;
    constructor(
        public location: import("@minecraft/server").Vector3,
        public face: string = "y",
        typeId: string = "create:shaft"
    ) {
        this.typeId = typeId;
    }

    get permutation() {
        return {
            getState: (name: string) => {
                if (name === "minecraft:block_face") {
                    if (this.face === "y") return "up";
                    if (this.face === "x") return "east";
                    if (this.face === "z") return "north";
                }
                return undefined;
            }
        };
    }
}

describe("Network Splitting and Merging", () => {
    beforeEach(() => {
        (KineticBlockManager as any).blockEntities.clear();
        initializeStressDefaults();
        BlockStressValues.registerImpact("create:test_machine", () => 50);
    });

    it("should correctly handle removal of a node and propagation of missing source", () => {
        const motorBlock = new MockBlock({ x: 0, y: 0, z: 0 }, "y", "create:creative_motor");
        const motor = new CreativeMotorBlockEntity(motorBlock as any);

        const shaftBlock1 = new MockBlock({ x: 0, y: 1, z: 0 }, "y", "create:test_machine");
        const shaft1 = new ShaftBlockEntity(shaftBlock1 as any);

        const shaftBlock2 = new MockBlock({ x: 0, y: 2, z: 0 }, "y", "create:test_machine");
        const shaft2 = new ShaftBlockEntity(shaftBlock2 as any);

        (motor as any).getAxis = () => "y";
        (shaft1 as any).getAxis = () => "y";
        (shaft2 as any).getAxis = () => "y";

        KineticBlockManager.register(motorBlock.dimension as any, motorBlock.location, motor);
        KineticBlockManager.register(shaftBlock1.dimension as any, shaftBlock1.location, shaft1);
        KineticBlockManager.register(shaftBlock2.dimension as any, shaftBlock2.location, shaft2);

        motor.setSpeed(16);
        motor.setSource(motor.block.location);

        const network = motor.getOrCreateNetwork();
        network.add(motor);

        RotationPropagator.handleAdded(motor);

        // Verify connected!
        expect(shaft1.getSpeed()).toBe(16);
        expect(shaft2.getSpeed()).toBe(16);

        // Let's debug what neighbors are found when shaft1 is removed
        // Shaft1 is connected to Shaft2 via RotationPropagator.getConnectedNeighbours
        // We know missingSource is {x:0, y:0, z:0}

        // Remove shaft 1
        KineticBlockManager.remove(shaftBlock1.dimension as any, shaftBlock1.location);

        // Need to run tickAll so that pending removals/recalculations are processed
        KineticBlockManager.tickAll();

        expect(shaft2.getSpeed()).toBe(0);
        expect(shaft2.hasSource()).toBe(false);
        expect(network.members.has(shaft2)).toBe(false);
    });
});
