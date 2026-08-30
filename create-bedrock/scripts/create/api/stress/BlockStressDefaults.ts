import { BlockStressValues } from "./BlockStressValues.js";

/**
 * Initializes the default Create Java stress values mimicking BlockStressDefaults.
 */
export function initializeStressDefaults() {
    // Capacities (values at 1 RPM, typically these are config driven in Java but default here)
    BlockStressValues.registerCapacity("create:creative_motor", () => 16384);
    BlockStressValues.registerCapacity("create:water_wheel", () => 16);
    BlockStressValues.registerCapacity("create:large_water_wheel", () => 32);
    BlockStressValues.registerCapacity("create:windmill_bearing", () => 512);
    BlockStressValues.registerCapacity("create:steam_engine", () => 1024);

    // Impacts (values at 1 RPM)
    BlockStressValues.registerImpact("create:shaft", () => 0);
    BlockStressValues.registerImpact("create:cogwheel", () => 0);
    BlockStressValues.registerImpact("create:large_cogwheel", () => 0);
    BlockStressValues.registerImpact("create:gearbox", () => 0);
    BlockStressValues.registerImpact("create:clutch", () => 0);
    BlockStressValues.registerImpact("create:gearshift", () => 0);
    BlockStressValues.registerImpact("create:mechanical_press", () => 8);
    BlockStressValues.registerImpact("create:mechanical_mixer", () => 4);
    BlockStressValues.registerImpact("create:mechanical_drill", () => 4);
    BlockStressValues.registerImpact("create:mechanical_saw", () => 4);
    BlockStressValues.registerImpact("create:encased_fan", () => 2);
    BlockStressValues.registerImpact("create:millstone", () => 4);
    BlockStressValues.registerImpact("create:crushing_wheel", () => 8);
}
