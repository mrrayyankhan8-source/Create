jest.mock("@minecraft/server", () => ({
    ItemStack: class {
        constructor(public typeId: string, public amount: number) {}
        maxAmount = 64;
    }
}), { virtual: true });

import { MechanicalMixerBlockEntity } from "../scripts/create/kinetics/block/MechanicalMixerBlockEntity.js";
import { CrushingWheelBlockEntity } from "../scripts/create/kinetics/block/CrushingWheelBlockEntity.js";
import { KineticBlockManager } from "../scripts/create/kinetics/block/KineticBlockManager.js";

class MockBlock {
    public dimension = { id: "overworld" };
    constructor(public location: any, public typeId: string) {}

    get permutation() {
        return {
            getState: () => "up"
        };
    }
}

describe("Processing Machines", () => {
    beforeEach(() => {
        (KineticBlockManager as any).blockEntities.clear();
    });

    it("CrushingWheel should require a visual entity to dynamically spin", () => {
        const block = new MockBlock({x: 0, y: 0, z: 0}, "create:crushing_wheel");
        const wheel = new CrushingWheelBlockEntity(block as any);

        expect(wheel.needsVisualEntity()).toBe(true);
        expect(wheel.getVisualEntityId()).toBe("create:crushing_wheel_visual");
    });

    it("MechanicalMixer should manage running ticks and processing phases", () => {
        const block = new MockBlock({x: 0, y: 0, z: 0}, "create:mechanical_mixer");
        const mixer = new MechanicalMixerBlockEntity(block as any);

        mixer.setSpeed(128);
        mixer.startProcessingBasin(); // Simulate finding a recipe in basin

        expect(mixer.running).toBe(true);
        expect(mixer.runningTicks).toBe(0);

        // Lower the mixer head (0 to 20 ticks)
        for (let i = 0; i < 20; i++) {
            mixer.tick();
        }

        expect(mixer.runningTicks).toBe(20);

        // Next tick triggers the processor calculation (we must tick ON 20)
        mixer.tick();
        expect(mixer.processingTicks).toBeGreaterThan(0);

        // Process (Wait for processing ticks to resolve)
        const expectedProcessTicks = mixer.processingTicks;
        for (let i = 0; i < expectedProcessTicks; i++) {
            mixer.tick();
        }

        // Head should raise back up (21 to 40)
        for (let i = 0; i < 19; i++) {
            mixer.tick();
        }

        expect(mixer.running).toBe(false);
    });
});
