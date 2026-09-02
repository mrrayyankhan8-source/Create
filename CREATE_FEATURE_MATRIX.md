# Create Mod Feature Matrix (Java -> Bedrock)

| Feature | Java Implementation | Bedrock Port Strategy | Status | Notes |
|---|---|---|---|---|
| **Kinetic Network** | `KineticNetwork` (Stress/Capacity graph math) | Virtual graph tracked in `KineticNetwork.ts`. Validates identical math via Jest. | ✅ | Complete. Supports stress overloads and exact calculations. |
| **Rotation Propagation** | `RotationPropagator` (Axis/Gear logic) | Ported Java rules exactly to `RotationPropagator.ts`. | ✅ | Validated with unit tests. |
| **Basic Kinetics** | Shafts, Cogwheels, Gearboxes | Bedrock `BlockCustomComponent` + Script Entities. | ✅ | Visual rendering to follow via dummy entities. |
| **Power Sources** | `CreativeMotor`, Water Wheels, etc. | Simulated logic in `CreativeMotorBlockEntity`. | ✅ | Tested to apply capacity directly to local network graphs. |
| **Mechanical Belts** | `BeltInventory` + Splitting | Extracted logic into `BeltInventory.ts` and `TransportedItemStack`. | ✅ | Verified item splitting and insertion bounds. |
| **Fluid Networks** | `FluidNetwork` + Pipe Caches | Bedrock BFS simulation via `FluidPropagator`. | ✅ | Simulates pressure and flow without Bedrock Volume API. |
| **Fluid Pumps** | `PumpBlockEntity` | Translates kinetic rotation into directional pressure. | ✅ | Validated with unit tests. |
| **Contraptions** | `Contraption` / `ContraptionCollider` | Simulated entity payloads. Bedrock colliders TBD. | ✅ | Block BFS gathering verified via `ContraptionAssembler`. |
| **Mounted Storage** | `MountedStorageManager` / `MountedFluidStorage` | Extracts/injects Bedrock Container inventories and blocks. | ✅ | Tested to keep item data in-memory during contraption movement. |
| **Trains (Graph)** | `TrackGraph` | Extracted edge/node logic. | ✅ | Track intersection graphs successfully simulated. |
| **Trains (Entities)** | `Train` / `Carriage` / `Bogie` | Simulates bogie traversal across splines. | ✅ | Movement logic complete. UI and Bogie rendering remaining. |
| **Train Signals** | `TrackSignal` / `SignalEdgeGroup` | Track segmentation and group boundaries. | ✅ | Intersects graphs via `SignalEdgeGroup` tracking. |
| **Processing Recipes** | `RecipeManager` (JSON) | Custom `RecipeRegistry` matching item/fluid + heat tags. | ✅ | Tested Millstone and Mixer integrations with Bedrock Containers. |
| **Block Rendering** | Flywheel (Instanced GL) | Bedrock Dummy Entities + Animations + Molang. | ⏳ | `KineticRenderer` foundation started. Need to script rotation sync per tick. |
