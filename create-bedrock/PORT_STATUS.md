# Create Mod Bedrock Port Status

## Current State
- **Core Logistics (Kinetics):** Implemented and verified via Jest.
  - RotationPropagator (Network splitting, BFS Traversal, Reverse Speed Prop)
  - TorquePropagator (Stress/Capacity calculations, dynamic overstress)
  - BlockStressValues Registry
- **Block Entities:**
  - Shaft, Cogwheel (Large/Small)
  - Creative Motor
  - Gearshift, Clutch, Gearbox
- **Rendering & VFX:**
  - `KineticRenderer` (Flywheel Instanced Render Bridge using Dummy Entities)
  - `KineticEffectHandler` (Particle spawning, sync state to dummy properties)
- **UI & Interaction:**
  - Goggles Actionbar Overlay
  - Wrench Rotation & Sneak Dismantling

## Next Tasks
- **Encased Shafts & Casings:** Implement Encased Shaft block states, logic, and rendering.
- **Belts & Pulleys:** Begin analyzing Java source for `KineticNetwork` tracking of belts, items on belts, and their visual representations.
- **Contraptions (Moving Structures):** Analyze and stub the architecture for turning block sub-networks into dynamic movable entities.

## Known Limitations (Bedrock Specific)
- **Visual Instancing:** We are using invisible dummy entities (`create:shaft_visual`) driven by Molang `query.property('create:speed')`. This works perfectly for smooth, data-driven animations, but spawns an entity per kinetic block. We must monitor engine limits on low-end devices.

## Known Bugs
- None currently. All 18 core Jest tests passing.
