# Create Mod Bedrock Port Status

## Current State
- **Core Logistics (Kinetics):**
  - RotationPropagator (Network splitting, BFS Traversal, Reverse Speed Prop)
  - TorquePropagator (Stress/Capacity calculations, dynamic overstress)
  - BlockStressValues Registry
- **Block Entities:**
  - Shaft, Cogwheel (Large/Small), Encased Shafts
  - Creative Motor
  - Gearshift, Clutch, Gearbox
  - BeltBlockEntity & BeltInventory
- **Transport / Logistics:**
  - Mechanical Belts: Linear item movement simulation based on kinetic speed
  - `TransportedItemStack` state tracking
- **Rendering & VFX:**
  - `KineticRenderer` (Flywheel Instanced Render Bridge using Dummy Entities)
  - `KineticEffectHandler` (Particle spawning, sync state to dummy properties)
- **UI & Interaction:**
  - Goggles Actionbar Overlay
  - Wrench Rotation & Sneak Dismantling

## Next Tasks
- **Contraptions (Moving Structures):** Analyze and stub the architecture for turning block sub-networks into dynamic movable entities.
- **Processing Machines:** Add core logic for Crushing Wheels, Millstones, and Mixers utilizing the `BeltInventory` hooks.
- **Fluid Networks:** Begin porting the fluid pipe graph architecture.

## Known Limitations (Bedrock Specific)
- **Visual Instancing:** We are using invisible dummy entities (`create:shaft_visual`) driven by Molang `query.property('create:speed')`. This works perfectly for smooth, data-driven animations, but spawns an entity per kinetic block. We must monitor engine limits on low-end devices.

## Known Bugs
- None currently. All 21 core Jest tests passing.
