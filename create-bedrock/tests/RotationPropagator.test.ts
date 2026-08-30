import { RotationPropagator } from "../scripts/create/kinetics/propagation/RotationPropagator.js";
import { ShaftBlockEntity } from "../scripts/create/kinetics/block/ShaftBlockEntity.js";
import { CogwheelBlockEntity } from "../scripts/create/kinetics/block/CogwheelBlockEntity.js";
import { KineticBlockEntity } from "../scripts/create/kinetics/block/KineticBlockEntity.js";
import { Vector3, Block } from "@minecraft/server";

// Mocking dependencies
class MockBlock {
    constructor(
        public location: Vector3,
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

describe("RotationPropagator", () => {
    it("should propagate speed correctly for connected shafts", () => {
        const b1 = new MockBlock({ x: 0, y: 0, z: 0 }, "y");
        const b2 = new MockBlock({ x: 0, y: 1, z: 0 }, "y");

        const shaft1 = new ShaftBlockEntity(b1 as any);
        const shaft2 = new ShaftBlockEntity(b2 as any);

        const modifier = RotationPropagator.getRotationSpeedModifier(shaft1, shaft2);
        expect(modifier).toBe(1.0);
    });

    it("should propagate reverse speed for adjacent small cogwheels", () => {
        const b1 = new MockBlock({ x: 0, y: 0, z: 0 }, "y");
        const b2 = new MockBlock({ x: 1, y: 0, z: 0 }, "y");

        const cog1 = new CogwheelBlockEntity(b1 as any, false);
        const cog2 = new CogwheelBlockEntity(b2 as any, false);

        const modifier = RotationPropagator.getRotationSpeedModifier(cog1, cog2);
        expect(modifier).toBe(-1.0);
    });

    it("should propagate reverse double speed from large to small cogwheel", () => {
        const b1 = new MockBlock({ x: 0, y: 0, z: 0 }, "y");
        const b2 = new MockBlock({ x: 1, y: 0, z: 0 }, "x"); // Different axis

        const largeCog = new CogwheelBlockEntity(b1 as any, true);
        const smallCog = new CogwheelBlockEntity(b2 as any, false);

        const modifier = RotationPropagator.getRotationSpeedModifier(largeCog, smallCog);
        expect(modifier).toBe(-2.0);
    });

    it("should propagate reverse half speed from small to large cogwheel", () => {
        const b1 = new MockBlock({ x: 0, y: 0, z: 0 }, "x");
        const b2 = new MockBlock({ x: 1, y: 0, z: 0 }, "y");

        const smallCog = new CogwheelBlockEntity(b1 as any, false);
        const largeCog = new CogwheelBlockEntity(b2 as any, true);

        const modifier = RotationPropagator.getRotationSpeedModifier(smallCog, largeCog);
        expect(modifier).toBe(-0.5);
    });

    it("should return 0 for unaligned shafts", () => {
        const b1 = new MockBlock({ x: 0, y: 0, z: 0 }, "y");
        const b2 = new MockBlock({ x: 0, y: 1, z: 0 }, "x");

        const shaft1 = new ShaftBlockEntity(b1 as any);
        const shaft2 = new ShaftBlockEntity(b2 as any);

        const modifier = RotationPropagator.getRotationSpeedModifier(shaft1, shaft2);
        expect(modifier).toBe(0);
    });
});
