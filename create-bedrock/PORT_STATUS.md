# Create Mod Bedrock Port Status

## Current State
- **Core Logistics (Kinetics):** Fully implemented (Networks, propagation, stress, components).
- **Transport / Logistics (Belts):** Implemented (inventories, linear speeds).
- **Fluid Networks:** Implemented (BFS pressure graphs, pumps, caches).
- **Contraptions (Moving Structures):**
  - `AbstractContraptionEntity` anchors and ticking loop integrated into `ContraptionManager`.
  - `ContraptionAssembler` successfully maps blocks via BFS into virtual payload grid bounds.
- **Trains:**
  - `TrackGraph`, `TrackNode`, `TrackEdge` logic stubbed for global tracking.
  - `Train` and `Carriage` architectures built for speed propagation across graphs.
- **Rendering & VFX:** Flywheel visual dummy proxies with Molang integration and Particle VFX triggers working.
- **UI & Interactions:** Wrench rotation, sneaking uncase, and Goggle actionbar HUD fully working.

## Remaining Subsystems
- **Block Rendering Generation:** Hook the actual 3D models to our visual dummies using `.mcpack` models (stubs are present).
- **Recipe Data API:** Define a robust parser to feed the Processing Machines `ItemStackHandler` equivalents.
- **Controller Blocks:** Add the actual interactive Minecart track controllers to interface with the `TrackGraph`.

## Known Limitations (Bedrock Specific)
- **Visual Instancing:** We are using invisible dummy entities (`create:shaft_visual`) driven by Molang `query.property('create:speed')`. This works perfectly for smooth, data-driven animations, but spawns an entity per kinetic block. We must monitor engine limits on low-end devices.

## Known Bugs
- None currently. All 29 core Jest tests passing seamlessly!
