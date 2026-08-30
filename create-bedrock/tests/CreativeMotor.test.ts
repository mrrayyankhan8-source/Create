import { KineticNetwork } from "../scripts/create/kinetics/network/KineticNetwork.js";
import { CreativeMotorBlockEntity } from "../scripts/create/kinetics/block/CreativeMotorBlockEntity.js";
import { ShaftBlockEntity } from "../scripts/create/kinetics/block/ShaftBlockEntity.js";
import { initializeStressDefaults } from "../scripts/create/api/stress/BlockStressDefaults.js";
import { BlockStressValues } from "../scripts/create/api/stress/BlockStressValues.js";

class MockBlock {
    public dimension = {
        id: "overworld",
        getEntitiesAtBlockLocation: (pos: any) => []
    };
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

describe("CreativeMotor Integration", () => {
    beforeAll(() => {
        initializeStressDefaults();
        BlockStressValues.registerImpact("create:test_machine", () => 50);
    });

    it("should provide capacity to a network and calculate stress correctly via registry", () => {
        const motorBlock = new MockBlock({ x: 0, y: 0, z: 0 }, "y", "create:creative_motor");
        const motor = new CreativeMotorBlockEntity(motorBlock as any);

        const shaftBlock = new MockBlock({ x: 0, y: 1, z: 0 }, "y", "create:test_machine");
        const shaft = new ShaftBlockEntity(shaftBlock as any);
        shaft.setSpeed(16);

        const network = new KineticNetwork(1, "overworld");
        network.initialized = true;

        network.add(motor);
        network.add(shaft);

        expect((network as any).currentCapacity).toBe(16384 * 16);
        expect((network as any).currentStress).toBe(50 * 16);
    });
});
