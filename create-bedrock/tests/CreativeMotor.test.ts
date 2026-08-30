import { KineticNetwork } from "../scripts/create/kinetics/network/KineticNetwork.js";
import { CreativeMotorBlockEntity } from "../scripts/create/kinetics/block/CreativeMotorBlockEntity.js";
import { ShaftBlockEntity } from "../scripts/create/kinetics/block/ShaftBlockEntity.js";

class MockBlock {
    public dimension = {
        getEntitiesAtBlockLocation: (pos: any) => []
    };
    constructor(
        public location: import("@minecraft/server").Vector3,
        public face: string = "y"
    ) {}

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

class TestableShaft extends ShaftBlockEntity {
    public setTestStress(s: number) {
        this.stress = s;
    }
}

describe("CreativeMotor Integration", () => {
    it("should provide capacity to a network and power shafts", () => {
        const motorBlock = new MockBlock({ x: 0, y: 0, z: 0 }, "y");
        const motor = new CreativeMotorBlockEntity(motorBlock as any);

        const shaftBlock = new MockBlock({ x: 0, y: 1, z: 0 }, "y");
        const shaft = new TestableShaft(shaftBlock as any);
        shaft.setTestStress(50);
        shaft.setSpeed(16); // Fake propagation for test

        const network = new KineticNetwork(1);
        network.initialized = true;

        network.add(motor);
        network.add(shaft);

        expect((network as any).currentCapacity).toBe(16384 * 16); // generatedSpeed is 16
        expect((network as any).currentStress).toBe(50 * 16); // shaft stress * speed
    });
});
