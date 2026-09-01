# Port Status

## Completed
* Setup base directories, TS config, JSON generator, and testing.
* Designed Bedrock Architecture, `KineticNetwork`, and `RotationPropagator`.
* Implemented block stress and capacity systems.
* Implemented and tested base moving parts (Shafts, Cogwheels, Gearboxes, Encased Shafts, Belt Inventories).
* Implemented foundational dummy visualization schemas (`BlockPermutation`, geometry state logic).
* Implemented Fluid Networks (BFS propagation via `FluidPropagator`, basic `PumpBlockEntity` logic).
* Implemented preliminary Contraption block assembly via BFS (`ContraptionAssembler`).
* Implemented foundational Track, Station, Train and Signal architectures.
* Fixed critical Bedrock ESM initialization logic related to `@minecraft/server` circular dependencies.
* Implemented global `RecipeRegistry.ts` replicating Create's JSON-driven recipe behaviors.
* Integrated Millstone and Mechanical Mixer natively with Bedrock `minecraft:inventory` components.
* **Implemented Contraption Mounted Storage (Items & Fluids), enabling moving structures to dynamically retain their block inventories.**

## Analyzed
* Kinetic mechanics and propagation.
* Basic kinetic blocks.
* Fluid mechanics.
* Contraption structures and Sub-Networks (`MountedStorageManager`, `MountedFluidStorage`).
* Train and signal subsystems.
* Processing recipes.

## Implemented
* Core Kinetics (`KineticBlockEntity`, `KineticNetwork`, `TorquePropagator`, `RotationPropagator`).
* Machinery (`CreativeMotorBlockEntity`, `MillstoneBlockEntity`, `MechanicalMixerBlockEntity`, `CrushingWheelBlockEntity`).
* Moving Structures (`ContraptionAssembler`, `Contraption`, `MountedStorageManager`, `MountedFluidStorage`).
* Fluid Handling (`FluidPropagator`, `PumpBlockEntity`).
* Trains & Rail (`TrackGraph`, `Train`, `TrainStationBlockEntity`, `TrackSignalBlockEntity`).
* Data/API (`RecipeRegistry`).
* Extensively verified through 36 unit tests (Jest).

## Tested
* All TypeScript files strictly type check (isolatedModules compliance enforced).
* 36/36 Jest unit tests passing spanning Kinetics, Stress, Trains, Contraptions, Belts, Recipes, and Mounted Storage.

## Remaining
* Trains UI, Scheduling, and specific bogie visualization models.
* Implement UI/Container bridging for block configuration (e.g. Filter UI, Station UI, Train Schedule UI).
* Bedrock-native rendering hooks for dynamically rotating gears/contraptions (via Dummy Entities + Molang).

## Current Task
* Pre-commit checks and submit branch.

## Limitations
* Create uses a custom rendering pipeline (Flywheel). The Bedrock port utilizes dynamic dummy entities + resource pack animations/Molang as the closest functional equivalent.
* Strict Bedrock QuickJS ES Module context forbids global cross-require dynamic loading unless carefully decoupled.
* Bedrock has no native Fluid API yet, so `minecraft:inventory` with buckets/custom items serves as intermediate fluid representation until a robust script-level volume API is fully mapped. Mounted Fluid storage utilizes a placeholder map schema for this integration.

## Bugs
* None currently identified.
