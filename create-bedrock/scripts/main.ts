import { system, world } from "@minecraft/server";
import { initializeKineticsEvents } from "./create/kinetics/block/registry/KineticRegistration.js";
import { KineticBlockManager } from "./create/kinetics/block/KineticBlockManager.js";

console.log("[Create] Initializing Bedrock Port Backend");
initializeKineticsEvents();

system.runInterval(() => {
    KineticBlockManager.tickAll();
}, 1);
